import { ArrowRight, Mountain, FileText, Scissors } from 'lucide-react';
import type { GameId } from '@/types';
import GlowButton from '@/components/GlowButton';
import TopBar from '@/components/TopBar';

interface GameSelectScreenProps {
  onHome: () => void;
  onSelect: (game: GameId) => void;
}

interface GameInfo {
  id: GameId;
  letter: string;
  title: string;
  description: string;
  accent: string;
  players: string;
}

const GAMES: GameInfo[] = [
  {
    id: 'rps',
    letter: 'A',
    title: 'Stone Paper Scissors',
    description:
      'Read your rival, lock in your move, and outthink the arena. Play quick classic rounds or a tense best-of-five showdown.',
    accent: 'from-slate-700/40 to-indigo-900/30',
    players: '1 to 4 players',
  },
  {
    id: 'snakes',
    letter: 'B',
    title: 'Snakes & Ladders',
    description:
      'Roll the dice, climb the ladders, and avoid the serpents. Race your friends to square 100 and land exactly to win.',
    accent: 'from-slate-700/40 to-violet-900/30',
    players: '1 to 4 players',
  },
];

export default function GameSelectScreen({ onHome, onSelect }: GameSelectScreenProps) {
  return (
    <div className="min-h-screen">
      <TopBar title="Game Selection" onHome={onHome} />

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="animate-rise-in mb-10 text-center">
          <p className="font-display text-xs uppercase tracking-[0.4em] text-indigo-300">Select a battle</p>
          <h1 className="gradient-text mt-3 font-display text-3xl font-extrabold uppercase sm:text-4xl">Choose Your Game</h1>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {GAMES.map((game, index) => (
            <article
              key={game.id}
              className="animate-rise-in group glass relative flex flex-col overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:-translate-y-1 hover:border-indigo-300/30 hover:shadow-[0_12px_32px_rgba(15,23,42,0.5)] sm:p-8"
              style={{ animationDelay: `${0.15 + index * 0.15}s` }}
            >
              <div className={`relative mb-6 flex h-52 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${game.accent}`}>
                <div className="absolute inset-0 opacity-40 transition-opacity duration-500 group-hover:opacity-70" style={{ background: 'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.18), transparent 60%)' }} />
                {game.id === 'rps' ? <RpsEmblem /> : <SnakeLadderArt />}
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 font-display text-sm font-extrabold text-white">
                  {game.letter}
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300">{game.players}</span>
              </div>
              <h2 className="mt-3 font-display text-2xl font-extrabold uppercase text-white">{game.title}</h2>
              <p className="mt-3 flex-1 text-base leading-relaxed text-slate-300">{game.description}</p>

              <GlowButton
                className="mt-8 w-full"
                onClick={() => onSelect(game.id)}
                icon={<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />}
              >
                Play Now
              </GlowButton>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

function RpsEmblem() {
  const items = [
    { Icon: Mountain, color: 'text-slate-200', pos: '-translate-x-16 translate-y-2' },
    { Icon: FileText, color: 'text-slate-100', pos: '-translate-y-6' },
    { Icon: Scissors, color: 'text-indigo-200', pos: 'translate-x-16 translate-y-2' },
  ];
  return (
    <div className="flex items-center justify-center">
      {items.map(({ Icon, color, pos }, i) => (
        <div
          key={i}
          className={`animate-bob absolute flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70 transition-transform duration-500 group-hover:scale-110 ${pos}`}
          style={{ animationDelay: `${i * 0.3}s` }}
        >
          <Icon className={`h-9 w-9 ${color}`} strokeWidth={1.8} />
        </div>
      ))}
    </div>
  );
}

function SnakeLadderArt() {
  return (
    <svg viewBox="0 0 220 180" className="h-full w-full p-4" aria-hidden="true">
      <g stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" opacity="0.9">
        <line x1="70" y1="170" x2="100" y2="16" />
        <line x1="110" y1="170" x2="140" y2="16" />
        {Array.from({ length: 8 }, (_, i) => {
          const t = (i + 1) / 9;
          const y = 170 - t * 154;
          return <line key={i} x1={70 + 30 * t} y1={y} x2={110 + 30 * t} y2={y} strokeWidth="3" />;
        })}
      </g>
      <path
        d="M30 40 C 70 10, 90 90, 120 70 S 170 30, 190 60"
        fill="none"
        stroke="#f472b6"
        strokeWidth="12"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path d="M30 40 C 70 10, 90 90, 120 70 S 170 30, 190 60" fill="none" stroke="#fdf2f8" strokeWidth="2" strokeDasharray="4 8" opacity="0.6" />
      <circle cx="190" cy="60" r="9" fill="#f472b6" />
      <circle cx="194" cy="57" r="2" fill="#0f172a" />
    </svg>
  );
}
