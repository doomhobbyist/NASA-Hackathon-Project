import React from 'react';

interface ToonCompanionProps {
  mode: 'idle' | 'driving' | 'flying' | 'explaining';
  isSpeaking?: boolean;
  size?: number;
  className?: string;
}

/**
 * Pip: A friendly, expressive toon space explorer companion who rides with the rover
 * across Mars (or zooms in a space suit in Beyond Mars) and animates while explaining!
 */
export const ToonCompanion: React.FC<ToonCompanionProps> = ({
  mode,
  isSpeaking = false,
  size = 64,
  className = '',
}) => {
  const isMoving = mode === 'driving' || mode === 'flying';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none overflow-visible`}
      aria-hidden="true"
    >
      {/* Shadow on ground when not flying */}
      {mode !== 'flying' && (
        <ellipse cx="40" cy="74" rx="18" ry="4" fill="rgba(0,0,0,0.45)" />
      )}

      {/* Jetpack flame / starlight puff when flying or driving fast */}
      {isMoving && (
        <g>
          <path
            d="M16 50 C8 52, 6 58, 13 60 C9 63, 12 68, 20 62 Z"
            fill={mode === 'flying' ? '#38BDF8' : '#F59E0B'}
            opacity="0.8"
          >
            <animate
              attributeName="opacity"
              values="0.45;0.9;0.45"
              dur="0.45s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      )}

      <g>
        {mode === 'explaining' && (
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 -3; 0 0"
            dur="1.4s"
            repeatCount="indefinite"
          />
        )}
        {isMoving && (
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 -2; 0 1; 0 0"
            dur="0.55s"
            repeatCount="indefinite"
          />
        )}

        {/* Tiny backpack / thruster pack */}
        <rect x="17" y="40" width="12" height="20" rx="5" fill="#F59E0B" stroke="#0F172A" strokeWidth="2" />

        {/* Bouncy Antenna */}
        <path
          d="M40 16 Q44 9 48 6"
          stroke="#CBD5E1"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="49" cy="6" r="4" fill={isSpeaking ? '#38BDF8' : '#F59E0B'}>
          {isSpeaking && (
            <animate
              attributeName="r"
              values="3.5;5.2;3.5"
              dur="0.4s"
              repeatCount="indefinite"
            />
          )}
        </circle>

        {/* Cute rounded body */}
        <rect
          x="24"
          y="42"
          width="32"
          height="24"
          rx="11"
          fill="#F8FAFC"
          stroke="#0F172A"
          strokeWidth="2.2"
        />
        {/* Chest emblem */}
        <circle cx="40" cy="54" r="5" fill="#38BDF8" opacity="0.25" />
        <path
          d="M40 50.5 L41.2 53 L43.8 53.3 L41.9 55.1 L42.4 57.7 L40 56.4 L37.6 57.7 L38.1 55.1 L36.2 53.3 L38.8 53 Z"
          fill="#F59E0B"
        />

        {/* Little boots */}
        <rect x="28" y="63" width="9" height="7" rx="3.5" fill="#EA580C" stroke="#0F172A" strokeWidth="2" />
        <rect x="43" y="63" width="9" height="7" rx="3.5" fill="#EA580C" stroke="#0F172A" strokeWidth="2" />

        {/* Expressive arms (waving when explaining!) */}
        <path
          d="M25 48 C18 46, 15 41, 18 37"
          stroke="#F8FAFC"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="18" cy="36" r="3.5" fill="#F59E0B" stroke="#0F172A" strokeWidth="1.5" />

        {mode === 'explaining' ? (
          <g>
            <path
              d="M55 48 C63 44, 67 36, 63 30"
              stroke="#F8FAFC"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <circle cx="63" cy="29" r="3.5" fill="#F59E0B" stroke="#0F172A" strokeWidth="1.5" />
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="-6 55 48; 10 55 48; -6 55 48"
              dur="0.9s"
              repeatCount="indefinite"
            />
          </g>
        ) : (
          <g>
            <path
              d="M55 48 C61 50, 64 54, 61 58"
              stroke="#F8FAFC"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <circle cx="61" cy="58" r="3.5" fill="#F59E0B" stroke="#0F172A" strokeWidth="1.5" />
          </g>
        )}

        {/* Helmet Head */}
        <rect
          x="20"
          y="14"
          width="40"
          height="32"
          rx="15"
          fill="#F8FAFC"
          stroke="#0F172A"
          strokeWidth="2.4"
        />

        {/* Warm dark visor */}
        <rect x="25" y="19" width="30" height="22" rx="10" fill="#0F172A" />

        {/* Visor highlight reflection */}
        <path
          d="M29 22.5 C32 21, 36 21, 38 22"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* Expressive Eyes */}
        {mode === 'explaining' && !isSpeaking ? (
          <>
            {/* Happy curved eyes */}
            <path d="M31 29 Q33.5 25.5 36 29" stroke="#38BDF8" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M44 29 Q46.5 25.5 49 29" stroke="#38BDF8" strokeWidth="2.4" strokeLinecap="round" />
          </>
        ) : (
          <>
            <ellipse cx="33.5" cy="28" rx="2.6" ry="3.2" fill="#38BDF8">
              <animate
                attributeName="ry"
                values="3.2;3.2;0.4;3.2"
                keyTimes="0;0.92;0.96;1"
                dur="3.8s"
                repeatCount="indefinite"
              />
            </ellipse>
            <circle cx="34.3" cy="26.8" r="1" fill="#FFFFFF" />

            <ellipse cx="46.5" cy="28" rx="2.6" ry="3.2" fill="#38BDF8">
              <animate
                attributeName="ry"
                values="3.2;3.2;0.4;3.2"
                keyTimes="0;0.92;0.96;1"
                dur="3.8s"
                repeatCount="indefinite"
              />
            </ellipse>
            <circle cx="47.3" cy="26.8" r="1" fill="#FFFFFF" />
          </>
        )}

        {/* Cheeks */}
        <circle cx="29.5" cy="32.5" r="2" fill="#FB923C" opacity="0.45" />
        <circle cx="50.5" cy="32.5" r="2" fill="#FB923C" opacity="0.45" />

        {/* Animated Lip-Sync Mouth */}
        {isSpeaking ? (
          <ellipse cx="40" cy="35" rx="4" ry="2.6" fill="#F59E0B">
            <animate
              attributeName="ry"
              values="1.2;3.4;1.5;2.9;1.2"
              dur="0.42s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="rx"
              values="3.2;4.4;3.6;4.2;3.2"
              dur="0.42s"
              repeatCount="indefinite"
            />
          </ellipse>
        ) : (
          <path
            d="M36 34.2 Q40 37.5 44 34.2"
            stroke="#F59E0B"
            strokeWidth="2.1"
            strokeLinecap="round"
          />
        )}
      </g>
    </svg>
  );
};
