import { BOARD_SIZE, LADDERS, SNAKES } from '@/game/snakes';
import type { Participant } from '@/types';

interface SnakesBoardProps {
  participants: Participant[];
  positions: number[];
}

interface Point {
  x: number;
  y: number;
}

const TOKEN_OFFSETS: Point[] = [
  { x: -1.6, y: -1.6 },
  { x: 1.6, y: -1.6 },
  { x: -1.6, y: 1.6 },
  { x: 1.6, y: 1.6 },
];

const DISPLAY_ROWS = Array.from({ length: 10 }, (_, displayRow) =>
  Array.from({ length: 10 }, (_, col) => {
    const row = 9 - displayRow;
    const colInRow = row % 2 === 0 ? col : 9 - col;
    return row * 10 + colInRow + 1;
  })
);

function squareCenter(square: number): Point {
  const index = square - 1;
  const row = Math.floor(index / 10);
  const colInRow = index % 10;
  const col = row % 2 === 0 ? colInRow : 9 - colInRow;
  const displayRow = 9 - row;
  return { x: (col + 0.5) * 10, y: (displayRow + 0.5) * 10 };
}

function unitNormal(a: Point, b: Point): { len: number; nx: number; ny: number } {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  return { len, nx: -dy / len, ny: dx / len };
}

function snakePath(head: Point, tail: Point): string {
  const { len, nx, ny } = unitNormal(head, tail);
  const dx = tail.x - head.x;
  const dy = tail.y - head.y;
  const amp = Math.min(7, len * 0.18);
  const c1 = { x: head.x + dx / 3 + nx * amp, y: head.y + dy / 3 + ny * amp };
  const c2 = { x: head.x + (2 * dx) / 3 - nx * amp, y: head.y + (2 * dy) / 3 - ny * amp };
  return `M${head.x} ${head.y} C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${tail.x} ${tail.y}`;
}

function ladderPath(bottom: Point, top: Point): string {
  const { len, nx, ny } = unitNormal(bottom, top);
  const w = 1.3;
  const dx = top.x - bottom.x;
  const dy = top.y - bottom.y;
  const rails = `M${bottom.x + nx * w} ${bottom.y + ny * w} L${top.x + nx * w} ${top.y + ny * w} M${bottom.x - nx * w} ${bottom.y - ny * w} L${top.x - nx * w} ${top.y - ny * w}`;
  const count = Math.max(3, Math.round(len / 5));
  const rungs = Array.from({ length: count - 1 }, (_, i) => {
    const t = (i + 1) / count;
    const cx = bottom.x + dx * t;
    const cy = bottom.y + dy * t;
    return `M${cx + nx * w} ${cy + ny * w} L${cx - nx * w} ${cy - ny * w}`;
  });
  return `${rails} ${rungs.join(' ')}`;
}

const SNAKE_PATHS = Object.entries(SNAKES).map(([from, to]) => ({
  key: `snake-${from}`,
  d: snakePath(squareCenter(Number(from)), squareCenter(to)),
  head: squareCenter(Number(from)),
}));

const LADDER_PATHS = Object.entries(LADDERS).map(([from, to]) => ({
  key: `ladder-${from}`,
  d: ladderPath(squareCenter(Number(from)), squareCenter(to)),
}));

export default function SnakesBoard({ participants, positions }: SnakesBoardProps) {
  return (
    <div className="glass rounded-3xl p-3 sm:p-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
        <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 gap-px bg-slate-950/70">
          {DISPLAY_ROWS.flatMap((row, r) =>
            row.map((square, c) => (
              <div
                key={square}
                className={`flex items-start justify-start p-1 font-bold leading-none text-slate-300/80 ${
                  (r + c) % 2 === 0 ? 'bg-slate-800/70' : 'bg-slate-900/90'
                }`}
                style={{ fontSize: 'clamp(7px, 1.3vw, 12px)' }}
              >
                {square}
              </div>
            ))
          )}
        </div>

        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          {LADDER_PATHS.map((ladder) => (
            <path key={ladder.key} d={ladder.d} stroke="#fbbf24" strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.9" />
          ))}
          {SNAKE_PATHS.map((snake) => (
            <g key={snake.key}>
              <path d={snake.d} stroke="#0f172a" strokeWidth="3.4" strokeLinecap="round" fill="none" opacity="0.6" />
              <path d={snake.d} stroke="#f472b6" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.95" />
              <circle cx={snake.head.x} cy={snake.head.y} r="1.7" fill="#f472b6" />
              <circle cx={snake.head.x + 0.5} cy={snake.head.y - 0.4} r="0.4" fill="#0f172a" />
            </g>
          ))}
        </svg>

        {participants.map((p, i) => {
          const center = squareCenter(positions[i] || 1);
          const offset = TOKEN_OFFSETS[i];
          return (
            <div
              key={i}
              className="absolute flex h-[6%] w-[6%] items-center justify-center rounded-full border-2 border-white text-[10px] font-extrabold text-slate-950 transition-[left,top] duration-300 ease-out sm:text-xs"
              style={{
                left: `${center.x + offset.x}%`,
                top: `${center.y + offset.y}%`,
                transform: 'translate(-50%, -50%)',
                background: p.color,
                color: p.color,
              }}
              title={p.name}
            >
              <span className="text-slate-950">{p.name.charAt(0).toUpperCase()}</span>
            </div>
          );
        })}
      </div>
      <p className="sr-only">Board squares run from 1 to {BOARD_SIZE}.</p>
    </div>
  );
}
