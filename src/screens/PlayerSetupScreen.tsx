import { useState } from 'react';
import { ArrowLeft, Bot, Play, Users, type LucideIcon } from 'lucide-react';
import type { GameId, MatchSetup, PlayerMode, RpsFormat } from '@/types';
import GlowButton from '@/components/GlowButton';
import TopBar from '@/components/TopBar';

interface PlayerSetupScreenProps {
  game: GameId;
  onHome: () => void;
  onBack: () => void;
  onStart: (setup: MatchSetup) => void;
}

interface ModeOption {
  mode: PlayerMode;
  title: string;
  description: string;
  Icon: LucideIcon;
}

const MAX_NAME_LENGTH = 16;

function buildModeOptions(game: GameId): ModeOption[] {
  return [
    {
      mode: 'computer',
      title: 'Play with Computer',
      description:
        game === 'rps' ? 'Single player against the AI' : 'Solo run against two computer rivals',
      Icon: Bot,
    },
    { mode: 2, title: '2 Players', description: 'Play with one friend on the same device', Icon: Users },
    { mode: 3, title: '3 Players', description: 'Play with two friends on the same device', Icon: Users },
    { mode: 4, title: '4 Players', description: 'Play with three friends on the same device', Icon: Users },
  ];
}

const FORMATS: { id: RpsFormat; title: string; description: string }[] = [
  { id: 'classic', title: 'Classic', description: 'Play as many rounds as you like, then end the match' },
  { id: 'best5', title: 'Best of 5', description: 'First to 3 round wins, up to 5 rounds' },
];

export default function PlayerSetupScreen({ game, onHome, onBack, onStart }: PlayerSetupScreenProps) {
  const [mode, setMode] = useState<PlayerMode>('computer');
  const [names, setNames] = useState<string[]>(['', '', '', '']);
  const [rpsFormat, setRpsFormat] = useState<RpsFormat>('classic');

  const humanCount = mode === 'computer' ? 1 : mode;
  const title = game === 'rps' ? 'Stone Paper Scissors' : 'Snakes & Ladders';

  const updateName = (index: number, value: string) => {
    setNames((prev) => prev.map((name, i) => (i === index ? value : name)));
  };

  const handleStart = () => {
    onStart({
      game,
      mode,
      names: names.slice(0, humanCount).map((name, i) => name.trim() || `Player ${i + 1}`),
      rpsFormat,
    });
  };

  return (
    <div className="min-h-screen">
      <TopBar title={title} onHome={onHome} back={{ label: 'Back', onClick: onBack }} />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="animate-rise-in mb-8 text-center">
          <p className="font-display text-xs uppercase tracking-[0.4em] text-fuchsia-300">Player setup</p>
          <h1 className="gradient-text mt-3 font-display text-3xl font-extrabold uppercase sm:text-4xl">
            Who is playing?
          </h1>
        </div>

        <section className="grid gap-4 sm:grid-cols-2">
          {buildModeOptions(game).map(({ mode: optionMode, title: optionTitle, description, Icon }) => {
            const selected = optionMode === mode;
            return (
              <button
                key={String(optionMode)}
                type="button"
                onClick={() => setMode(optionMode)}
                aria-pressed={selected}
                className={`focus-ring group flex items-start gap-4 rounded-2xl border p-5 text-left transition-all duration-300 hover:-translate-y-0.5 ${
                  selected
                    ? 'border-cyan-300/80 bg-cyan-400/10 shadow-[0_0_30px_rgba(56,189,248,0.3)]'
                    : 'glass hover:border-cyan-300/40'
                }`}
              >
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                    selected ? 'bg-cyan-300 text-slate-950' : 'bg-white/10 text-cyan-200'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <span>
                  <span className="block font-display text-sm font-extrabold uppercase tracking-wider text-white">
                    {optionTitle}
                  </span>
                  <span className="mt-1 block text-base text-slate-300">{description}</span>
                </span>
              </button>
            );
          })}
        </section>

        {game === 'rps' && (
          <section className="glass mt-8 rounded-2xl p-5">
            <h2 className="font-display text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-100">Match format</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {FORMATS.map((format) => {
                const selected = format.id === rpsFormat;
                return (
                  <button
                    key={format.id}
                    type="button"
                    onClick={() => setRpsFormat(format.id)}
                    aria-pressed={selected}
                    className={`focus-ring rounded-xl border p-4 text-left transition-all duration-300 ${
                      selected ? 'border-fuchsia-300/70 bg-fuchsia-400/10' : 'border-white/10 bg-slate-950/40 hover:border-fuchsia-300/40'
                    }`}
                  >
                    <span className="block font-display text-sm font-bold uppercase tracking-wider text-white">{format.title}</span>
                    <span className="mt-1 block text-sm text-slate-300">{format.description}</span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        <section key={mode} className="animate-rise-in glass mt-8 rounded-2xl p-5">
          <h2 className="font-display text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-100">
            {mode === 'computer' ? 'Your name' : 'Enter player names'}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {Array.from({ length: humanCount }, (_, i) => (
              <label key={i} className="block">
                <span className="mb-1.5 block text-sm font-bold uppercase tracking-wider text-slate-300">
                  {mode === 'computer' ? 'Name' : `Player ${i + 1}`}
                </span>
                <input
                  value={names[i]}
                  onChange={(e) => updateName(i, e.target.value)}
                  maxLength={MAX_NAME_LENGTH}
                  placeholder={`Player ${i + 1}`}
                  className="focus-ring w-full rounded-xl border border-white/15 bg-slate-950/70 px-4 py-3 text-lg text-white placeholder:text-slate-500 focus:border-cyan-300/70"
                />
              </label>
            ))}
          </div>
        </section>

        <div className="mt-10 flex flex-col-reverse items-stretch justify-between gap-4 sm:flex-row sm:items-center">
          <GlowButton variant="secondary" onClick={onBack} icon={<ArrowLeft className="h-4 w-4" />}>
            Back
          </GlowButton>
          <GlowButton size="lg" onClick={handleStart} icon={<Play className="h-5 w-5 fill-current" />}>
            Start Game
          </GlowButton>
        </div>
      </main>
    </div>
  );
}
