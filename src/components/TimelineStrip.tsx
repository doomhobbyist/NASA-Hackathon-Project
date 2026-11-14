import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, Volume2, Compass } from 'lucide-react';
import { TimelineEvent } from '../data/missions';
import { audioEngine } from '../lib/audioEngine';

interface TimelineStripProps {
  events: TimelineEvent[];
  onJumpToMission: (missionId: string) => void;
}

export const TimelineStrip: React.FC<TimelineStripProps> = ({ events, onJumpToMission }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activeEvent = events[activeIndex];

  // Auto-scroll active event chip into view smoothly
  useEffect(() => {
    const el = buttonRefs.current[activeIndex];
    if (el && stripRef.current) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeIndex]);

  // Play history auto-stepper
  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => {
        if (prev >= events.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2600);
    return () => clearInterval(timer);
  }, [isPlaying, events.length]);

  const stepPrev = () => {
    setIsPlaying(false);
    setActiveIndex((i) => Math.max(0, i - 1));
  };

  const stepNext = () => {
    setIsPlaying(false);
    setActiveIndex((i) => Math.min(events.length - 1, i + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      stepPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      stepNext();
    }
  };

  const handleReadEvent = () => {
    audioEngine.speak({
      text: `${activeEvent.dateLabel}. ${activeEvent.title}. ${activeEvent.summary}`,
      speakerLabel: `Timeline · ${activeEvent.year}`,
      speakerKind: 'narrator',
      voiceName: 'Zephyr',
    });
  };

  return (
    <section
      id="timeline"
      aria-label="Mission timeline from 1972 to 2024"
      className="border-t border-white/10 py-16 sm:py-20"
      onKeyDown={handleKeyDown}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs text-sky-300">
              1972 – 2024 · {events.length} Real Events
            </p>
            <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Fifty-Two Years of Exploration
            </h2>
            <p className="mt-1.5 max-w-2xl text-sm text-slate-300">
              Starts in 1972 with Pioneer 10’s launch, spans the fourteen-year “long quiet” on
              Mars, and carries through Ingenuity’s 72nd flight in 2024. Use arrow keys or press
              play to watch history advance.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={stepPrev}
              disabled={activeIndex === 0}
              aria-label="Previous timeline event"
              className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg border border-white/15 bg-[#0F1420] text-slate-200 transition-colors hover:border-white/30 hover:text-white disabled:opacity-35 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (!isPlaying && activeIndex === events.length - 1) {
                  setActiveIndex(0);
                }
                setIsPlaying((p) => !p);
              }}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-amber-400 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5 fill-current" />
                  <span>Pause History</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Play History</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={stepNext}
              disabled={activeIndex === events.length - 1}
              aria-label="Next timeline event"
              className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg border border-white/15 bg-[#0F1420] text-slate-200 transition-colors hover:border-white/30 hover:text-white disabled:opacity-35 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Horizontal Strip */}
        <div
          ref={stripRef}
          className="timeline-scroll mt-8 flex items-stretch gap-3 overflow-x-auto pb-4"
          role="listbox"
          aria-label="Timeline events"
        >
          {events.map((ev, idx) => {
            const active = idx === activeIndex;
            return (
              <button
                key={ev.id}
                ref={(el) => {
                  buttonRefs.current[idx] = el;
                }}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  setIsPlaying(false);
                  setActiveIndex(idx);
                }}
                className={`group flex min-w-[165px] max-w-[190px] shrink-0 flex-col justify-between rounded-xl border p-3.5 text-left transition-colors cursor-pointer ${
                  active
                    ? ev.isLongQuiet
                      ? 'border-slate-400/70 bg-slate-800/75 text-white'
                      : 'border-amber-400/70 bg-amber-500/15 text-white'
                    : ev.isLongQuiet
                      ? 'border-dashed border-white/15 bg-[#0B0F19] text-slate-400 hover:border-white/30'
                      : 'border-white/10 bg-[#0F1420] text-slate-300 hover:border-white/25 hover:text-white'
                }`}
              >
                <span
                  className={`font-mono text-xs tabular-nums ${
                    active
                      ? ev.isLongQuiet
                        ? 'text-slate-200'
                        : 'text-amber-300'
                      : 'text-slate-400'
                  }`}
                >
                  {ev.dateLabel}
                </span>
                <span className="mt-2 line-clamp-2 text-xs font-semibold leading-snug">
                  {ev.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Event Detail Panel */}
        <div className="mt-4 flex flex-col gap-4 rounded-xl border border-white/10 bg-[#0F1420] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-slate-400">
              <span className="tabular-nums text-amber-300">{activeEvent.dateLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">
                Event {activeIndex + 1} of {events.length}
              </span>
              {activeEvent.isLongQuiet && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-sky-300">Fourteen-Year Mars Surface Pause</span>
                </>
              )}
            </div>
            <h3 className="mt-1.5 font-display text-xl font-bold text-white">
              {activeEvent.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{activeEvent.summary}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleReadEvent}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-white/15 bg-slate-900/70 px-3.5 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-sky-400/50 hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Volume2 className="h-3.5 w-3.5 text-sky-300" />
              <span>Read Event Aloud</span>
            </button>

            {activeEvent.missionId && (
              <button
                type="button"
                onClick={() => onJumpToMission(activeEvent.missionId!)}
                className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-sky-400 px-3.5 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-sky-300 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Compass className="h-3.5 w-3.5" />
                <span>Drive to Mission</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
