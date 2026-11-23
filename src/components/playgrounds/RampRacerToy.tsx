import { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Volume2 } from 'lucide-react';

interface RampRacerToyProps {
  autoRead: boolean;
  speakText: (text: string, segmentId?: string) => void;
}

type SurfaceId = 'ice' | 'wood' | 'carpet' | 'mud';
type RacerId = 'car' | 'penguin' | 'skateboard' | 'truck';
type RampHeight = 1 | 2 | 3;

interface SurfaceConfig {
  id: SurfaceId;
  emoji: string;
  label: string;
  friction: number; // higher = stops faster
  trackColor: string;
  trackStripe: string;
  particle: string;
  desc: string;
}

interface RacerConfig {
  id: RacerId;
  emoji: string;
  label: string;
  glideBonus: number;
}

const SURFACES: SurfaceConfig[] = [
  {
    id: 'ice',
    emoji: '🧊',
    label: 'Ice',
    friction: 0.24,
    trackColor: '#bae6fd',
    trackStripe: '#e0f2fe',
    particle: '❄️',
    desc: 'super slippery ice has almost no friction',
  },
  {
    id: 'wood',
    emoji: '🪵',
    label: 'Wood',
    friction: 0.52,
    trackColor: '#fcd34d',
    trackStripe: '#fef3c7',
    particle: '✨',
    desc: 'smooth wood gives a nice speedy roll',
  },
  {
    id: 'carpet',
    emoji: '🧶',
    label: 'Carpet',
    friction: 0.98,
    trackColor: '#fca5a5',
    trackStripe: '#fee2e2',
    particle: '〰️',
    desc: 'fuzzy carpet loops grab on with lots of friction',
  },
  {
    id: 'mud',
    emoji: '🟤',
    label: 'Mud',
    friction: 1.55,
    trackColor: '#a16207',
    trackStripe: '#854d0e',
    particle: '💧',
    desc: 'thick sticky mud grabs tight and stops things fast',
  },
];

const RACERS: RacerConfig[] = [
  { id: 'car', emoji: '🏎️', label: 'Race Car', glideBonus: 1.08 },
  { id: 'penguin', emoji: '🐧', label: 'Penguin', glideBonus: 1.04 },
  { id: 'skateboard', emoji: '🛹', label: 'Skateboard', glideBonus: 1.0 },
  { id: 'truck', emoji: '🚚', label: 'Heavy Truck', glideBonus: 0.92 },
];

const RAMP_HEIGHTS: Array<{ level: RampHeight; label: string; topY: number; speed: number }> = [
  { level: 1, label: 'Low', topY: 168, speed: 320 },
  { level: 2, label: 'Medium', topY: 112, speed: 470 },
  { level: 3, label: 'Tall!', topY: 56, speed: 620 },
];

export function RampRacerToy({ autoRead, speakText }: RampRacerToyProps) {
  const [surfaceId, setSurfaceId] = useState<SurfaceId>('ice');
  const [racerId, setRacerId] = useState<RacerId>('penguin');
  const [rampHeight, setRampHeight] = useState<RampHeight>(2);

  // Track coordinates inside 820 x 270 SVG
  const RAMP_START_X = 48;
  const RAMP_END_X = 225;
  const FLOOR_Y = 216;
  const MAX_TRACK_X = 776;

  const surface = SURFACES.find((s) => s.id === surfaceId) ?? SURFACES[0];
  const racer = RACERS.find((r) => r.id === racerId) ?? RACERS[0];
  const ramp = RAMP_HEIGHTS.find((h) => h.level === rampHeight) ?? RAMP_HEIGHTS[1];

  const [racerPos, setRacerPos] = useState({ x: RAMP_START_X + 14, y: ramp.topY - 12, angle: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [resultBanner, setResultBanner] = useState<{
    stars: number;
    headline: string;
    voice: string;
  } | null>(null);
  const [trailDots, setTrailDots] = useState<Array<{ x: number; y: number }>>([]);

  const rafRef = useRef<number | null>(null);

  const stopAnim = () => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  // Reposition racer to top of ramp whenever setup changes while idle
  useEffect(() => {
    stopAnim();
    setIsRunning(false);
    setResultBanner(null);
    setTrailDots([]);
    const slopeAngle = Math.atan2(FLOOR_Y - ramp.topY, RAMP_END_X - RAMP_START_X) * (180 / Math.PI);
    setRacerPos({
      x: RAMP_START_X + 16,
      y: ramp.topY - 10,
      angle: slopeAngle,
    });
  }, [surfaceId, racerId, rampHeight, ramp.topY]);

  useEffect(() => () => stopAnim(), []);

  const handleLaunch = () => {
    stopAnim();
    setIsRunning(true);
    setResultBanner(null);
    setTrailDots([]);

    const slopeAngle = Math.atan2(FLOOR_Y - ramp.topY, RAMP_END_X - RAMP_START_X) * (180 / Math.PI);
    const rampDuration = 540 - rampHeight * 65; // taller ramp = faster zip down!

    // Compute realistic horizontal glide distance after ramp
    const rawGlide =
      ((ramp.speed * racer.glideBonus) / (surface.friction * 1.15)) * 0.85;
    const targetEndX = Math.min(MAX_TRACK_X, RAMP_END_X + Math.max(48, rawGlide));
    const glideDistance = targetEndX - RAMP_END_X;
    const glideDuration = Math.max(520, Math.min(1850, (glideDistance / (ramp.speed * 0.72)) * 1000));

    const t0 = performance.now();
    let lastDotX = RAMP_END_X;

    const tick = (now: number) => {
      const elapsed = now - t0;

      if (elapsed < rampDuration) {
        const p = elapsed / rampDuration;
        // Gravity acceleration: quadratic ease-in down the ramp
        const eased = p * p;
        const x = RAMP_START_X + 16 + (RAMP_END_X - (RAMP_START_X + 16)) * eased;
        const y = ramp.topY - 10 + (FLOOR_Y - 18 - (ramp.topY - 10)) * eased;
        setRacerPos({ x, y, angle: slopeAngle });
        rafRef.current = window.requestAnimationFrame(tick);
      } else {
        const glideElapsed = elapsed - rampDuration;
        const p = Math.min(1, glideElapsed / glideDuration);
        // Smooth friction deceleration: cubic ease-out
        const eased = 1 - Math.pow(1 - p, 3);
        const x = RAMP_END_X + glideDistance * eased;
        setRacerPos({ x, y: FLOOR_Y - 18, angle: 0 });

        if (x - lastDotX > 42) {
          lastDotX = x;
          setTrailDots((prev) => [...prev, { x: x - 18, y: FLOOR_Y - 10 }]);
        }

        if (p < 1) {
          rafRef.current = window.requestAnimationFrame(tick);
        } else {
          rafRef.current = null;
          setIsRunning(false);
          const pct = (targetEndX - RAMP_END_X) / (MAX_TRACK_X - RAMP_END_X);
          const stars = pct >= 0.85 ? 5 : pct >= 0.62 ? 4 : pct >= 0.4 ? 3 : pct >= 0.22 ? 2 : 1;
          const headline =
            stars >= 5
              ? '🏆 SUPER ZOOM! All the way to the finish!'
              : stars >= 4
              ? '🚀 Awesome Glide!'
              : stars >= 3
              ? '🌟 Nice Roll!'
              : stars >= 2
              ? '🐢 Slowed Down Quickly!'
              : '🛑 Splat! Stopped Super Fast!';
          const voice =
            stars >= 4
              ? `Whoa! The ${racer.label} zoomed super far because ${surface.desc}!`
              : stars >= 3
              ? `Nice roll! The ${racer.label} glided midway because ${surface.desc}!`
              : `Whoa, stop! The ${racer.label} stopped fast because ${surface.desc}!`;
          setResultBanner({ stars, headline, voice });
          if (autoRead) {
            speakText(voice, 'toy-ramp');
          }
        }
      }
    };

    rafRef.current = window.requestAnimationFrame(tick);
  };

  const handleReset = () => {
    stopAnim();
    setIsRunning(false);
    setResultBanner(null);
    setTrailDots([]);
    const slopeAngle = Math.atan2(FLOOR_Y - ramp.topY, RAMP_END_X - RAMP_START_X) * (180 / Math.PI);
    setRacerPos({ x: RAMP_START_X + 16, y: ramp.topY - 10, angle: slopeAngle });
  };

  return (
    <div className="toy-panel">
      {/* Iconic Zero-Text-Required Controls */}
      <div className="toy-controls-grid">
        {/* Pick Racer */}
        <div className="toy-control-group">
          <span className="toy-control-label">1. Pick Racer</span>
          <div className="toy-icon-row">
            {RACERS.map((r) => (
              <button
                key={r.id}
                type="button"
                className={`toy-choice-btn ${racerId === r.id ? 'toy-choice-btn--active' : ''}`}
                onClick={() => setRacerId(r.id)}
              >
                <span className="toy-choice-btn__emoji">{r.emoji}</span>
                <span>{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Pick Surface */}
        <div className="toy-control-group">
          <span className="toy-control-label">2. Pick Floor</span>
          <div className="toy-icon-row">
            {SURFACES.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`toy-choice-btn ${surfaceId === s.id ? 'toy-choice-btn--active' : ''}`}
                onClick={() => setSurfaceId(s.id)}
              >
                <span className="toy-choice-btn__emoji">{s.emoji}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Pick Ramp Height */}
        <div className="toy-control-group">
          <span className="toy-control-label">3. Ramp Height</span>
          <div className="toy-icon-row">
            {RAMP_HEIGHTS.map((h) => (
              <button
                key={h.level}
                type="button"
                className={`toy-choice-btn ${rampHeight === h.level ? 'toy-choice-btn--active' : ''}`}
                onClick={() => setRampHeight(h.level)}
              >
                <span className="toy-ramp-bars" aria-hidden="true">
                  {'▲'.repeat(h.level)}
                </span>
                <span>{h.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Animated Ramp & Track Stage */}
      <div className="ramp-stage">
        <svg viewBox="0 0 820 260" className="ramp-svg" aria-label="Ramp and Friction Track">
          {/* Sunny Sky */}
          <rect x="0" y="0" width="820" height="216" fill="#e0f2fe" rx="18" />
          <circle cx="745" cy="44" r="24" fill="#fde047" />
          <g fill="#ffffff" opacity="0.82">
            <circle cx="330" cy="46" r="18" />
            <circle cx="352" cy="40" r="22" />
            <circle cx="376" cy="46" r="16" />
          </g>

          {/* Wooden Ramp Triangle */}
          <polygon
            points={`${RAMP_START_X},${ramp.topY} ${RAMP_END_X},${FLOOR_Y} ${RAMP_START_X},${FLOOR_Y}`}
            fill="#f59e0b"
            stroke="#b45309"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <line
            x1={RAMP_START_X}
            y1={ramp.topY}
            x2={RAMP_END_X}
            y2={FLOOR_Y}
            stroke="#fef3c7"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Track Surface Floor */}
          <rect x="0" y={FLOOR_Y} width="820" height="44" fill={surface.trackColor} />
          <rect x="225" y={FLOOR_Y + 6} width="595" height="10" fill={surface.trackStripe} opacity="0.7" />

          {/* Surface Texture Marks */}
          {surfaceId === 'carpet' &&
            Array.from({ length: 24 }, (_, i) => (
              <line
                key={i}
                x1={238 + i * 24}
                y1={FLOOR_Y}
                x2={244 + i * 24}
                y2={FLOOR_Y - 7}
                stroke="#ef4444"
                strokeWidth="3"
                strokeLinecap="round"
              />
            ))}
          {surfaceId === 'mud' &&
            Array.from({ length: 14 }, (_, i) => (
              <ellipse
                key={i}
                cx={255 + i * 40}
                cy={FLOOR_Y + 2}
                rx="16"
                ry="6"
                fill="#713f12"
              />
            ))}
          {surfaceId === 'ice' &&
            Array.from({ length: 12 }, (_, i) => (
              <line
                key={i}
                x1={245 + i * 48}
                y1={FLOOR_Y + 20}
                x2={265 + i * 48}
                y2={FLOOR_Y + 6}
                stroke="#ffffff"
                strokeWidth="3"
                opacity="0.85"
              />
            ))}

          {/* Distance Star Markers Along Track */}
          {[335, 445, 555, 665, 765].map((mx, i) => (
            <g key={mx} transform={`translate(${mx}, ${FLOOR_Y + 28})`}>
              <text textAnchor="middle" fontSize="15" fontFamily="Fredoka, sans-serif" fill="#1e293b" fontWeight="700">
                {i === 4 ? '🏁' : `⭐`}
              </text>
            </g>
          ))}

          {/* Finish Flag */}
          <g transform="translate(772, 162)">
            <line x1="0" y1="0" x2="0" y2="54" stroke="#334155" strokeWidth="4" />
            <text x="4" y="20" fontSize="26">
              🏁
            </text>
          </g>

          {/* Animated Trail Particles */}
          {trailDots.map((dot, idx) => (
            <text key={idx} x={dot.x} y={dot.y} fontSize="16" opacity="0.78">
              {surface.particle}
            </text>
          ))}

          {/* Animated Racer! */}
          <g transform={`translate(${racerPos.x}, ${racerPos.y}) rotate(${racerPos.angle})`}>
            <text
              x="0"
              y="10"
              textAnchor="middle"
              fontSize="44"
              style={{ userSelect: 'none' }}
              transform={racerId === 'car' || racerId === 'truck' ? 'scale(-1, 1)' : undefined}
            >
              {racer.emoji}
            </text>
          </g>
        </svg>

        {/* Big Launch & Reset Buttons */}
        <div className="ramp-actions">
          <button
            type="button"
            className="toy-go-btn"
            onClick={handleLaunch}
            disabled={isRunning}
          >
            <Play size={22} fill="currentColor" />
            <span>{isRunning ? 'ZOOMING...' : '🚀 GO!'}</span>
          </button>

          <button type="button" className="toy-reset-btn" onClick={handleReset}>
            <RotateCcw size={18} /> Reset
          </button>

          {resultBanner && (
            <button
              type="button"
              className="toy-result-pill"
              onClick={() => speakText(resultBanner.voice, 'toy-ramp')}
            >
              <span className="toy-result-pill__stars">{'⭐'.repeat(resultBanner.stars)}</span>
              <span>{resultBanner.headline}</span>
              <Volume2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
