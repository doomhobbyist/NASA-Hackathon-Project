import React from 'react';
import { Volume2, Compass, Square, Music } from 'lucide-react';
import heroSunsetImg from '../assets/images/hero_martian_sunset_1794670727832.jpg';

interface HeroSectionProps {
  onPlayOpening: () => void;
  onStopOpening: () => void;
  isOpeningPlaying: boolean;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  onExploreMap: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onPlayOpening,
  onStopOpening,
  isOpeningPlaying,
  isMusicPlaying,
  onToggleMusic,
  onExploreMap,
}) => {
  return (
    <section
      aria-label="Martian sunset introduction"
      className="relative overflow-hidden border-b border-white/10 bg-[#07090F]"
    >
      {/* Real Martian Blue-Tinted Sunset Artwork */}
      <div className="absolute inset-0">
        <img
          src={heroSunsetImg}
          alt="A Martian sunset with a pale blue glow around the distant Sun over rusty cratered plains"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090F] via-[#07090F]/55 to-[#07090F]/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07090F]/85 via-[#07090F]/45 to-transparent" />
      </div>

      {/* Subtle twinkling stars & floating Martian dust motes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <span
          className="animate-twinkle absolute top-12 left-[18%] h-1 w-1 rounded-full bg-sky-200"
          style={{ animationDelay: '0.2s' }}
        />
        <span
          className="animate-twinkle absolute top-20 left-[44%] h-1.5 w-1.5 rounded-full bg-amber-100"
          style={{ animationDelay: '1.1s' }}
        />
        <span
          className="animate-twinkle absolute top-10 right-[22%] h-1 w-1 rounded-full bg-sky-100"
          style={{ animationDelay: '2.3s' }}
        />
        <span
          className="animate-dust absolute bottom-24 left-[14%] h-1.5 w-1.5 rounded-full bg-amber-300/40"
          style={{ animationDelay: '0.5s' }}
        />
        <span
          className="animate-dust absolute bottom-32 left-[35%] h-1 w-1 rounded-full bg-orange-200/35"
          style={{ animationDelay: '3.2s' }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28 lg:py-32">
        <div className="max-w-2xl">
          <p className="font-mono text-xs tracking-wider text-sky-300">
            Mars &amp; Deep Space · 1972 – 2024
          </p>

          <h1
            className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
            style={{ textWrap: 'balance' }}
          >
            Silent Machines
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
            Beneath Mars’s blue-tinted sunsets—and drifting out beyond the asteroids—rest ten
            ended NASA robotic explorers. Ride along with our scout rover and Pip to hear their
            real discoveries in warm human voices.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            {isOpeningPlaying ? (
              <button
                type="button"
                onClick={onStopOpening}
                className="inline-flex min-h-[44px] items-center gap-2.5 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Square className="h-4 w-4 fill-current" />
                <span>Stop Opening</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onPlayOpening}
                className="inline-flex min-h-[44px] items-center gap-2.5 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Volume2 className="h-4 w-4" />
                <span>Play the opening</span>
              </button>
            )}

            <button
              type="button"
              onClick={onExploreMap}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-white/20 bg-slate-950/60 px-5 py-2.5 text-sm font-medium text-slate-100 backdrop-blur-sm transition-colors hover:border-sky-400/50 hover:bg-slate-900/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Compass className="h-4 w-4 text-sky-300" />
              <span>Drive the Mars Map</span>
            </button>

            <button
              type="button"
              onClick={onToggleMusic}
              aria-pressed={isMusicPlaying}
              className={`inline-flex min-h-[44px] items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 whitespace-nowrap shrink-0 cursor-pointer ${
                isMusicPlaying
                  ? 'border-sky-400/50 bg-sky-500/15 text-sky-200'
                  : 'border-white/15 bg-slate-950/45 text-slate-300 hover:border-white/30 hover:text-white'
              }`}
            >
              <Music className="h-4 w-4" />
              <span>{isMusicPlaying ? 'Ambient Music On' : 'Ambient Music'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
