import React, { useState } from 'react';
import { Volume2, CheckCircle2, XCircle, RotateCcw, Compass, Award } from 'lucide-react';
import { QuizQuestion } from '../data/missions';
import { audioEngine } from '../lib/audioEngine';

interface MissionQuizProps {
  questions: QuizQuestion[];
  onVisitMission: (missionId: string) => void;
}

function getExplorerRank(score: number, total: number): { title: string; summary: string } {
  if (score === total) {
    return {
      title: 'Chief Mars & Deep-Space Historian',
      summary:
        'Every single machine recognized! You know these robotic pioneers as well as a NASA flight director.',
    };
  }
  if (score >= 3) {
    return {
      title: 'Orbital Navigator',
      summary:
        'Sharp space instincts! Drive Pip over to any machines you missed to unlock their hidden stories.',
    };
  }
  return {
    title: 'Junior Mars Scout',
    summary:
      'Great start, explorer! Hop back into the rover with Pip, visit a few more landing sites, and try again.',
  };
}

export const MissionQuiz: React.FC<MissionQuizProps> = ({ questions, onVisitMission }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [finished, setFinished] = useState<boolean>(false);

  const currentQuestion = questions[currentIdx];
  const hasAnswered = selectedMissionId !== null;
  const isCorrect = selectedMissionId === currentQuestion.correctMissionId;

  const handleSelectOption = (missionId: string) => {
    if (hasAnswered) return;
    setSelectedMissionId(missionId);
    const correct = missionId === currentQuestion.correctMissionId;
    if (correct) {
      setScore((s) => s + 1);
    }
    audioEngine.playQuizChime(correct);
  };

  const handleNext = () => {
    if (currentIdx + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIdx((i) => i + 1);
      setSelectedMissionId(null);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedMissionId(null);
    setScore(0);
    setFinished(false);
  };

  const handleReadRiddle = () => {
    audioEngine.speak({
      text: currentQuestion.riddle,
      speakerLabel: `Quiz Riddle ${currentIdx + 1}`,
      speakerKind: 'toon',
      voiceName: 'Puck',
    });
  };

  const rank = getExplorerRank(score, questions.length);

  return (
    <section
      id="quiz"
      aria-label="Which silent machine am I quiz"
      className="border-t border-white/10 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <p className="font-mono text-xs text-amber-300">5-Question Riddle Challenge</p>
          <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Which Silent Machine Am I?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-300">
            Listen to each explorer’s clues in the first person, guess who is speaking, and earn
            your explorer rank.
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-white/10 bg-[#0F1420] p-6 sm:p-8">
          {finished ? (
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-amber-400/40 bg-amber-500/15 text-amber-300">
                <Award className="h-7 w-7" />
              </div>

              <p className="mt-4 font-mono text-xs tabular-nums text-sky-300">
                Final Score · {score} / {questions.length}
              </p>
              <h3 className="mt-1.5 font-display text-2xl font-bold text-white">{rank.title}</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-300">
                {rank.summary}
              </p>

              <button
                type="button"
                onClick={handleRestart}
                className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-400 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Play Quiz Again</span>
              </button>
            </div>
          ) : (
            <div>
              {/* Progress Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <span className="font-mono text-xs tabular-nums text-slate-400">
                  Question {currentIdx + 1} of {questions.length} · Score {score}
                </span>

                <button
                  type="button"
                  onClick={handleReadRiddle}
                  className="inline-flex min-h-[38px] items-center gap-2 rounded-lg border border-white/15 bg-slate-900/70 px-3.5 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-amber-400/50 hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Volume2 className="h-3.5 w-3.5 text-amber-400" />
                  <span>Read Riddle Aloud</span>
                </button>
              </div>

              {/* Riddle Text */}
              <blockquote className="mt-5 text-base font-medium leading-relaxed text-white sm:text-lg">
                “{currentQuestion.riddle}”
              </blockquote>

              {/* Answer Options */}
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {currentQuestion.options.map((opt) => {
                  const chosen = selectedMissionId === opt.missionId;
                  const optionIsCorrect = opt.missionId === currentQuestion.correctMissionId;

                  let stateStyle =
                    'border-white/10 bg-[#0B0F19] text-slate-200 hover:border-sky-400/50 hover:bg-slate-900';

                  if (hasAnswered) {
                    if (optionIsCorrect) {
                      stateStyle =
                        'border-emerald-400/70 bg-emerald-500/15 text-emerald-100';
                    } else if (chosen) {
                      stateStyle = 'border-rose-400/70 bg-rose-500/15 text-rose-100';
                    } else {
                      stateStyle = 'border-white/5 bg-[#0B0F19]/60 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={opt.missionId}
                      type="button"
                      disabled={hasAnswered}
                      onClick={() => handleSelectOption(opt.missionId)}
                      className={`flex min-h-[48px] items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors cursor-pointer disabled:cursor-default ${stateStyle}`}
                    >
                      <span>{opt.label}</span>
                      {hasAnswered && optionIsCorrect && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                      )}
                      {hasAnswered && chosen && !optionIsCorrect && (
                        <XCircle className="h-4 w-4 shrink-0 text-rose-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Instant Explanation + Link to Machine Story */}
              {hasAnswered && (
                <div className="mt-6 rounded-lg border border-white/10 bg-[#0B0F19] p-4 sm:p-5">
                  <p
                    className={`text-xs font-semibold ${
                      isCorrect ? 'text-emerald-300' : 'text-amber-300'
                    }`}
                  >
                    {isCorrect ? 'Spot on!' : 'Not quite—here is who spoke:'}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-200">
                    {currentQuestion.explanation}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => onVisitMission(currentQuestion.correctMissionId)}
                      className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-sky-400/40 bg-sky-500/10 px-3.5 py-2 text-xs font-semibold text-sky-200 transition-colors hover:bg-sky-500/20 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Compass className="h-3.5 w-3.5" />
                      <span>Open Machine’s Story on Map</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-amber-400 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>
                        {currentIdx + 1 >= questions.length ? 'See My Rank' : 'Next Riddle'}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
