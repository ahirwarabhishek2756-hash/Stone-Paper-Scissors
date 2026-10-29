import { Play } from 'lucide-react';
import GlowButton from '@/components/GlowButton';
import HeroArt from '@/components/HeroArt';

interface WelcomeScreenProps {
  onStart: () => void;
}

const TAGS = ['Stone Paper Scissors', 'Snakes & Ladders'];

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
      <div className="fixed inset-0 z-50 animate-curtain bg-[#02030a]" aria-hidden="true" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <p className="animate-rise-in mb-4 font-display text-xs uppercase tracking-[0.4em] text-indigo-300" style={{ animationDelay: '0.2s' }}>
            Welcome, challenger
          </p>
          <h1
            className="animate-rise-in gradient-text font-display text-4xl font-extrabold uppercase sm:text-5xl lg:text-6xl"
            style={{ animationDelay: '0.35s' }}
          >
            Welcome to Anime Play Arena
          </h1>
          <p className="animate-rise-in mt-6 text-lg text-slate-300 sm:text-xl" style={{ animationDelay: '0.5s' }}>
            Choose Your Game. Challenge Your Friends. Become a Legend.
          </p>

          <div className="animate-rise-in mt-8 flex flex-wrap justify-center gap-3 lg:justify-start" style={{ animationDelay: '0.6s' }}>
            {TAGS.map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-slate-200">
                {tag}
              </span>
            ))}
          </div>

          <div className="animate-rise-in mt-10" style={{ animationDelay: '0.75s' }}>
            <GlowButton size="lg" onClick={onStart} icon={<Play className="h-5 w-5 fill-current" />}>
              Let's Play
            </GlowButton>
          </div>
        </div>

        <div className="animate-rise-in order-1 flex justify-center lg:order-2" style={{ animationDelay: '0.3s' }}>
          <div className="relative w-full max-w-[380px]">
            <div className="absolute inset-6 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="absolute inset-0 rounded-[2rem] border border-white/10" />
            <HeroArt className="animate-float relative h-auto w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
