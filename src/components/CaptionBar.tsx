import React from 'react';
import { Square, Volume2, VolumeX } from 'lucide-react';
import { SpeechState } from '../lib/audioEngine';

interface CaptionBarProps {
  speechState: SpeechState;
  isMuted: boolean;
  onToggleMute: () => void;
  onStopSpeech: () => void;
}

/**
 * Accessible live caption bar showing every spoken line on screen with quick mute/stop controls.
 * Compact enough on mobile to stay well below the 15% sticky viewport cap.
 */
export const CaptionBar: React.FC<CaptionBarProps> = ({
  speechState,
  isMuted,
  onToggleMute,
  onStopSpeech,
}) => {
  const showCaptions = Boolean(speechState.captionText);

  if (!showCaptions && !isMuted) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 bottom-3 z-40 mx-auto max-w-3xl px-4"
    >
      <div className="flex items-center justify-between gap-3 rounded-xl border border-white/15 bg-[#0B0F19]/95 px-4 py-2.5 shadow-xl backdrop-blur-md">
        <div className="min-w-0 flex-1">
          {showCaptions ? (
            <>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                <span>{speechState.speakerLabel}</span>
                {speechState.isLoading && (
                  <span className="font-mono text-[11px] font-normal text-sky-300">
                    Preparing voice…
                  </span>
                )}
              </div>
              <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-slate-100 sm:text-sm">
                {speechState.captionText}
              </p>
            </>
          ) : (
            <p className="text-xs text-slate-300">
              Audio is muted. Spoken captions still appear whenever you play a story.
            </p>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {(speechState.isSpeaking || speechState.isLoading) && (
            <button
              type="button"
              onClick={onStopSpeech}
              aria-label="Stop narration"
              className="inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg border border-white/15 bg-white/5 text-slate-200 transition-colors hover:bg-white/15 hover:text-white cursor-pointer"
            >
              <Square className="h-3.5 w-3.5 fill-current" />
            </button>
          )}

          <button
            type="button"
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
            className="inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg border border-white/15 bg-white/5 text-slate-200 transition-colors hover:bg-white/15 hover:text-white cursor-pointer"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4 text-rose-300" />
            ) : (
              <Volume2 className="h-4 w-4 text-sky-300" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
