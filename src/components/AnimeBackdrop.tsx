const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  left: (i * 37) % 100,
  top: (i * 53) % 100,
  size: 2 + (i % 4),
  delay: (i % 7) * 0.7,
  duration: 6 + (i % 5) * 1.6,
  color: ['bg-cyan-300', 'bg-sky-400', 'bg-fuchsia-400', 'bg-pink-400'][i % 4],
}));

const STREAKS = [
  { top: '18%', angle: -18, delay: 0, duration: 6 },
  { top: '42%', angle: -12, delay: 2.2, duration: 7.5 },
  { top: '66%', angle: -22, delay: 4.1, duration: 6.8 },
  { top: '84%', angle: -15, delay: 1.1, duration: 8 },
];

export default function AnimeBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#050816]" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 15% 10%, rgba(14,165,233,0.22), transparent 55%), radial-gradient(ellipse at 85% 90%, rgba(192,132,252,0.2), transparent 55%), radial-gradient(ellipse at 60% 40%, rgba(236,72,153,0.12), transparent 50%), linear-gradient(180deg, #050816 0%, #070b1f 60%, #03040c 100%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148,163,184,1) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,1) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />
      <div className="animate-drift absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-sky-600/25 blur-[130px]" />
      <div
        className="animate-drift absolute -right-32 bottom-0 h-[480px] w-[480px] rounded-full bg-fuchsia-600/20 blur-[130px]"
        style={{ animationDelay: '-6s' }}
      />
      {STREAKS.map((streak, i) => (
        <div
          key={i}
          className="animate-streak absolute left-0 h-px w-[38vw] bg-gradient-to-r from-transparent via-cyan-200 to-transparent opacity-0 shadow-[0_0_12px_rgba(125,211,252,0.9)]"
          style={{
            top: streak.top,
            ['--streak-angle' as string]: `${streak.angle}deg`,
            animationDelay: `${streak.delay}s`,
            animationDuration: `${streak.duration}s`,
          }}
        />
      ))}
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className={`animate-float absolute rounded-full opacity-70 ${p.color}`}
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            boxShadow: '0 0 10px currentColor',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
