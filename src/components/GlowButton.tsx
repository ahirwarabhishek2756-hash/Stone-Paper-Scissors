import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'md' | 'lg';
  icon?: ReactNode;
}

const BASE =
  'focus-ring inline-flex items-center justify-center gap-2 rounded-xl font-display font-bold uppercase tracking-wider transition-all duration-300 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 cursor-pointer';

const VARIANTS: Record<Variant, string> = {
  primary:
    'text-slate-950 bg-slate-100 hover:bg-white hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(15,23,42,0.35)]',
  secondary:
    'text-slate-100 border border-slate-400/30 bg-slate-900/60 hover:-translate-y-0.5 hover:border-indigo-300/50 hover:bg-slate-800/80',
  ghost: 'text-slate-300 hover:bg-white/5 hover:text-white',
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
