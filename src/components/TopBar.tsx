import { ArrowLeft, Home } from 'lucide-react';
import GlowButton from '@/components/GlowButton';

interface TopBarProps {
  title: string;
  onHome: () => void;
  back?: { label: string; onClick: () => void };
}

export default function TopBar({ title, onHome, back }: TopBarProps) {
  return (
    <header className="glass sticky top-0 z-30 border-x-0 border-t-0">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          {back && (
            <GlowButton variant="ghost" size="md" onClick={back.onClick} icon={<ArrowLeft className="h-4 w-4" />}>
              <span className="hidden sm:inline">{back.label}</span>
            </GlowButton>
          )}
        </div>
        <h2 className="font-display truncate text-xs font-extrabold uppercase tracking-[0.2em] text-cyan-100 sm:text-sm">
          {title}
        </h2>
        <GlowButton variant="secondary" size="md" onClick={onHome} icon={<Home className="h-4 w-4" />}>
          <span className="hidden sm:inline">Home</span>
        </GlowButton>
      </div>
    </header>
  );
}
