const PIPS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

interface DiceFaceProps {
  value: number;
  rolling: boolean;
}

export default function DiceFace({ value, rolling }: DiceFaceProps) {
  return (
    <div
      key={rolling ? 'rolling' : `value-${value}`}
      className={`grid h-20 w-20 grid-cols-3 grid-rows-3 gap-1 rounded-2xl border border-white/30 bg-slate-100 p-2.5 shadow-[0_6px_18px_rgba(15,23,42,0.4)] ${
        rolling ? 'animate-dice-roll' : 'animate-pop'
      }`}
      role="img"
      aria-label={`Dice showing ${value}`}
    >
      {Array.from({ length: 9 }, (_, i) => (
        <span key={i} className="flex items-center justify-center">
          {PIPS[value].includes(i) && <span className="h-2.5 w-2.5 rounded-full bg-slate-900" />}
        </span>
      ))}
    </div>
  );
}
