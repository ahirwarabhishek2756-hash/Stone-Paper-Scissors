import { useId } from 'react';

interface HeroArtProps {
  className?: string;
}

export default function HeroArt({ className = '' }: HeroArtProps) {
  const uid = useId().replace(/:/g, '');
  const hair = `${uid}-hair`;
  const coat = `${uid}-coat`;
  const aura = `${uid}-aura`;

  return (
    <svg viewBox="0 0 200 230" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={aura}>
          <stop offset="0" stopColor="#38bdf8" stopOpacity="0.55" />
          <stop offset="0.6" stopColor="#c084fc" stopOpacity="0.18" />
          <stop offset="1" stopColor="#c084fc" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={hair} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bae6fd" />
          <stop offset="0.5" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id={coat} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1e293b" />
          <stop offset="1" stopColor="#020617" />
        </linearGradient>
      </defs>

      <circle cx="100" cy="115" r="98" fill={`url(#${aura})`} />
      <path d="M30 230 C34 178 56 156 100 152 C144 156 166 178 170 230 Z" fill={`url(#${coat})`} />
      <path d="M30 230 C34 178 56 156 100 152 C144 156 166 178 170 230" fill="none" stroke="#f472b6" strokeOpacity="0.7" strokeWidth="1.5" />
      <rect x="88" y="128" width="24" height="28" rx="7" fill="#f1c7a8" />
      <path d="M72 150 L100 176 L128 150 L118 206 L82 206 Z" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
      <path d="M100 176 L100 206" stroke="#f472b6" strokeWidth="1.5" />

      <path
        d="M68 92 C68 60 80 52 100 52 C120 52 132 60 132 92 C132 124 118 142 100 142 C82 142 68 124 68 92 Z"
        fill="#fde3cf"
      />
      <path
        d="M56 104 L46 58 L66 68 L62 30 L84 46 L94 12 L104 42 L116 10 L122 42 L142 28 L136 68 L154 58 L144 104 C132 78 120 70 100 68 C80 70 68 78 56 104 Z"
        fill={`url(#${hair})`}
      />
      <path d="M66 72 Q100 62 134 72 L134 80 Q100 70 66 80 Z" fill="#22d3ee" />
      <path d="M100 63 L105 72 L100 81 L95 72 Z" fill="#fbbf24" />

      <ellipse cx="84" cy="98" rx="7" ry="5" fill="#0ea5e9" />
      <ellipse cx="116" cy="98" rx="7" ry="5" fill="#0ea5e9" />
      <circle cx="86" cy="96" r="1.8" fill="#ffffff" />
      <circle cx="118" cy="96" r="1.8" fill="#ffffff" />
      <path d="M74 90 Q84 85 93 90" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M107 90 Q116 85 126 90" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M93 121 Q100 126 107 121" stroke="#9a3412" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
