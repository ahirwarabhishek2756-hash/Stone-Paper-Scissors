const COLORS = ['#22d3ee', '#f472b6', '#fbbf24', '#a3e635', '#60a5fa'];

const PIECES = Array.from({ length: 70 }, (_, i) => ({
  left: (i * 29) % 100,
  delay: (i % 12) * 0.14,
  duration: 2.8 + (i % 5) * 0.4,
  color: COLORS[i % COLORS.length],
  size: 6 + (i % 4) * 2,
  round: i % 3 === 0,
}));

export default function Confetti() {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
      {PIECES.map((p, i) => (
        <span
          key={i}
          className="animate-confetti absolute -top-4 block"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.round ? p.size : p.size * 0.45,
            borderRadius: p.round ? '9999px' : '2px',
            background: p.color,
            boxShadow: `0 0 8px ${p.color}`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
