import { useEffect, useMemo, useReducer } from 'react';
import { FileText, Lock, Mountain, Scissors, Trophy, type LucideIcon } from 'lucide-react';
import { describeWin, MOVE_LABEL, randomMove, type Move } from '@/game/rps';
import { buildParticipants } from '@/game/participants';
import type { MatchSetup } from '@/types';
import GlowButton from '@/components/GlowButton';
import TopBar from '@/components/TopBar';
import Scoreboard from '@/components/Scoreboard';
import Confetti from '@/components/Confetti';
import {
  createRpsState,
  getChampions,
  isMatchDecided,
  rpsReducer,
  ROUND_LIMIT,
  type RpsConfig,
} from './rpsReducer';

interface RpsGameScreenProps {
  setup: MatchSetup;
  turnOffset: number;
  onHome: () => void;
  onMainMenu: () => void;
  onRestart: () => void;
  onRematch: () => void;
}

const MOVE_ICON: Record<Move, LucideIcon> = {
  stone: Mountain,
  paper: FileText,
  scissors: Scissors,
};

const MOVE_ORDER: Move[] = ['stone', 'paper', 'scissors'];

export default function RpsGameScreen({ setup, turnOffset, onHome, onMainMenu, onRestart, onRematch }: RpsGameScreenProps) {
  const participants = useMemo(() => buildParticipants(setup), [setup]);
  const config = useMemo<RpsConfig>(() => {
    const humans = participants.flatMap((p, i) => (p.isComputer ? [] : [i]));
    const offset = turnOffset % humans.length;
    return {
      participantCount: participants.length,
      order: [...humans.slice(offset), ...humans.slice(0, offset)],
      bestOf5: setup.rpsFormat === 'best5',
    };
  }, [participants, setup.rpsFormat, turnOffset]);

  const [state, dispatch] = useReducer(rpsReducer, config, createRpsState);
  const cpuIndex = participants.findIndex((p) => p.isComputer);
  const isComputerMode = cpuIndex >= 0;
  const humanIndex = config.order[0];
  const matchDecided = isMatchDecided(state);
  const activeIndex = state.phase === 'handoff' || state.phase === 'choose' ? config.order[state.turn] : -1;
  const active = activeIndex >= 0 ? participants[activeIndex] : null;

  useEffect(() => {
    if (state.phase !== 'countdown') return;
    const timer = window.setTimeout(() => dispatch({ type: 'TICK' }), 800);
    return () => window.clearTimeout(timer);
  }, [state.phase, state.countdown]);

  const handlePick = (move: Move) => {
    dispatch({
      type: 'PICK',
      move,
      cpu: isComputerMode ? { index: cpuIndex, move: randomMove() } : undefined,
    });
  };

  const roundLabel = config.bestOf5 ? `Round ${state.round} of ${ROUND_LIMIT}` : `Round ${state.round}`;
  const last = state.last;

  const headline = (() => {
    if (!last) return '';
    if (last.winningMove === null) return "It's a Draw";
    if (isComputerMode) {
      const outcome = last.outcomes[humanIndex];
      return outcome === 'win' ? 'You Win' : 'You Lose';
    }
    const winners = participants.filter((_, i) => last.outcomes[i] === 'win').map((p) => p.name);
    return `${winners.join(' & ')} ${winners.length > 1 ? 'win' : 'wins'} the round!`;
  })();

  const champions = getChampions(state.wins);

  return (
    <div className="min-h-screen">
      <TopBar title="Stone Paper Scissors" onHome={onHome} back={{ label: 'Main Menu', onClick: onMainMenu }} />

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <Scoreboard
            entries={participants.map((p, i) => ({ name: p.name, color: p.color, wins: state.wins[i] }))}
            draws={state.draws}
            roundLabel={roundLabel}
          />
          <div className="glass rounded-2xl p-4">
            <p className="text-sm text-slate-300">
              {config.bestOf5 ? 'Best of 5: first to 3 round wins.' : 'Classic: play rounds until you end the match.'}
            </p>
            <GlowButton variant="secondary" size="md" className="mt-4 w-full" onClick={onRestart}>
              Reset Score
            </GlowButton>
          </div>
        </aside>

        <section className="glass flex min-h-[480px] flex-col gap-6 rounded-3xl p-5 sm:p-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {participants.map((p, i) => {
              const revealed = state.phase === 'reveal' && last ? last.moves[i] : null;
              const locked = state.picks[i] !== null && state.phase !== 'reveal';
              const isActive = i === activeIndex;
              return (
                <div
                  key={i}
                  className={`rounded-2xl border bg-slate-950/50 p-3 text-center transition-all duration-300 ${
                    isActive ? 'border-cyan-300/70 shadow-[0_0_24px_rgba(56,189,248,0.3)]' : 'border-white/10'
                  }`}
                  style={{ borderTopColor: p.color, borderTopWidth: 3 }}
                >
                  <p className="truncate text-xs font-bold uppercase tracking-wider text-slate-200">{p.name}</p>
                  <div className="mx-auto mt-3 flex h-20 w-full items-center justify-center rounded-xl bg-slate-900/80">
                    {revealed ? (
                      <CardIcon move={revealed} />
                    ) : locked ? (
                      <span className="flex flex-col items-center gap-1 text-xs font-bold uppercase text-emerald-300">
                        <Lock className="h-5 w-5" /> Locked
                      </span>
                    ) : (
                      <span className="font-display text-3xl font-extrabold text-slate-500">?</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-1 flex-col items-center justify-center text-center">
            {state.phase === 'handoff' && active && (
              <div key={`handoff-${state.round}-${state.turn}`} className="animate-rise-in flex flex-col items-center gap-5">
                <Lock className="h-10 w-10 text-cyan-300" />
                <h2 className="font-display text-2xl font-extrabold uppercase text-white">Pass the device to {active.name}</h2>
                <p className="max-w-md text-base text-slate-300">
                  Everyone else look away. Only {active.name} should see the move buttons.
                </p>
                <GlowButton size="lg" onClick={() => dispatch({ type: 'READY' })}>
                  I'm {active.name}, Show Moves
                </GlowButton>
              </div>
            )}

            {state.phase === 'choose' && (
              <div key={`choose-${state.round}-${state.turn}`} className="animate-rise-in flex w-full flex-col items-center gap-6">
                <h2 className="font-display text-2xl font-extrabold uppercase text-white">
                  {active && !isComputerMode ? `${active.name}, choose your move` : 'Choose your move'}
                </h2>
                <div className="grid w-full max-w-xl grid-cols-3 gap-3 sm:gap-5">
                  {MOVE_ORDER.map((move) => (
                    <MoveButton key={move} move={move} onClick={() => handlePick(move)} />
                  ))}
                </div>
              </div>
            )}

            {state.phase === 'countdown' && (
              <div className="flex flex-col items-center gap-4">
                <p
                  key={state.countdown}
                  className="animate-count font-display text-8xl font-extrabold text-transparent gradient-text"
                >
                  {state.countdown}
                </p>
                <p className="text-lg uppercase tracking-wider text-slate-300">Moves locked. Revealing...</p>
              </div>
            )}

            {state.phase === 'reveal' && last && (
              <div className="flex w-full flex-col items-center gap-6">
                <div className="animate-pop">
                  <p className="font-display text-3xl font-extrabold uppercase text-white sm:text-4xl">{headline}</p>
                  <p className="mt-2 text-lg text-cyan-200">
                    {last.winningMove ? describeWin(last.winningMove) : 'Nobody takes this round'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {matchDecided ? (
                    <GlowButton onClick={() => dispatch({ type: 'FINISH' })} icon={<Trophy className="h-4 w-4" />}>
                      See Final Result
                    </GlowButton>
                  ) : (
                    <>
                      <GlowButton onClick={() => dispatch({ type: 'NEXT_ROUND' })}>Next Round</GlowButton>
                      {!config.bestOf5 && (
                        <GlowButton variant="secondary" onClick={() => dispatch({ type: 'FINISH' })}>
                          End Match
                        </GlowButton>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {state.phase === 'matchOver' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <Confetti />
          <div className="animate-rise-in glass animate-victory-glow relative w-full max-w-md rounded-3xl p-8 text-center">
            <Trophy className="mx-auto h-14 w-14 text-amber-300" />
            <h2 className="mt-4 font-display text-2xl font-extrabold uppercase text-white">
              {champions.length > 1 ? "It's a Tie!" : `${participants[champions[0]].name} Wins the Match!`}
            </h2>
            <p className="mt-3 text-base text-slate-300">
              {participants.map((p, i) => `${p.name} ${state.wins[i]}`).join('  •  ')} · {state.draws} draws
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <GlowButton onClick={onRestart}>Play Again</GlowButton>
              <GlowButton variant="secondary" onClick={onRematch}>Rematch</GlowButton>
              <GlowButton variant="ghost" onClick={onMainMenu}>Main Menu</GlowButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MoveButton({ move, onClick }: { move: Move; onClick: () => void }) {
  const Icon = MOVE_ICON[move];
  return (
    <button
      type="button"
      onClick={onClick}
      className="focus-ring group flex flex-col items-center gap-3 rounded-2xl border border-cyan-300/30 bg-slate-950/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/80 hover:shadow-[0_0_30px_rgba(56,189,248,0.35)] active:scale-95 sm:p-6"
    >
      <Icon className="h-10 w-10 text-cyan-200 transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14" />
      <span className="font-display text-xs font-bold uppercase tracking-wider text-white sm:text-sm">{MOVE_LABEL[move]}</span>
    </button>
  );
}

function CardIcon({ move }: { move: Move }) {
  const Icon = MOVE_ICON[move];
  return (
    <span className="animate-reveal flex flex-col items-center gap-1 text-cyan-100">
      <Icon className="h-9 w-9" />
      <span className="text-[11px] font-bold uppercase tracking-wider">{MOVE_LABEL[move]}</span>
    </span>
  );
}
