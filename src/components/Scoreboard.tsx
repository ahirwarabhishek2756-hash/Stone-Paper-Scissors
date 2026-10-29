export interface ScoreEntry {
  name: string;
  color: string;
  wins: number;
}

interface ScoreboardProps {
  entries: ScoreEntry[];
  draws: number;
  roundLabel: string;
}

export default function Scoreboard({ entries, draws, roundLabel }: ScoreboardProps) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-100">Scoreboard</h3>
        <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-200">
          {roundLabel}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-2">
        {entries.map((entry) => (
          <div
            key={entry.name}
            className="rounded-xl border border-white/10 bg-slate-950/50 p-3 transition-transform duration-300 hover:-translate-y-0.5"
            style={{ borderTopColor: entry.color, borderTopWidth: 3 }}
          >
            <p className="truncate text-xs font-bold uppercase tracking-wider text-slate-300">{entry.name}</p>
            <p key={entry.wins} className="animate-count font-display text-2xl font-extrabold text-white">
              {entry.wins}
            </p>
          </div>
        ))}
        <div className="rounded-xl border border-white/10 bg-slate-950/50 p-3 transition-transform duration-300 hover:-translate-y-0.5" style={{ borderTopColor: '#a78bfa', borderTopWidth: 3 }}>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-300">Draws</p>
          <p key={draws} className="animate-count font-display text-2xl font-extrabold text-white">
            {draws}
          </p>
        </div>
      </div>
    </div>
  );
}
