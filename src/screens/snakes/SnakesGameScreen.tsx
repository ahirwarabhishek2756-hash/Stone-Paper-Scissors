import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Crown, Dices, Trophy } from 'lucide-react';
import { BOARD_SIZE, getJump, rollDie } from '@/game/snakes';
import { buildParticipants } from '@/game/participants';
import type { MatchSetup } from '@/types';
import GlowButton from '@/components/GlowButton';
import TopBar from '@/components/TopBar';
import Confetti from '@/components/Confetti';
import SnakesBoard from './SnakesBoard';
import DiceFace from './DiceFace';

interface SnakesGameScreenProps {
  setup: MatchSetup;
  onHome: () => void;
  onMainMenu: () => void;
  onNewGame: () => void;
}

type TurnPhase = 'ready' | 'rolling' | 'moving' | 'won';

const CPU_DELAY_MS = 1100;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export default function SnakesGameScreen({ setup, onHome, onMainMenu, onNewGame }: SnakesGameScreenProps) {
  const participants = useMemo(() => buildParticipants(setup), [setup]);
  const [positions, setPositions] = useState<number[]>(() => participants.map(() => 0));
  const [current, setCurrent] = useState(0);
  const [die, setDie] = useState(1);
  const [phase, setPhase] = useState<TurnPhase>('ready');
  const [winner, setWinner] = useState<number | null>(null);
  const [message, setMessage] = useState(`${participants[0].name} goes first. Roll the dice!`);

  const aliveRef = useRef(false);
  const positionsRef = useRef(positions);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  const takeTurn = useCallback(
    async (index: number) => {
      const name = participants[index].name;
      const next = (index + 1) % participants.length;
      const movePiece = (square: number) => {
        positionsRef.current = positionsRef.current.map((p, i) => (i === index ? square : p));
        setPositions(positionsRef.current);
      };

      setPhase('rolling');
      setMessage(`${name} is rolling...`);
      await sleep(600);
      if (!aliveRef.current) return;

      const value = rollDie();
      setDie(value);
      setPhase('moving');

      const start = positionsRef.current[index];
      const target = start + value;
      if (target > BOARD_SIZE) {
        setMessage(`${name} rolled ${value}. Needs ${BOARD_SIZE - start} or less, so the turn passes.`);
        await sleep(1100);
        if (!aliveRef.current) return;
        setCurrent(next);
        setPhase('ready');
        return;
      }

      for (let square = start + 1; square <= target; square++) {
        await sleep(230);
        if (!aliveRef.current) return;
        movePiece(square);
      }

      const jump = getJump(target);
      if (jump) {
        setMessage(jump.kind === 'ladder' ? `Ladder! ${name} climbs to ${jump.to}.` : `Snake! ${name} slides down to ${jump.to}.`);
        await sleep(700);
        if (!aliveRef.current) return;
        movePiece(jump.to);
        await sleep(500);
        if (!aliveRef.current) return;
      }

      const finalSquare = jump ? jump.to : target;
      if (finalSquare === BOARD_SIZE) {
        setWinner(index);
        setPhase('won');
        return;
      }

      setMessage(`${name} rolled ${value} and lands on ${finalSquare}.`);
      setCurrent(next);
      setPhase('ready');
    },
    [participants]
  );

  useEffect(() => {
    if (phase !== 'ready' || !participants[current].isComputer) return;
    const timer = window.setTimeout(() => {
      void takeTurn(current);
    }, CPU_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [phase, current, participants, takeTurn]);

  const active = participants[current];
  const canRoll = phase === 'ready' && !active.isComputer;
  const winnerPlayer = winner !== null ? participants[winner] : null;

  return (
    <div className="min-h-screen">
      <TopBar title="Snakes & Ladders" onHome={onHome} back={{ label: 'Main Menu', onClick: onMainMenu }} />

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <SnakesBoard participants={participants} positions={positions} />

        <aside className="space-y-4">
          <section className="glass rounded-2xl p-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300">Current turn</p>
            <p className="mt-1 font-display text-xl font-extrabold uppercase text-white" style={{ color: active.color }}>
              {active.name}
            </p>
            <div className="mt-5 flex items-center gap-5">
              <DiceFace value={die} rolling={phase === 'rolling'} />
              <div className="flex-1">
                <GlowButton
                  className="w-full"
                  onClick={() => void takeTurn(current)}
                  disabled={!canRoll}
                  icon={<Dices className="h-4 w-4" />}
                >
                  {active.isComputer && phase === 'ready' ? 'Computer Turn' : 'Roll Dice'}
                </GlowButton>
              </div>
            </div>
            <p className="mt-5 min-h-[3rem] text-base text-cyan-100" aria-live="polite">
              {message}
            </p>
          </section>

          <section className="glass rounded-2xl p-5">
            <h3 className="font-display text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-100">Players</h3>
            <ul className="mt-4 space-y-3">
              {participants.map((p, i) => (
                <li
                  key={i}
                  className={`flex items-center justify-between rounded-xl border px-3 py-2.5 transition-colors duration-300 ${
                    i === current && phase !== 'won' ? 'border-cyan-300/60 bg-cyan-400/10' : 'border-white/10 bg-slate-950/40'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="h-3.5 w-3.5 rounded-full" style={{ background: p.color, boxShadow: `0 0 10px ${p.color}` }} />
                    <span className="font-bold text-white">{p.name}</span>
                  </span>
                  <span className="text-sm font-bold text-slate-300">Square {positions[i]}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="grid grid-cols-2 gap-3">
            <GlowButton variant="secondary" onClick={onNewGame}>New Game</GlowButton>
            <GlowButton variant="ghost" onClick={onMainMenu}>Main Menu</GlowButton>
          </div>
        </aside>
      </main>

      {phase === 'won' && winnerPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <Confetti />
          <div className="animate-rise-in glass animate-victory-glow relative w-full max-w-md rounded-3xl p-8 text-center">
            <Crown className="mx-auto h-14 w-14 text-amber-300 animate-bob" />
            <p className="mt-4 font-display text-xs uppercase tracking-[0.3em] text-amber-200">Victory</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold uppercase text-white">{winnerPlayer.name} Wins!</h2>
            <p className="mt-3 flex items-center justify-center gap-2 text-base text-slate-300">
              <Trophy className="h-4 w-4 text-amber-300" /> Landed exactly on square {BOARD_SIZE}
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <GlowButton onClick={onNewGame}>New Game</GlowButton>
              <GlowButton variant="ghost" onClick={onMainMenu}>Main Menu</GlowButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
