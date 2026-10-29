import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'md' | 'lg';
  icon?: ReactNode;
}

const BASE =
  'focus-ring inline-flex items-center justify-center gap-2 rounded-xl font-display font-bold uppercase tracking-wider transition-all duration-300 ease-out active:scale-95 disabled:pointer-events-none disabled:opacity-40 cursor-pointer';

const VARIANTS: Record<Variant, string> = {
  primary:
    'text-slate-950 bg-gradient-to-r from-cyan-300 via-sky-400 to-fuchsia-400 shadow-[0_0_24px_rgba(56,189,248,0.45)] hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(232,121,249,0.6)]',
  secondary:
    'text-cyan-50 border border-cyan-300/40 bg-slate-900/70 hover:-translate-y-0.5 hover:border-cyan-300/80 hover:bg-cyan-400/10 hover:shadow-[0_0_20px_rgba(34,211,238,0.35)]',
  ghost: 'text-slate-200 hover:bg-white/10 hover:text-white',
};

const SIZES = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-10 py-4 text-base sm:text-lg',
};

export default function GlowButton({
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  children,
  type = 'button',
  ...rest
}: GlowButtonProps) {
  return (
    <button
      type={type}
      className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
