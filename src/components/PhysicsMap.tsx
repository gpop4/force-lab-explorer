import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import { PhysicsWonder, PhysicsZone } from '../types';

interface PhysicsMapProps {
  zones: PhysicsZone[];
  selectedZone: PhysicsZone | null;
  selectedWonderIndex: number;
  focusedWonder?: { wonder: PhysicsWonder; zone: PhysicsZone } | null;
  discoveredWonderIds: Set<string>;
  jumpTarget: { x: number; y: number; zoom: number; nonce: number } | null;
  resetSignal: number;
  onSelectZone: (zone: PhysicsZone, wonderIndex?: number) => void;
}

const WORLD_W = 2460;
const WORLD_H = 1260;
const MIN_ZOOM = 0.42;
const MAX_ZOOM = 2.4;

interface Camera {
  cx: number;
  cy: number;
  zoom: number;
}

export function PhysicsMap({
  zones,
  selectedZone,
  selectedWonderIndex,
  focusedWonder = null,
  discoveredWonderIds,
  jumpTarget,
  resetSignal,
  onSelectZone,
}: PhysicsMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [viewport, setViewport] = useState({ width: 1200, height: 700 });

  const fitZoom = useMemo(() => {
    const zx = (viewport.width - 28) / WORLD_W;
    const zy = (viewport.height - 28) / WORLD_H;
    return Math.max(MIN_ZOOM, Math.min(1.0, Math.min(zx, zy) * 1.03));
  }, [viewport.width, viewport.height]);

  const [camera, setCamera] = useState<Camera>({
    cx: WORLD_W / 2,
    cy: WORLD_H / 2,
    zoom: 0.56,
  });

  const cameraRef = useRef<Camera>(camera);
  cameraRef.current = camera;

  const animFrameRef = useRef<number | null>(null);
  const hasInitializedRef = useRef(false);

  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const dragStartRef = useRef<{
    x: number;
    y: number;
    cx: number;
    cy: number;
    moved: boolean;
  } | null>(null);
  const pinchStartRef = useRef<{
    dist: number;
    zoom: number;
    midX: number;
    midY: number;
    cx: number;
    cy: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const clampCamera = useCallback((cam: Camera): Camera => {
    const zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, cam.zoom));
    const cx = Math.max(120, Math.min(WORLD_W - 120, cam.cx));
    const cy = Math.max(100, Math.min(WORLD_H - 100, cam.cy));
    return { cx, cy, zoom };
  }, []);

  const cancelAnimation = useCallback(() => {
    if (animFrameRef.current !== null) {
      window.cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, []);

  const flyTo = useCallback(
    (target: Camera, durationMs = 720) => {
      cancelAnimation();
      const start = { ...cameraRef.current };
      const goal = clampCamera(target);
      const t0 = performance.now();

      const step = (now: number) => {
        const raw = Math.min(1, (now - t0) / durationMs);
        const ease = 1 - Math.pow(1 - raw, 3);
        setCamera({
          cx: start.cx + (goal.cx - start.cx) * ease,
          cy: start.cy + (goal.cy - start.cy) * ease,
          zoom: start.zoom + (goal.zoom - start.zoom) * ease,
        });
        if (raw < 1) {
          animFrameRef.current = window.requestAnimationFrame(step);
        } else {
          animFrameRef.current = null;
        }
      };

      animFrameRef.current = window.requestAnimationFrame(step);
    },
    [cancelAnimation, clampCamera]
  );

  // Measure viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setViewport({ width: rect.width, height: rect.height });
      }
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Set initial full-playground fit once viewport is measured
  useEffect(() => {
    if (!hasInitializedRef.current && viewport.width > 0) {
      hasInitializedRef.current = true;
      setCamera({
        cx: WORLD_W / 2,
        cy: WORLD_H / 2,
        zoom: fitZoom,
      });
    }
  }, [viewport.width, fitZoom]);

  // Smoothly fly to selected zone / wonder
  useEffect(() => {
    if (!selectedZone) return;
    const isWide = viewport.width >= 920;
    const targetZoom = Math.max(1.05, Math.min(1.38, selectedZone.zoom * 0.88));
    const activeWonder = selectedZone.wonders[selectedWonderIndex];
    const focusX = activeWonder ? selectedZone.x + activeWonder.offsetX * 0.35 : selectedZone.x;
    const focusY = activeWonder ? selectedZone.y + activeWonder.offsetY * 0.35 : selectedZone.y;
    // Shift camera slightly right on wide screens so the selected zone stays visible left of drawer
    const xOffset = isWide ? 240 / targetZoom : 0;
    flyTo(
      {
        cx: focusX + xOffset,
        cy: focusY,
        zoom: targetZoom,
      },
      780
    );
  }, [selectedZone, selectedWonderIndex, viewport.width, flyTo]);

  // Quick-jump bar target
  useEffect(() => {
    if (!jumpTarget) return;
    flyTo(
      {
        cx: jumpTarget.x,
        cy: jumpTarget.y,
        zoom: jumpTarget.zoom,
      },
      740
    );
  }, [jumpTarget, flyTo]);

  // Full Park reset
  useEffect(() => {
    if (resetSignal === 0) return;
    flyTo(
      {
        cx: WORLD_W / 2,
        cy: WORLD_H / 2,
        zoom: fitZoom,
      },
      700
    );
  }, [resetSignal, fitZoom, flyTo]);

  useEffect(() => {
    return () => cancelAnimation();
  }, [cancelAnimation]);

  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      e.preventDefault();
      cancelAnimation();
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;

      const prev = cameraRef.current;
      const zoomFactor = e.deltaY < 0 ? 1.14 : 1 / 1.14;
      const nextZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev.zoom * zoomFactor));

      const worldX = prev.cx + (px - rect.width / 2) / prev.zoom;
      const worldY = prev.cy + (py - rect.height / 2) / prev.zoom;
      const nextCx = worldX - (px - rect.width / 2) / nextZoom;
      const nextCy = worldY - (py - rect.height / 2) / nextZoom;

      setCamera(clampCamera({ cx: nextCx, cy: nextCy, zoom: nextZoom }));
    },
    [cancelAnimation, clampCamera]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest('button')) {
        return;
      }
      cancelAnimation();
      e.currentTarget.setPointerCapture(e.pointerId);
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointersRef.current.size === 1) {
        setIsDragging(true);
        dragStartRef.current = {
          x: e.clientX,
          y: e.clientY,
          cx: cameraRef.current.cx,
          cy: cameraRef.current.cy,
          moved: false,
        };
        pinchStartRef.current = null;
      } else if (pointersRef.current.size === 2) {
        const pts = Array.from(pointersRef.current.values());
        const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
        pinchStartRef.current = {
          dist: Math.max(10, dist),
          zoom: cameraRef.current.zoom,
          midX: (pts[0].x + pts[1].x) / 2,
          midY: (pts[0].y + pts[1].y) / 2,
          cx: cameraRef.current.cx,
          cy: cameraRef.current.cy,
        };
        dragStartRef.current = null;
      }
    },
    [cancelAnimation]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!pointersRef.current.has(e.pointerId)) return;
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointersRef.current.size === 2 && pinchStartRef.current) {
        const pts = Array.from(pointersRef.current.values());
        const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
        const midX = (pts[0].x + pts[1].x) / 2;
        const midY = (pts[0].y + pts[1].y) / 2;
        const ps = pinchStartRef.current;
        const nextZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, ps.zoom * (dist / ps.dist)));
        const dx = (midX - ps.midX) / nextZoom;
        const dy = (midY - ps.midY) / nextZoom;
        setCamera(clampCamera({ cx: ps.cx - dx, cy: ps.cy - dy, zoom: nextZoom }));
      } else if (pointersRef.current.size === 1 && dragStartRef.current) {
        const ds = dragStartRef.current;
        const rawDx = e.clientX - ds.x;
        const rawDy = e.clientY - ds.y;
        if (Math.hypot(rawDx, rawDy) > 5) {
          ds.moved = true;
        }
        const z = cameraRef.current.zoom;
        setCamera(clampCamera({ cx: ds.cx - rawDx / z, cy: ds.cy - rawDy / z, zoom: z }));
      }
    },
    [clampCamera]
  );

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size === 0) {
      setIsDragging(false);
      dragStartRef.current = null;
      pinchStartRef.current = null;
    } else if (pointersRef.current.size === 1) {
      const pt = Array.from(pointersRef.current.values())[0];
      dragStartRef.current = {
        x: pt.x,
        y: pt.y,
        cx: cameraRef.current.cx,
        cy: cameraRef.current.cy,
        moved: true,
      };
      pinchStartRef.current = null;
    }
  }, []);

  const handleZoomStep = (factor: number) => {
    const prev = cameraRef.current;
    flyTo({ cx: prev.cx, cy: prev.cy, zoom: prev.zoom * factor }, 260);
  };

  const handleResetView = () => {
    flyTo({ cx: WORLD_W / 2, cy: WORLD_H / 2, zoom: fitZoom }, 650);
  };

  const tx = viewport.width / 2 - camera.cx * camera.zoom;
  const ty = viewport.height / 2 - camera.cy * camera.zoom;

  return (
    <div
      ref={containerRef}
      className={`physics-map-canvas ${isDragging ? 'physics-map-canvas--dragging' : ''}`}
      aria-label="Interactive Physics Playground World Map"
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Transformed Illustrated Playground World */}
      <div
        className="physics-world"
        style={{
          width: WORLD_W,
          height: WORLD_H,
          transform: `translate3d(${tx}px, ${ty}px, 0) scale(${camera.zoom})`,
        }}
      >
        {/* Illustrated Storybook Physics Park SVG */}
        <svg
          className="physics-svg"
          width={WORLD_W}
          height={WORLD_H}
          viewBox={`0 0 ${WORLD_W} ${WORLD_H}`}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="parkBackdrop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dff5ff" />
              <stop offset="48%" stopColor="#eefce8" />
              <stop offset="100%" stopColor="#fef9e7" />
            </linearGradient>

            <radialGradient id="gravityIslandGrad" cx="50%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#fee2e2" />
              <stop offset="100%" stopColor="#fecaca" />
            </radialGradient>
            <radialGradient id="speedIslandGrad" cx="50%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#fde68a" />
            </radialGradient>
            <radialGradient id="frictionIslandGrad" cx="50%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#e0f7fa" />
              <stop offset="100%" stopColor="#bae6fd" />
            </radialGradient>
            <radialGradient id="buoyancyIslandGrad" cx="50%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#dbeafe" />
              <stop offset="100%" stopColor="#93c5fd" />
            </radialGradient>
            <radialGradient id="magnetIslandGrad" cx="50%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#ede9fe" />
              <stop offset="100%" stopColor="#ddd6fe" />
            </radialGradient>
            <radialGradient id="machinesIslandGrad" cx="50%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#dcfce7" />
              <stop offset="100%" stopColor="#bbf7d0" />
            </radialGradient>
          </defs>

          {/* Soft Storybook Park Ground */}
          <rect x="0" y="0" width={WORLD_W} height={WORLD_H} fill="url(#parkBackdrop)" />

          {/* Cheerful Fluffy Clouds & Sunny Corner */}
          <g fill="#ffffff" opacity="0.72">
            <g transform="translate(150, 72)">
              <circle cx="0" cy="14" r="24" />
              <circle cx="26" cy="8" r="30" />
              <circle cx="56" cy="14" r="22" />
            </g>
            <g transform="translate(815, 58)">
              <circle cx="0" cy="14" r="22" />
              <circle cx="28" cy="6" r="28" />
              <circle cx="58" cy="14" r="20" />
            </g>
            <g transform="translate(1610, 62)">
              <circle cx="0" cy="16" r="24" />
              <circle cx="30" cy="8" r="32" />
              <circle cx="64" cy="16" r="22" />
            </g>
            <g transform="translate(2260, 82)">
              <circle cx="0" cy="14" r="20" />
              <circle cx="25" cy="8" r="26" />
              <circle cx="52" cy="14" r="18" />
            </g>
          </g>

          {/* Winding Stepping-Stone Playground Pathways Connecting All 6 Zones */}
          <g fill="none" stroke="#ffffff" strokeWidth="26" strokeLinecap="round" opacity="0.75">
            <path d="M 430 330 Q 830 265 1230 330 Q 1630 395 2030 330" />
            <path d="M 430 930 Q 830 995 1230 930 Q 1630 865 2030 930" />
            <path d="M 430 330 Q 370 630 430 930" />
            <path d="M 1230 330 Q 1290 630 1230 930" />
            <path d="M 2030 330 Q 2090 630 2030 930" />
          </g>
          <g
            fill="none"
            stroke="#94a3b8"
            strokeWidth="4"
            strokeDasharray="12 14"
            strokeLinecap="round"
            opacity="0.4"
          >
            <path d="M 430 330 Q 830 265 1230 330 Q 1630 395 2030 330" />
            <path d="M 430 930 Q 830 995 1230 930 Q 1630 865 2030 930" />
            <path d="M 430 330 Q 370 630 430 930" />
            <path d="M 1230 330 Q 1290 630 1230 930" />
            <path d="M 2030 330 Q 2090 630 2030 930" />
          </g>

          {/* ========= ZONE 1: GRAVITY & FALLING (430, 330) ========= */}
          <g transform="translate(430, 330)">
            <ellipse rx="345" ry="235" fill="url(#gravityIslandGrad)" stroke="#fca5a5" strokeWidth="6" />
            {/* Roller Coaster Loop Hill */}
            <path
              d="M -220 95 Q -140 -95 -60 65 Q 25 -120 115 70 Q 175 115 230 80"
              fill="none"
              stroke="#ef4444"
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.35"
            />
            {/* Coaster supports */}
            <g stroke="#ef4444" strokeWidth="4" opacity="0.22">
              <line x1="-140" y1="0" x2="-140" y2="105" />
              <line x1="25" y1="-25" x2="25" y2="105" />
              <line x1="115" y1="68" x2="115" y2="105" />
            </g>
            {/* Gravity downward arrows */}
            <g stroke="#dc2626" strokeWidth="4" strokeLinecap="round" opacity="0.25">
              <line x1="-180" y1="-110" x2="-180" y2="-45" />
              <polyline points="-190,-57 -180,-45 -170,-57" fill="none" />
              <line x1="185" y1="-100" x2="185" y2="-35" />
              <polyline points="175,-47 185,-35 195,-47" fill="none" />
            </g>
            <text
              x="0"
              y="222"
              textAnchor="middle"
              fontFamily="Fredoka, Nunito, sans-serif"
              fontWeight="700"
              fontSize="21"
              fill="#b91c1c"
              opacity="0.65"
              letterSpacing="1.5"
            >
              DROP TOWER &amp; BOUNCE HILL
            </text>
          </g>

          {/* ========= ZONE 2: SPEED, MOMENTUM & TRACTION (1230, 330) ========= */}
          <g transform="translate(1230, 330)">
            <ellipse rx="345" ry="235" fill="url(#speedIslandGrad)" stroke="#fcd34d" strokeWidth="6" />
            {/* Oval Speedway Racetrack */}
            <rect
              x="-225"
              y="-95"
              width="450"
              height="190"
              rx="95"
              fill="none"
              stroke="#475569"
              strokeWidth="26"
              opacity="0.22"
            />
            <rect
              x="-225"
              y="-95"
              width="450"
              height="190"
              rx="95"
              fill="none"
              stroke="#ffffff"
              strokeWidth="4"
              strokeDasharray="16 14"
              opacity="0.7"
            />
            {/* Checkered Finish Stripe */}
            <g transform="translate(150, -108)" opacity="0.35">
              <rect x="0" y="0" width="12" height="12" fill="#0f172a" />
              <rect x="12" y="12" width="12" height="12" fill="#0f172a" />
              <rect x="12" y="0" width="12" height="12" fill="#ffffff" />
              <rect x="0" y="12" width="12" height="12" fill="#ffffff" />
            </g>
            <text
              x="0"
              y="222"
              textAnchor="middle"
              fontFamily="Fredoka, Nunito, sans-serif"
              fontWeight="700"
              fontSize="21"
              fill="#b45309"
              opacity="0.65"
              letterSpacing="1.5"
            >
              CHEETAH SPEEDWAY &amp; GRIP TRACK
            </text>
          </g>

          {/* ========= ZONE 3: FRICTION & SLIDING (2030, 330) ========= */}
          <g transform="translate(2030, 330)">
            <ellipse rx="345" ry="235" fill="url(#frictionIslandGrad)" stroke="#7dd3fc" strokeWidth="6" />
            {/* Slippery Ice Rink Left Half + Textured Carpet/Sand Strips Right Half */}
            <ellipse cx="-105" cy="10" rx="135" ry="95" fill="#ffffff" opacity="0.6" stroke="#38bdf8" strokeWidth="4" />
            <path d="M -165 -20 Q -105 35 -50 -15" fill="none" stroke="#06b6d4" strokeWidth="4" strokeDasharray="8 8" opacity="0.45" />
            <rect x="55" y="-70" width="160" height="44" rx="14" fill="#fca5a5" opacity="0.38" />
            <rect x="55" y="-12" width="160" height="44" rx="14" fill="#86efac" opacity="0.45" />
            <rect x="55" y="46" width="160" height="44" rx="14" fill="#fde047" opacity="0.45" />
            <text
              x="0"
              y="222"
              textAnchor="middle"
              fontFamily="Fredoka, Nunito, sans-serif"
              fontWeight="700"
              fontSize="21"
              fill="#0e7490"
              opacity="0.68"
              letterSpacing="1.5"
            >
              PENGUIN ICE RINK &amp; SLIDE PARK
            </text>
          </g>

          {/* ========= ZONE 4: SINK OR FLOAT — BUOYANCY (430, 930) ========= */}
          <g transform="translate(430, 930)">
            <ellipse rx="345" ry="235" fill="url(#buoyancyIslandGrad)" stroke="#60a5fa" strokeWidth="6" />
            {/* Animated-feel Ocean Waves & Bubbles */}
            <g fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity="0.58">
              <path d="M -215 -50 Q -175 -72 -135 -50 T -55 -50 T 25 -50 T 105 -50 T 185 -50" />
              <path d="M -190 25 Q -150 5 -110 25 T -30 25 T 50 25 T 130 25 T 210 25" />
              <path d="M -165 95 Q -125 75 -85 95 T -5 95 T 75 95 T 155 95" />
            </g>
            {/* Floating bubbles */}
            <g fill="#ffffff" opacity="0.55">
              <circle cx="-185" cy="75" r="11" />
              <circle cx="-165" cy="52" r="7" />
              <circle cx="170" cy="-15" r="13" />
              <circle cx="190" cy="-42" r="8" />
            </g>
            <text
              x="0"
              y="222"
              textAnchor="middle"
              fontFamily="Fredoka, Nunito, sans-serif"
              fontWeight="700"
              fontSize="21"
              fill="#1d4ed8"
              opacity="0.7"
              letterSpacing="1.5"
            >
              DUCK POND &amp; SUBMARINE BAY
            </text>
          </g>

          {/* ========= ZONE 5: MAGNETISM & INVISIBLE PULLS (1230, 930) ========= */}
          <g transform="translate(1230, 930)">
            <ellipse rx="345" ry="235" fill="url(#magnetIslandGrad)" stroke="#c4b5fd" strokeWidth="6" />
            {/* Invisible Magnetic Field Arcs */}
            <g fill="none" stroke="#8b5cf6" strokeWidth="3.5" strokeDasharray="9 9" opacity="0.34">
              <ellipse cx="0" cy="5" rx="195" ry="120" />
              <ellipse cx="0" cy="5" rx="140" ry="82" />
              <ellipse cx="0" cy="5" rx="85" ry="48" />
            </g>
            {/* Compass Rose Lines */}
            <g stroke="#7c3aed" strokeWidth="3" opacity="0.22">
              <line x1="-220" y1="5" x2="220" y2="5" />
              <line x1="0" y1="-130" x2="0" y2="130" />
            </g>
            <text
              x="0"
              y="222"
              textAnchor="middle"
              fontFamily="Fredoka, Nunito, sans-serif"
              fontWeight="700"
              fontSize="21"
              fill="#6d28d9"
              opacity="0.7"
              letterSpacing="1.5"
            >
              MAGNET ARCH &amp; MAGLEV RAIL
            </text>
          </g>

          {/* ========= ZONE 6: SIMPLE MACHINES (2030, 930) ========= */}
          <g transform="translate(2030, 930)">
            <ellipse rx="345" ry="235" fill="url(#machinesIslandGrad)" stroke="#86efac" strokeWidth="6" />
            {/* Decorative Interlocking Gears & Seesaw Silhouette */}
            <g fill="none" stroke="#16a34a" strokeWidth="7" opacity="0.24">
              <circle cx="-115" cy="18" r="56" strokeDasharray="16 12" />
              <circle cx="-115" cy="18" r="20" />
              <circle cx="115" cy="-12" r="46" strokeDasharray="14 10" />
              <circle cx="115" cy="-12" r="16" />
            </g>
            {/* Seesaw line */}
            <g stroke="#15803d" strokeWidth="6" strokeLinecap="round" opacity="0.26">
              <line x1="-90" y1="88" x2="100" y2="58" />
              <polygon points="5,74 -15,108 25,108" fill="#15803d" />
            </g>
            <text
              x="0"
              y="222"
              textAnchor="middle"
              fontFamily="Fredoka, Nunito, sans-serif"
              fontWeight="700"
              fontSize="21"
              fill="#15803d"
              opacity="0.7"
              letterSpacing="1.5"
            >
              CLEVER WORKSHOP &amp; SEESAW PARK
            </text>
          </g>
        </svg>

        {/* Interactive Zone Hubs & Individual Wonder Medallions */}
        {zones.map((zone) => {
          const isSelectedZone = selectedZone?.id === zone.id;
          const discoveredInZone = zone.wonders.filter((w) =>
            discoveredWonderIds.has(w.id)
          ).length;
          const zoneComplete = discoveredInZone === zone.wonders.length;

          return (
            <div key={zone.id} className="zone-cluster">
              {/* Central Zone Hub Pin */}
              <div
                className="zone-hub-node"
                style={{
                  left: zone.x,
                  top: zone.y - 6,
                  zIndex: isSelectedZone ? 45 : 22,
                }}
              >
                <button
                  type="button"
                  className={`zone-hub-pin ${isSelectedZone ? 'zone-hub-pin--selected' : ''}`}
                  style={{ '--zone-color': zone.color } as React.CSSProperties}
                  onClick={() => onSelectZone(zone, 0)}
                >
                  <span className="zone-hub-pin__emoji">{zone.emoji}</span>
                  <div className="zone-hub-pin__text">
                    <strong>{zone.name}</strong>
                    <span>
                      {discoveredInZone}/{zone.wonders.length} Explored {zoneComplete ? '🏆' : ''}
                    </span>
                  </div>
                </button>
              </div>

              {/* 7 Spaced Individual Wonder Medallions around each Zone Island */}
              {zone.wonders.map((wonder, idx) => {
                const isSelectedWonder = isSelectedZone && selectedWonderIndex === idx;
                const isFocusedFromCarousel = focusedWonder?.wonder.id === wonder.id;
                const seen = discoveredWonderIds.has(wonder.id);

                return (
                  <button
                    key={wonder.id}
                    type="button"
                    className={`wonder-pin ${
                      isSelectedWonder ? 'wonder-pin--selected' : ''
                    } ${isFocusedFromCarousel ? 'wonder-pin--focus' : ''} ${
                      seen ? 'wonder-pin--discovered' : ''
                    }`}
                    style={
                      {
                        left: zone.x + wonder.offsetX,
                        top: zone.y + wonder.offsetY,
                        zIndex: isSelectedWonder || isFocusedFromCarousel ? 50 : 15,
                        '--zone-color': zone.color,
                      } as React.CSSProperties
                    }
                    onClick={() => onSelectZone(zone, idx)}
                    title={`${wonder.name} — Animal Pro: ${wonder.animalPro.animal}`}
                  >
                    <span className="wonder-pin__emoji">{wonder.emoji}</span>
                    <span className="wonder-pin__label">{wonder.name}</span>
                    <span className="wonder-pin__animal" aria-hidden="true">
                      {wonder.animalPro.emoji}
                    </span>
                    {seen && <span className="wonder-pin__star">⭐</span>}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Floating Zoom Controls (Bottom Right) */}
      <div className="map-zoom-controls" role="group" aria-label="Physics map zoom controls">
        <button
          type="button"
          className="zoom-ctrl-btn"
          onClick={() => handleZoomStep(1.28)}
          title="Zoom in closer"
          aria-label="Zoom in"
        >
          <Plus size={19} />
        </button>
        <button
          type="button"
          className="zoom-ctrl-btn"
          onClick={() => handleZoomStep(1 / 1.28)}
          title="Zoom out"
          aria-label="Zoom out"
        >
          <Minus size={19} />
        </button>
        <button
          type="button"
          className="zoom-ctrl-btn"
          onClick={handleResetView}
          title="Full Physics Park View"
          aria-label="Reset map view"
        >
          <RotateCcw size={17} />
        </button>
      </div>
    </div>
  );
}
