import React, { useEffect, useRef, useState } from 'react';
import { Globe2, Sparkles, Navigation, Volume2 } from 'lucide-react';
import { Mission, MissionZone } from '../data/missions';
import { ToonCompanion } from './ToonCompanion';
import { audioEngine, SpeechState } from '../lib/audioEngine';
import beyondCosmosImg from '../assets/images/beyond_mars_cosmos_1794670727607.jpg';

interface MarsMapExperienceProps {
  missions: Mission[];
  selectedMission: Mission;
  zone: MissionZone;
  onZoneChange: (zone: MissionZone) => void;
  onSelectMission: (mission: Mission) => void;
  speechState: SpeechState;
  triggerTravelToMissionId: string | null;
  onTravelTriggerConsumed: () => void;
}

interface Point {
  x: number;
  y: number;
}

interface DustPuff {
  id: number;
  x: number;
  y: number;
  r: number;
}

function quadBezier(p0: Point, p1: Point, p2: Point, t: number): Point {
  const mt = 1 - t;
  return {
    x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
    y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y,
  };
}

function quadBezierAngle(p0: Point, p1: Point, p2: Point, t: number): number {
  const dx = 2 * (1 - t) * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
  const dy = 2 * (1 - t) * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

export const MarsMapExperience: React.FC<MarsMapExperienceProps> = ({
  missions,
  selectedMission,
  zone,
  onZoneChange,
  onSelectMission,
  speechState,
  triggerTravelToMissionId,
  onTravelTriggerConsumed,
}) => {
  const marsMissions = missions.filter((m) => m.zone === 'mars');
  const beyondMissions = missions.filter((m) => m.zone === 'beyond');
  const visibleMissions = zone === 'mars' ? marsMissions : beyondMissions;

  // Rover / Scout Pod position on 1000 x 560 SVG viewBox
  const [craftPos, setCraftPos] = useState<Point>({
    x: selectedMission.mapX,
    y: selectedMission.mapY,
  });
  const [craftAngle, setCraftAngle] = useState<number>(0);
  const [isTraveling, setIsTraveling] = useState<boolean>(false);
  const [travelTarget, setTravelTarget] = useState<Mission | null>(null);
  const [travelProgress, setTravelProgress] = useState<number>(1);
  const [trailPoints, setTrailPoints] = useState<Point[]>([]);
  const [dustPuffs, setDustPuffs] = useState<DustPuff[]>([]);
  const [arrivedMissionId, setArrivedMissionId] = useState<string>(selectedMission.id);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  const rafRef = useRef<number | null>(null);
  const posRef = useRef<Point>(craftPos);
  posRef.current = craftPos;

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      audioEngine.stopRoverDriveSound();
    };
  }, []);

  // Sync craft position when switching zones cleanly
  const handleSwitchZone = (nextZone: MissionZone) => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    audioEngine.stopRoverDriveSound();
    setIsTraveling(false);
    setTrailPoints([]);
    setDustPuffs([]);
    onZoneChange(nextZone);

    const firstInZone = missions.find((m) => m.zone === nextZone);
    if (firstInZone) {
      setCraftPos({ x: firstInZone.mapX, y: firstInZone.mapY });
      setCraftAngle(0);
      setArrivedMissionId(firstInZone.id);
      onSelectMission(firstInZone);
    }
  };

  const driveToMission = (mission: Mission, speakOnArrival = true) => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    setHasInteracted(true);
    onSelectMission(mission);

    const start: Point = { ...posRef.current };
    const end: Point = { x: mission.mapX, y: mission.mapY };
    const dist = Math.hypot(end.x - start.x, end.y - start.y);

    // If clicking the pin we're already parked at, have Pip speak right away!
    if (dist < 8 && !isTraveling) {
      setArrivedMissionId(mission.id);
      if (speakOnArrival) {
        audioEngine.playArrivalChime();
        audioEngine.speak({
          text: mission.toonIntro,
          speakerLabel: 'Pip the Explorer',
          speakerKind: 'toon',
          voiceName: 'Puck',
        });
      }
      return;
    }

    // Stop current speech so rover journey sound takes spotlight cleanly
    audioEngine.stopSpeech();
    audioEngine.startRoverDriveSound();

    // Control point creates a gentle organic curved route across craters/space
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    const curveOffset = (start.x < end.x ? -1 : 1) * Math.min(75, Math.max(28, dist * 0.22));
    const control: Point = {
      x: midX,
      y: Math.max(65, Math.min(490, midY + curveOffset)),
    };

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const durationMs = prefersReducedMotion
      ? 260
      : Math.min(2400, Math.max(1250, dist * 3.8));

    setIsTraveling(true);
    setTravelTarget(mission);
    setTravelProgress(0);
    setTrailPoints([start]);
    setDustPuffs([]);

    const startTime = performance.now();
    let lastTrailSample = 0;
    let puffCounter = 0;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const rawT = Math.min(1, elapsed / durationMs);
      // Smooth ease-in-out cubic
      const easedT =
        rawT < 0.5 ? 4 * rawT * rawT * rawT : 1 - Math.pow(-2 * rawT + 2, 3) / 2;

      const current = quadBezier(start, control, end, easedT);
      const angle = quadBezierAngle(start, control, end, easedT);

      setCraftPos(current);
      setCraftAngle(angle);
      setTravelProgress(easedT);

      if (rawT - lastTrailSample > 0.045) {
        lastTrailSample = rawT;
        setTrailPoints((prev) => [...prev.slice(-36), current]);
        if (!prefersReducedMotion) {
          puffCounter += 1;
          setDustPuffs((prev) => [
            ...prev.slice(-7),
            {
              id: puffCounter,
              x: current.x - Math.cos((angle * Math.PI) / 180) * 14,
              y: current.y - Math.sin((angle * Math.PI) / 180) * 14,
              r: 4 + (puffCounter % 4),
            },
          ]);
        }
      }

      if (rawT < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
        audioEngine.stopRoverDriveSound();
        setIsTraveling(false);
        setTravelTarget(null);
        setCraftPos(end);
        setCraftAngle(0);
        setArrivedMissionId(mission.id);
        setDustPuffs([]);

        if (speakOnArrival) {
          audioEngine.playArrivalChime();
          audioEngine.speak({
            text: mission.toonIntro,
            speakerLabel: 'Pip the Explorer',
            speakerKind: 'toon',
            voiceName: 'Puck',
          });
        }
      }
    };

    rafRef.current = requestAnimationFrame(step);
  };

  // Handle external jumps (e.g. from Timeline or Quiz)
  useEffect(() => {
    if (!triggerTravelToMissionId) return;
    const target = missions.find((m) => m.id === triggerTravelToMissionId);
    onTravelTriggerConsumed();
    if (!target) return;

    if (target.zone !== zone) {
      onZoneChange(target.zone);
      // Place scout near origin of new zone so user still sees the fun arrival journey
      setCraftPos({
        x: target.zone === 'mars' ? 280 : 180,
        y: target.zone === 'mars' ? 260 : 280,
      });
      setTimeout(() => {
        driveToMission(target, true);
      }, 60);
    } else {
      driveToMission(target, true);
    }
  }, [triggerTravelToMissionId]);

  const isPipSpeaking =
    speechState.isSpeaking && speechState.speakerKind === 'toon';
  const remainingKm = travelTarget
    ? Math.max(0, Math.round((1 - travelProgress) * (zone === 'mars' ? 2450 : 980)))
    : 0;

  // Flip rover horizontally if driving leftwards so it never drives upside-down!
  const facingLeft = craftAngle > 90 || craftAngle < -90;
  const tiltAngle = facingLeft
    ? craftAngle > 0
      ? craftAngle - 180
      : craftAngle + 180
    : craftAngle;

  return (
    <div className="space-y-4">
      {/* Zone Switcher & Quick Pin Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="Exploration region"
          className="inline-flex w-fit items-center gap-1 rounded-lg border border-white/10 bg-[#0F1420] p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={zone === 'mars'}
            onClick={() => handleSwitchZone('mars')}
            className={`inline-flex min-h-[38px] items-center gap-2 rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              zone === 'mars'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Globe2 className="h-4 w-4" />
            <span>Mars Surface (6)</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={zone === 'beyond'}
            onClick={() => handleSwitchZone('beyond')}
            className={`inline-flex min-h-[38px] items-center gap-2 rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              zone === 'beyond'
                ? 'bg-sky-400 text-slate-950'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Beyond Mars (4)</span>
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Click any glowing pin to drive there with Pip and hear its story
        </p>
      </div>

      {/* Interactive Map Canvas */}
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0B0F19]">
        {/* Map SVG Stage */}
        <svg
          viewBox="0 0 1000 560"
          className="block h-auto w-full select-none"
          role="img"
          aria-label={
            zone === 'mars'
              ? 'Interactive map of Mars showing landing sites of Viking 1, Pathfinder, Spirit, Opportunity, InSight, and Ingenuity'
              : 'Deep space map showing Pioneer 10, NEAR Shoemaker, Kepler, and Dawn beyond Mars'
          }
        >
          <defs>
            <radialGradient id="marsSphere" cx="48%" cy="46%" r="54%">
              <stop offset="0%" stopColor="#9A3F20" />
              <stop offset="45%" stopColor="#7C2D12" />
              <stop offset="82%" stopColor="#451A0B" />
              <stop offset="100%" stopColor="#1D0B05" />
            </radialGradient>

            <radialGradient id="marsPolar" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F8FAFC" stopOpacity="0.85" />
              <stop offset="65%" stopColor="#E2E8F0" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="olympusGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D97706" stopOpacity="0.48" />
              <stop offset="60%" stopColor="#9A3412" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#7C2D12" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="hellasDepth" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2A0F08" stopOpacity="0.82" />
              <stop offset="70%" stopColor="#43180C" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#7C2D12" stopOpacity="0" />
            </radialGradient>

            <clipPath id="marsClip">
              <ellipse cx="500" cy="280" rx="448" ry="252" />
            </clipPath>
          </defs>

          {zone === 'mars' ? (
            <>
              {/* Deep Space around Mars */}
              <rect width="1000" height="560" fill="#07090F" />
              {/* Subtle distant stars */}
              {[
                [65, 58],
                [130, 110],
                [880, 74],
                [935, 165],
                [82, 468],
                [922, 488],
                [195, 42],
                [790, 42],
              ].map(([sx, sy], i) => (
                <circle key={i} cx={sx} cy={sy} r="1.4" fill="#CBD5E1" opacity="0.55" />
              ))}

              {/* Mars Elliptical Global Projection */}
              <ellipse
                cx="500"
                cy="280"
                rx="448"
                ry="252"
                fill="url(#marsSphere)"
                stroke="rgba(251, 146, 60, 0.25)"
                strokeWidth="1.5"
              />

              <g clipPath="url(#marsClip)">
                {/* Latitude / Longitude coordinate lines */}
                {[-120, -60, 0, 60, 120].map((dy) => (
                  <line
                    key={`lat-${dy}`}
                    x1="40"
                    y1={280 + dy}
                    x2="960"
                    y2={280 + dy}
                    stroke="rgba(255,255,255,0.06)"
                    strokeDasharray="4 6"
                  />
                ))}
                {[200, 350, 500, 650, 800].map((lx) => (
                  <line
                    key={`lon-${lx}`}
                    x1={lx}
                    y1="20"
                    x2={lx}
                    y2="540"
                    stroke="rgba(255,255,255,0.06)"
                    strokeDasharray="4 6"
                  />
                ))}

                {/* Syrtis Major dark basalt region */}
                <path
                  d="M570 235 C605 215, 650 245, 638 295 C625 340, 580 355, 558 315 C542 285, 545 250, 570 235 Z"
                  fill="#3B150A"
                  opacity="0.55"
                />

                {/* Olympus Mons Shield Volcano */}
                <g transform="translate(245, 198)">
                  <circle cx="0" cy="0" r="64" fill="url(#olympusGlow)" />
                  <circle
                    cx="0"
                    cy="0"
                    r="34"
                    fill="none"
                    stroke="rgba(251, 191, 36, 0.25)"
                    strokeWidth="1"
                  />
                  <circle
                    cx="0"
                    cy="0"
                    r="11"
                    fill="#3C1408"
                    stroke="rgba(251, 191, 36, 0.45)"
                    strokeWidth="1.2"
                  />
                  <text
                    x="0"
                    y="50"
                    textAnchor="middle"
                    fill="#FCD34D"
                    fontSize="11"
                    fontFamily="JetBrains Mono, monospace"
                    opacity="0.8"
                  >
                    OLYMPUS MONS
                  </text>
                </g>

                {/* Valles Marineris Grand Canyon */}
                <g>
                  <path
                    d="M318 308 Q382 325, 446 314 Q482 308, 512 318"
                    fill="none"
                    stroke="#240C05"
                    strokeWidth="11"
                    strokeLinecap="round"
                    opacity="0.78"
                  />
                  <path
                    d="M322 308 Q382 323, 446 313 Q482 307, 508 317"
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    opacity="0.32"
                  />
                  <text
                    x="412"
                    y="338"
                    textAnchor="middle"
                    fill="#FDBA74"
                    fontSize="10.5"
                    fontFamily="JetBrains Mono, monospace"
                    opacity="0.75"
                  >
                    VALLES MARINERIS
                  </text>
                </g>

                {/* Hellas Planitia Impact Basin */}
                <g transform="translate(690, 412)">
                  <ellipse cx="0" cy="0" rx="76" ry="50" fill="url(#hellasDepth)" />
                  <ellipse
                    cx="0"
                    cy="0"
                    rx="72"
                    ry="46"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeDasharray="3 4"
                  />
                  <text
                    x="0"
                    y="6"
                    textAnchor="middle"
                    fill="#E2E8F0"
                    fontSize="10.5"
                    fontFamily="JetBrains Mono, monospace"
                    opacity="0.65"
                  >
                    HELLAS BASIN
                  </text>
                </g>

                {/* North & South Polar Ice Caps */}
                <ellipse cx="500" cy="36" rx="145" ry="26" fill="url(#marsPolar)" />
                <text
                  x="500"
                  y="44"
                  textAnchor="middle"
                  fill="#E2E8F0"
                  fontSize="9.5"
                  fontFamily="JetBrains Mono, monospace"
                  opacity="0.75"
                >
                  NORTH POLAR CAP
                </text>

                <ellipse cx="500" cy="524" rx="125" ry="22" fill="url(#marsPolar)" />
                <text
                  x="500"
                  y="524"
                  textAnchor="middle"
                  fill="#E2E8F0"
                  fontSize="9.5"
                  fontFamily="JetBrains Mono, monospace"
                  opacity="0.75"
                >
                  SOUTH POLAR CAP
                </text>
              </g>
            </>
          ) : (
            /* BEYOND MARS DEEP SPACE STAGE */
            <>
              <image
                href={beyondCosmosImg}
                x="0"
                y="0"
                width="1000"
                height="560"
                preserveAspectRatio="xMidYMid slice"
                opacity="0.82"
              />
              <rect width="1000" height="560" fill="rgba(7, 9, 15, 0.42)" />

              {/* Sun at left */}
              <g transform="translate(115, 280)">
                <circle cx="0" cy="0" r="64" fill="rgba(245, 158, 11, 0.14)" />
                <circle cx="0" cy="0" r="24" fill="#F59E0B" />
                <circle cx="0" cy="0" r="16" fill="#FEF3C7" />
                <text
                  x="0"
                  y="44"
                  textAnchor="middle"
                  fill="#FDE68A"
                  fontSize="11"
                  fontFamily="JetBrains Mono, monospace"
                >
                  THE SUN
                </text>
              </g>

              {/* Concentric solar system reference arcs */}
              {[155, 275, 420, 560, 740].map((r, idx) => (
                <circle
                  key={idx}
                  cx="115"
                  cy="280"
                  r={r}
                  fill="none"
                  stroke={idx === 2 ? 'rgba(148, 163, 184, 0.28)' : 'rgba(255, 255, 255, 0.11)'}
                  strokeDasharray={idx === 2 ? '3 8' : '5 6'}
                  strokeWidth={idx === 2 ? 10 : 1}
                />
              ))}

              <text
                x="258"
                y="144"
                textAnchor="middle"
                fill="#94A3B8"
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
              >
                EARTH-TRAILING ORBIT
              </text>
              <text
                x="525"
                y="495"
                textAnchor="middle"
                fill="#94A3B8"
                fontSize="10.5"
                fontFamily="JetBrains Mono, monospace"
              >
                MAIN ASTEROID BELT
              </text>
              <text
                x="865"
                y="108"
                textAnchor="middle"
                fill="#7DD3FC"
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
              >
                TOWARD ALDEBARAN (TAURUS) →
              </text>
            </>
          )}

          {/* Rover Wheel Tracks / Scout Flight Trail */}
          {trailPoints.length > 1 && (
            <polyline
              points={trailPoints.map((p) => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke={zone === 'mars' ? 'rgba(253, 186, 116, 0.65)' : 'rgba(56, 189, 248, 0.7)'}
              strokeWidth={zone === 'mars' ? 3 : 2.5}
              strokeDasharray="6 6"
              strokeLinecap="round"
            />
          )}

          {/* Dust Puffs kicked up behind Rover */}
          {zone === 'mars' &&
            dustPuffs.map((puff) => (
              <circle
                key={puff.id}
                cx={puff.x}
                cy={puff.y}
                r={puff.r}
                fill="#FDBA74"
                opacity="0.35"
              />
            ))}

          {/* Interactive Mission Pins */}
          {visibleMissions.map((m) => {
            const isSelected = selectedMission.id === m.id;
            const isArrived = arrivedMissionId === m.id && !isTraveling;
            return (
              <g
                key={m.id}
                transform={`translate(${m.mapX}, ${m.mapY})`}
                onClick={() => driveToMission(m, true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    driveToMission(m, true);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Drive to ${m.name} at ${m.locationName}`}
                className="cursor-pointer focus:outline-none"
              >
                {/* Hit target */}
                <circle cx="0" cy="0" r="28" fill="transparent" />

                {/* Expanding arrival / selected ring */}
                {(isSelected || isArrived) && (
                  <circle
                    cx="0"
                    cy="0"
                    r="18"
                    fill="none"
                    stroke={m.accentColor}
                    strokeWidth="2"
                    className="animate-pulse-ring"
                  />
                )}

                {/* Pin outer halo */}
                <circle
                  cx="0"
                  cy="0"
                  r={isSelected ? 12 : 9}
                  fill={m.accentColor}
                  fillOpacity={isSelected ? 0.28 : 0.18}
                  stroke={m.accentColor}
                  strokeWidth={isSelected ? 2.2 : 1.5}
                />

                {/* Pin core */}
                <circle cx="0" cy="0" r={isSelected ? 5.2 : 4} fill="#FFFFFF" />

                {/* Clean readable label */}
                <g transform="translate(0, 24)">
                  <rect
                    x="-62"
                    y="-10"
                    width="124"
                    height="20"
                    rx="5"
                    fill="rgba(7, 9, 15, 0.85)"
                    stroke={isSelected ? m.accentColor : 'rgba(255,255,255,0.14)'}
                    strokeWidth="1"
                  />
                  <text
                    x="0"
                    y="3.5"
                    textAnchor="middle"
                    fill={isSelected ? '#FFFFFF' : '#E2E8F0'}
                    fontSize="11"
                    fontWeight={isSelected ? '600' : '500'}
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    {m.shortName}
                  </text>
                </g>
              </g>
            );
          })}

          {/* ANIMATED SCOUT ROVER + TOON COMPANION PIP */}
          <g transform={`translate(${craftPos.x}, ${craftPos.y})`}>
            {/* Scout Rover (on Mars) or Deep-Space Pod (Beyond Mars) */}
            <g
              transform={`translate(-22, -26) scale(${facingLeft ? -1 : 1}, 1) rotate(${tiltAngle})`}
              style={{ transformOrigin: '22px 26px' }}
            >
              {zone === 'mars' ? (
                /* 6-Wheeled Cute Mars Scout Rover */
                <g>
                  {/* Rover Shadow */}
                  <ellipse cx="22" cy="37" rx="20" ry="4" fill="rgba(0,0,0,0.45)" />
                  {/* Mast + Camera Head */}
                  <line x1="30" y1="18" x2="32" y2="5" stroke="#E2E8F0" strokeWidth="2.5" />
                  <rect x="27" y="1" width="12" height="7" rx="2" fill="#F8FAFC" stroke="#0F172A" strokeWidth="1.5" />
                  <circle cx="31" cy="4.5" r="1.4" fill="#38BDF8" />
                  <circle cx="35.5" cy="4.5" r="1.4" fill="#38BDF8" />
                  {/* Dish Antenna */}
                  <line x1="14" y1="17" x2="11" y2="8" stroke="#94A3B8" strokeWidth="1.8" />
                  <circle cx="11" cy="7" r="2.5" fill="#F59E0B" />
                  {/* Chassis Body */}
                  <rect x="10" y="17" width="25" height="11" rx="3" fill="#F59E0B" stroke="#0F172A" strokeWidth="1.8" />
                  <rect x="13" y="19.5" width="14" height="4" rx="1" fill="#0F172A" opacity="0.25" />
                  {/* Rocker-bogie struts */}
                  <path d="M10 27 L8 33 M22 28 L22 33 M33 27 L36 33" stroke="#CBD5E1" strokeWidth="2" />
                  {/* 3 visible side wheels */}
                  {[8, 22, 36].map((wx, wi) => (
                    <g key={wi}>
                      <circle cx={wx} cy="33" r="4.5" fill="#1E293B" stroke="#E2E8F0" strokeWidth="1.6" />
                      <circle cx={wx} cy="33" r="1.4" fill="#F59E0B" />
                    </g>
                  ))}
                </g>
              ) : (
                /* Cute Deep-Space Ion Scout Pod */
                <g>
                  <ellipse cx="4" cy="24" rx="7" ry="3" fill="#38BDF8" opacity="0.65" />
                  <path
                    d="M12 16 L34 24 L12 32 L16 24 Z"
                    fill="#F8FAFC"
                    stroke="#0F172A"
                    strokeWidth="1.8"
                  />
                  <circle cx="23" cy="24" r="3.5" fill="#38BDF8" />
                </g>
              )}
            </g>

            {/* Toon Companion Pip riding right beside the rover / pod! */}
            <g transform="translate(14, -62)">
              <foreignObject x="0" y="0" width="60" height="60" className="overflow-visible">
                <ToonCompanion
                  mode={
                    isTraveling
                      ? zone === 'mars'
                        ? 'driving'
                        : 'flying'
                      : 'explaining'
                  }
                  isSpeaking={isPipSpeaking}
                  size={56}
                />
              </foreignObject>
            </g>
          </g>
        </svg>

        {/* Live Driving HUD / Pip Speech Bubble Overlay at Bottom of Map */}
        <div className="border-t border-white/10 bg-[#0F1420]/95 px-4 py-3 sm:px-5">
          {isTraveling && travelTarget ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Navigation className="h-4 w-4 text-amber-400" />
                <p className="text-sm font-medium text-white">
                  {zone === 'mars' ? 'Rover driving to ' : 'Scout pod flying to '}
                  <span className="text-amber-300">{travelTarget.locationName}</span>
                  <span className="text-slate-400"> ({travelTarget.shortName})</span>
                </p>
              </div>
              <p className="font-mono text-xs tabular-nums text-sky-300">
                {remainingKm.toLocaleString()} km remaining
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="shrink-0 pt-0.5">
                  <ToonCompanion
                    mode="explaining"
                    isSpeaking={isPipSpeaking}
                    size={42}
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-amber-300">
                    Pip at {selectedMission.locationName}
                  </p>
                  <p className="mt-0.5 text-sm leading-snug text-slate-200">
                    {hasInteracted
                      ? selectedMission.toonIntro
                      : `Click any pin on the map above—our rover will drive right over with me, and I'll tell you all about ${selectedMission.shortName}!`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => driveToMission(selectedMission, true)}
                className="inline-flex min-h-[40px] shrink-0 items-center gap-2 self-start rounded-lg bg-amber-500/15 px-3.5 py-2 text-xs font-semibold text-amber-300 border border-amber-400/30 transition-colors hover:bg-amber-500/25 sm:self-center whitespace-nowrap cursor-pointer"
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span>{isPipSpeaking ? 'Pip is speaking' : 'Hear Pip Explain'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Accessible Mission Selector Row */}
      <div className="flex flex-wrap gap-2" aria-label="Quick mission pins">
        {visibleMissions.map((m) => {
          const active = selectedMission.id === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => driveToMission(m, true)}
              className={`min-h-[38px] rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                active
                  ? 'border-amber-400/60 bg-amber-500/15 text-amber-200'
                  : 'border-white/10 bg-[#0F1420] text-slate-300 hover:border-white/25 hover:text-white'
              }`}
            >
              {m.shortName}
            </button>
          );
        })}
      </div>
    </div>
  );
};
