import React, { useState } from 'react';
import { Volume2, Music, ExternalLink, ChevronLeft, ChevronRight, Square } from 'lucide-react';
import { Mission } from '../data/missions';
import { audioEngine, SpeechState } from '../lib/audioEngine';

interface StoryCardProps {
  mission: Mission;
  speechState: SpeechState;
}

type ChapterKey =
  | 'whatItWas'
  | 'whatItFound'
  | 'howItEnded'
  | 'whatItTaughtUs'
  | 'whatCameNext';

const CHAPTERS: { key: ChapterKey; label: string; heading: string }[] = [
  { key: 'whatItWas', label: '01. What It Was', heading: 'What it was & how it worked' },
  { key: 'whatItFound', label: '02. Discoveries', heading: 'What it found' },
  { key: 'howItEnded', label: '03. The Silence', heading: 'How it ended' },
  { key: 'whatItTaughtUs', label: '04. Lessons', heading: 'What it taught us' },
  { key: 'whatCameNext', label: '05. Next', heading: 'What came next' },
];

export const StoryCard: React.FC<StoryCardProps> = ({ mission, speechState }) => {
  const [activeChapterIdx, setActiveChapterIdx] = useState<number>(0);

  const currentChapter = CHAPTERS[activeChapterIdx];
  const chapterBody = mission.chapters[currentChapter.key];

  const isMachineSpeaking =
    speechState.isSpeaking && speechState.speakerLabel === mission.shortName;
  const isChapterSpeaking =
    speechState.isSpeaking &&
    speechState.speakerLabel === `${mission.shortName} · ${currentChapter.heading}`;

  const handleHearMachineVoice = () => {
    if (isMachineSpeaking) {
      audioEngine.stopSpeech();
      return;
    }
    audioEngine.playMelody(mission.melody);
    setTimeout(() => {
      audioEngine.speak({
        text: mission.machineGreeting,
        speakerLabel: mission.shortName,
        speakerKind: 'machine',
        voiceName: mission.voiceName,
        style: mission.voiceStyle,
      });
    }, 650);
  };

  const handleHearChapter = () => {
    if (isChapterSpeaking) {
      audioEngine.stopSpeech();
      return;
    }
    audioEngine.speak({
      text: chapterBody,
      speakerLabel: `${mission.shortName} · ${currentChapter.heading}`,
      speakerKind: 'chapter',
      voiceName: mission.voiceName,
    });
  };

  return (
    <article
      aria-label={`Story card for ${mission.name}`}
      className="flex h-full flex-col justify-between rounded-xl border border-white/10 bg-[#0F1420] p-5 sm:p-6"
    >
      <div>
        {/* Clean text metadata kicker (Zero-pill rule) */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-slate-400">
          <span className="text-sky-300">{mission.locationName}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{mission.coordinatesLabel}</span>
        </div>

        <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-white">
          {mission.name}
        </h2>
        <p className="mt-1 text-sm text-slate-300">{mission.subtitle}</p>

        {/* Voice & Signature Melody Actions */}
        <div className="mt-4 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={handleHearMachineVoice}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-sky-400 px-3.5 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-sky-300 whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isMachineSpeaking ? (
              <>
                <Square className="h-3.5 w-3.5 fill-current" />
                <span>Stop Machine Voice</span>
              </>
            ) : (
              <>
                <Music className="h-3.5 w-3.5" />
                <span>Hear Machine’s Voice &amp; Melody</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleHearChapter}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-white/15 bg-slate-900/70 px-3.5 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-amber-400/50 hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isChapterSpeaking ? (
              <>
                <Square className="h-3.5 w-3.5 fill-current text-amber-400" />
                <span>Stop Chapter</span>
              </>
            ) : (
              <>
                <Volume2 className="h-3.5 w-3.5 text-amber-400" />
                <span>Read This Chapter</span>
              </>
            )}
          </button>
        </div>

        {/* 5-Chapter Selector */}
        <div
          role="tablist"
          aria-label="Mission story chapters"
          className="mt-5 flex flex-wrap gap-1.5 border-b border-white/10 pb-3"
        >
          {CHAPTERS.map((chap, idx) => {
            const active = idx === activeChapterIdx;
            return (
              <button
                key={chap.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveChapterIdx(idx)}
                className={`min-h-[34px] rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {chap.label}
              </button>
            );
          })}
        </div>

        {/* Active Chapter Prose */}
        <div className="mt-4">
          <h3 className="font-display text-base font-semibold text-amber-300">
            {currentChapter.heading}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-200 sm:text-[15px]">
            {chapterBody}
          </p>
        </div>

        {/* Chapter Next / Prev Controls */}
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            disabled={activeChapterIdx === 0}
            onClick={() => setActiveChapterIdx((i) => Math.max(0, i - 1))}
            className="inline-flex min-h-[36px] items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-35 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>
          <span className="font-mono text-xs tabular-nums text-slate-500">
            Chapter {activeChapterIdx + 1} / 5
          </span>
          <button
            type="button"
            disabled={activeChapterIdx === CHAPTERS.length - 1}
            onClick={() => setActiveChapterIdx((i) => Math.min(CHAPTERS.length - 1, i + 1))}
            className="inline-flex min-h-[36px] items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-35 disabled:pointer-events-none cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mission Stats & Verified NASA Link */}
      <div className="mt-6 border-t border-white/10 pt-4">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
          <div>
            <dt className="text-slate-400">Launched</dt>
            <dd className="mt-0.5 font-mono tabular-nums text-slate-100">{mission.launchDate}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Mission Ended</dt>
            <dd className="mt-0.5 font-mono tabular-nums text-slate-100">{mission.endDate}</dd>
          </div>
          <div>
            <dt className="text-slate-400">{mission.keyMetricLabel}</dt>
            <dd className="mt-0.5 font-mono tabular-nums text-amber-300">{mission.keyMetricValue}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Active Span</dt>
            <dd className="mt-0.5 font-mono tabular-nums text-slate-100">{mission.activeSpan}</dd>
          </div>
        </dl>

        <div className="mt-3.5 flex flex-col gap-2 border-t border-white/10 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400">
            <span className="text-slate-300 font-medium">Resting place:</span>{' '}
            {mission.restingPlace}
          </p>
          <a
            href={mission.nasaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-sky-300 hover:text-sky-200 hover:underline whitespace-nowrap"
          >
            <span>NASA Source</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
};
