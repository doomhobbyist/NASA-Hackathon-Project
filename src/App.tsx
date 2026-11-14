import { useEffect, useState } from 'react';
import { Volume2, Square } from 'lucide-react';
import {
  MISSIONS,
  Mission,
  MissionZone,
  OPENING_NARRATION,
  QUIZ_QUESTIONS,
  TIMELINE_EVENTS,
} from './data/missions';
import { audioEngine, SpeechState } from './lib/audioEngine';
import { HeroSection } from './components/HeroSection';
import { MarsMapExperience } from './components/MarsMapExperience';
import { StoryCard } from './components/StoryCard';
import { TimelineStrip } from './components/TimelineStrip';
import { MissionQuiz } from './components/MissionQuiz';
import { CaptionBar } from './components/CaptionBar';

export default function App() {
  const [zone, setZone] = useState<MissionZone>('mars');
  const [selectedMission, setSelectedMission] = useState<Mission>(MISSIONS[0]);
  const [triggerTravelId, setTriggerTravelId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const [speechState, setSpeechState] = useState<SpeechState>({
    isSpeaking: false,
    isLoading: false,
    speakerLabel: '',
    captionText: '',
    speakerKind: null,
  });

  useEffect(() => {
    const unsubSpeech = audioEngine.subscribe(setSpeechState);
    const unsubMusic = audioEngine.subscribeMusic(setIsMusicPlaying);
    return () => {
      unsubSpeech();
      unsubMusic();
    };
  }, []);

  const isOpeningPlaying =
    (speechState.isSpeaking || speechState.isLoading) &&
    speechState.speakerLabel === 'Silent Machines Storyteller';

  const handlePlayOpening = () => {
    if (isOpeningPlaying) {
      audioEngine.stopSpeech();
      return;
    }
    if (isMuted) {
      setIsMuted(false);
      audioEngine.setMuted(false);
    }
    audioEngine.startAmbientMusic();
    audioEngine.speak({
      text: OPENING_NARRATION,
      speakerLabel: 'Silent Machines Storyteller',
      speakerKind: 'narrator',
      voiceName: 'Zephyr',
      style:
        'Warm, cinematic, joyful human storyteller inviting school-age explorers and space fans onto Mars, gentle wonder and natural breathing, never robotic',
    });
  };

  const handleStopOpening = () => {
    audioEngine.stopSpeech();
  };

  const handleToggleMusic = () => {
    if (isMuted) {
      setIsMuted(false);
      audioEngine.setMuted(false);
    }
    audioEngine.toggleAmbientMusic();
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    audioEngine.setMuted(next);
  };

  const scrollToExplorer = (targetZone?: MissionZone) => {
    if (targetZone) {
      setZone(targetZone);
      const first = MISSIONS.find((m) => m.zone === targetZone);
      if (first) setSelectedMission(first);
    }
    document.getElementById('explorer-map')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleJumpToMission = (missionId: string) => {
    document.getElementById('explorer-map')?.scrollIntoView({ behavior: 'smooth' });
    setTriggerTravelId(missionId);
  };

  return (
    <div className="min-h-screen bg-[#07090F] text-slate-100">
      {/* Clean 3-Zone Top Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#07090F]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-6 py-3.5">
          <a
            href="#"
            className="font-display text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0"
          >
            Silent Machines
          </a>

          <nav
            aria-label="Primary sections"
            className="hidden items-center gap-6 text-sm font-medium text-slate-300 md:flex"
          >
            <button
              type="button"
              onClick={() => scrollToExplorer('mars')}
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Mars Map
            </button>
            <button
              type="button"
              onClick={() => scrollToExplorer('beyond')}
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Beyond Mars
            </button>
            <a
              href="#timeline"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Timeline
            </a>
            <a
              href="#quiz"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Quiz
            </a>
          </nav>

          <button
            type="button"
            onClick={handlePlayOpening}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-amber-400 whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isOpeningPlaying ? (
              <>
                <Square className="h-3.5 w-3.5 fill-current" />
                <span>Stop Opening</span>
              </>
            ) : (
              <>
                <Volume2 className="h-3.5 w-3.5" />
                <span>Play Opening</span>
              </>
            )}
          </button>
        </div>
      </header>

      <main className="pb-20">
        {/* Cinematic Martian Blue Sunset Hero */}
        <HeroSection
          onPlayOpening={handlePlayOpening}
          onStopOpening={handleStopOpening}
          isOpeningPlaying={isOpeningPlaying}
          isMusicPlaying={isMusicPlaying}
          onToggleMusic={handleToggleMusic}
          onExploreMap={() => scrollToExplorer('mars')}
        />

        {/* Interactive Mars & Beyond Mars Map + 5-Chapter Story Card */}
        <section
          id="explorer-map"
          aria-label="Interactive Mars and deep space explorer"
          className="mx-auto max-w-6xl px-6 py-14 sm:py-16"
        >
          <div className="mb-8 max-w-2xl">
            <p className="font-mono text-xs text-amber-300">
              Ten Ended Missions · Animated Rover &amp; Pip
            </p>
            <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Explore Where They Rest
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Pick a landing site on Mars—or switch to Beyond Mars to visit Pioneer 10, NEAR
              Shoemaker, Kepler, and Dawn. Watch our scout rover and Pip journey there, then hear
              their story come alive.
            </p>
          </div>

          <div className="grid items-stretch gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <MarsMapExperience
                missions={MISSIONS}
                selectedMission={selectedMission}
                zone={zone}
                onZoneChange={setZone}
                onSelectMission={setSelectedMission}
                speechState={speechState}
                triggerTravelToMissionId={triggerTravelId}
                onTravelTriggerConsumed={() => setTriggerTravelId(null)}
              />
            </div>

            <div className="lg:col-span-5">
              <StoryCard mission={selectedMission} speechState={speechState} />
            </div>
          </div>
        </section>

        {/* 1972–2024 Timeline Strip */}
        <TimelineStrip events={TIMELINE_EVENTS} onJumpToMission={handleJumpToMission} />

        {/* 5-Question Quiz */}
        <MissionQuiz questions={QUIZ_QUESTIONS} onVisitMission={handleJumpToMission} />
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Silent Machines · Mission dates, coordinates, and discoveries verified against NASA
            and JPL mission archives.
          </p>
          <p>
            Every spoken line displays on screen, works via keyboard, and respects reduced-motion
            preferences.
          </p>
        </div>
      </footer>

      {/* Accessible Live Spoken Captions & Mute Controls */}
      <CaptionBar
        speechState={speechState}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onStopSpeech={() => audioEngine.stopSpeech()}
      />
    </div>
  );
}
