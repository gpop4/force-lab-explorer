import { useRef, useState } from 'react';
import { RefreshCw, RotateCcw, Volume2 } from 'lucide-react';

interface MagnetTesterToyProps {
  autoRead: boolean;
  speakText: (text: string, segmentId?: string) => void;
}

type MagnetBehavior = 'stick' | 'ignore' | 'mini-magnet-n' | 'mini-magnet-s';

interface TableObject {
  id: string;
  name: string;
  emoji: string;
  behavior: MagnetBehavior;
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  stuck: boolean;
  repelled: boolean;
  ignoredPulse: boolean;
}

const INITIAL_OBJECTS: Omit<TableObject, 'x' | 'y' | 'stuck' | 'repelled' | 'ignoredPulse'>[] = [
  { id: 'paperclip', name: 'Steel Paperclip', emoji: '📎', behavior: 'stick', homeX: 115, homeY: 84 },
  { id: 'bolt', name: 'Iron Bolt', emoji: '🔩', behavior: 'stick', homeX: 270, homeY: 72 },
  { id: 'key', name: 'Steel Key', emoji: '🔑', behavior: 'stick', homeX: 675, homeY: 82 },
  { id: 'can', name: 'Tin Can', emoji: '🥫', behavior: 'stick', homeX: 685, homeY: 258 },
  { id: 'mini-n', name: 'Mini Magnet (N)', emoji: '🧲', behavior: 'mini-magnet-n', homeX: 155, homeY: 252 },
  { id: 'teddy', name: 'Teddy Bear', emoji: '🧸', behavior: 'ignore', homeX: 520, homeY: 268 },
  { id: 'duck', name: 'Plastic Duck', emoji: '🦆', behavior: 'ignore', homeX: 345, homeY: 272 },
  { id: 'wood', name: 'Wood Block', emoji: '🪵', behavior: 'ignore', homeX: 525, homeY: 74 },
  { id: 'apple', name: 'Red Apple', emoji: '🍎', behavior: 'ignore', homeX: 405, homeY: 74 },
  { id: 'crayon', name: 'Wax Crayon', emoji: '🖍️', behavior: 'ignore', homeX: 690, homeY: 170 },
];

function makeInitialObjects(): TableObject[] {
  return INITIAL_OBJECTS.map((o) => ({
    ...o,
    x: o.homeX,
    y: o.homeY,
    stuck: false,
    repelled: false,
    ignoredPulse: false,
  }));
}

export function MagnetTesterToy({ autoRead, speakText }: MagnetTesterToyProps) {
  const BOARD_W = 800;
  const BOARD_H = 330;

  const [magnetPos, setMagnetPos] = useState({ x: 400, y: 165 });
  const [poleFacing, setPoleFacing] = useState<'N' | 'S'>('N');
  const [objects, setObjects] = useState<TableObject[]>(makeInitialObjects);
  const [dragging, setDragging] = useState(false);
  const [feedback, setFeedback] = useState<{
    kind: 'stick' | 'repel' | 'ignore' | 'idle';
    text: string;
  }>({
    kind: 'idle',
    text: 'Drag the giant magnet near any object — or tap an object to test it!',
  });

  const boardRef = useRef<HTMLDivElement | null>(null);
  const objectsRef = useRef<TableObject[]>(objects);
  objectsRef.current = objects;
  const lastAnnouncedRef = useRef<string>('');

  const announce = (key: string, kind: 'stick' | 'repel' | 'ignore', text: string) => {
    setFeedback({ kind, text });
    if (lastAnnouncedRef.current !== key) {
      lastAnnouncedRef.current = key;
      if (autoRead) {
        speakText(text, `magnet-${key}`);
      }
    }
  };

  const updateMagnetAndInteractions = (mx: number, my: number, currentPole: 'N' | 'S') => {
    const clampedX = Math.max(82, Math.min(BOARD_W - 82, mx));
    const clampedY = Math.max(66, Math.min(BOARD_H - 54, my));
    setMagnetPos({ x: clampedX, y: clampedY });

    type Announcement = { key: string; kind: 'stick' | 'repel' | 'ignore'; text: string };
    const primaryAnnouncements: Announcement[] = [];
    const fallbackIgnores: Announcement[] = [];
    let stuckCount = 0;

    const nextList = objectsRef.current.map((obj) => {
      if (obj.stuck) {
        if (obj.behavior === 'mini-magnet-n' && currentPole === 'N') {
          primaryAnnouncements.push({
            key: 'repel-mini',
            kind: 'repel',
            text: 'Whoa! Push away! Two North poles repel each other like invisible springs!',
          });
          const pushX = clampedX < BOARD_W / 2 ? clampedX + 165 : clampedX - 165;
          return {
            ...obj,
            stuck: false,
            repelled: true,
            x: Math.max(92, Math.min(BOARD_W - 92, pushX)),
            y: Math.max(76, Math.min(BOARD_H - 56, clampedY + 40)),
          };
        }
        const slotAngles = [-2.35, -0.78, 0.78, 2.35, 0];
        const angle = slotAngles[stuckCount % slotAngles.length];
        stuckCount += 1;
        return {
          ...obj,
          x: Math.max(68, Math.min(BOARD_W - 68, clampedX + Math.cos(angle) * 74)),
          y: Math.max(64, Math.min(BOARD_H - 50, clampedY + Math.sin(angle) * 52)),
        };
      }

      const dist = Math.hypot(obj.x - clampedX, obj.y - clampedY);
      if (dist < 82) {
        if (obj.behavior === 'stick') {
          const slotAngles = [-2.35, -0.78, 0.78, 2.35, 0];
          const angle = slotAngles[stuckCount % slotAngles.length];
          stuckCount += 1;
          primaryAnnouncements.push({
            key: `stick-${obj.id}`,
            kind: 'stick',
            text: `Snap! The ${obj.name} is made of magnetic metal, so it sticks right to the magnet!`,
          });
          return {
            ...obj,
            stuck: true,
            repelled: false,
            ignoredPulse: false,
            x: Math.max(68, Math.min(BOARD_W - 68, clampedX + Math.cos(angle) * 74)),
            y: Math.max(64, Math.min(BOARD_H - 50, clampedY + Math.sin(angle) * 52)),
          };
        }

        if (obj.behavior === 'mini-magnet-n') {
          if (currentPole === 'S') {
            const slotAngles = [-2.35, -0.78, 0.78, 2.35, 0];
            const angle = slotAngles[stuckCount % slotAngles.length];
            stuckCount += 1;
            primaryAnnouncements.push({
              key: 'attract-mini',
              kind: 'stick',
              text: 'Click! South and North are opposites, so the two magnets snap right together!',
            });
            return {
              ...obj,
              stuck: true,
              repelled: false,
              x: Math.max(68, Math.min(BOARD_W - 68, clampedX + Math.cos(angle) * 74)),
              y: Math.max(64, Math.min(BOARD_H - 50, clampedY + Math.sin(angle) * 52)),
            };
          } else {
            const awayX = obj.x <= 150 ? 1 : obj.x >= BOARD_W - 150 ? -1 : obj.x >= clampedX ? 1 : -1;
            const awayY = obj.y >= BOARD_H - 95 ? -0.6 : 0.4;
            const nextX = Math.max(95, Math.min(BOARD_W - 95, clampedX + awayX * 155));
            const nextY = Math.max(76, Math.min(BOARD_H - 56, clampedY + awayY * 80));
            primaryAnnouncements.push({
              key: 'repel-mini',
              kind: 'repel',
              text: 'Whoa! Push away! Two North poles repel each other and scoot apart!',
            });
            return {
              ...obj,
              repelled: true,
              x: nextX,
              y: nextY,
            };
          }
        }

        if (obj.behavior === 'ignore') {
          fallbackIgnores.push({
            key: `ignore-${obj.id}`,
            kind: 'ignore',
            text: `Nope! The ${obj.name} is not magnetic metal, so the magnet ignores it!`,
          });
          return { ...obj, ignoredPulse: true };
        }
      } else if (obj.ignoredPulse || obj.repelled) {
        return { ...obj, ignoredPulse: false, repelled: false };
      }

      return obj;
    });

    objectsRef.current = nextList;
    setObjects(nextList);

    const chosen = primaryAnnouncements[0] ?? fallbackIgnores[0];
    if (chosen) {
      announce(chosen.key, chosen.kind, chosen.text);
    }
  };

  const clientToBoard = (clientX: number, clientY: number) => {
    const el = boardRef.current;
    if (!el) return { x: magnetPos.x, y: magnetPos.y };
    const rect = el.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * BOARD_W;
    const y = ((clientY - rect.top) / rect.height) * BOARD_H;
    return { x, y };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('.magnet-obj-btn')) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    const pt = clientToBoard(e.clientX, e.clientY);
    updateMagnetAndInteractions(pt.x, pt.y, poleFacing);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const pt = clientToBoard(e.clientX, e.clientY);
    updateMagnetAndInteractions(pt.x, pt.y, poleFacing);
  };

  const handlePointerUp = () => {
    setDragging(false);
  };

  const handleFlipPole = () => {
    const nextPole: 'N' | 'S' = poleFacing === 'N' ? 'S' : 'N';
    setPoleFacing(nextPole);
    lastAnnouncedRef.current = '';
    updateMagnetAndInteractions(magnetPos.x, magnetPos.y, nextPole);
    const msg =
      nextPole === 'S'
        ? 'Flipped to South pole! Now test the Mini North Magnet to see opposites snap!'
        : 'Flipped to North pole! Now bring it near the Mini North Magnet to watch it push away!';
    setFeedback({ kind: 'idle', text: msg });
    if (autoRead) speakText(msg, 'magnet-flip');
  };

  const handleReset = () => {
    setObjects(makeInitialObjects());
    setMagnetPos({ x: 400, y: 165 });
    setPoleFacing('N');
    lastAnnouncedRef.current = '';
    setFeedback({
      kind: 'idle',
      text: 'Table reset! Drag the magnet around to test what sticks, pushes away, or ignores it!',
    });
  };

  const stuckTotal = objects.filter((o) => o.stuck).length;

  return (
    <div className="toy-panel">
      {/* Magnet Controls Row */}
      <div className="magnet-toolbar">
        <button type="button" className="toy-flip-btn" onClick={handleFlipPole}>
          <RefreshCw size={18} />
          <span>
            Flip Poles (Active: {poleFacing === 'N' ? '🔴 North (N)' : '🔵 South (S)'})
          </span>
        </button>

        <span className="magnet-counter-pill">🧲 Stuck to Magnet: {stuckTotal}</span>

        <button type="button" className="toy-reset-btn" onClick={handleReset}>
          <RotateCcw size={16} /> Reset Table
        </button>
      </div>

      {/* Interactive Workbench Canvas */}
      <div
        ref={boardRef}
        className={`magnet-board ${dragging ? 'magnet-board--dragging' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        role="application"
        aria-label="Interactive Magnet Tester Workbench"
      >
        {/* Subtle workbench grid dots */}
        <div className="magnet-board__hint">
          👆 Drag anywhere to move the magnet — or tap any object!
        </div>

        {/* Scattered Test Objects */}
        {objects.map((obj) => (
          <button
            key={obj.id}
            type="button"
            className={`magnet-obj-btn ${obj.stuck ? 'magnet-obj-btn--stuck' : ''} ${
              obj.repelled ? 'magnet-obj-btn--repelled' : ''
            } ${obj.ignoredPulse ? 'magnet-obj-btn--ignored' : ''}`}
            style={{
              left: `${(obj.x / BOARD_W) * 100}%`,
              top: `${(obj.y / BOARD_H) * 100}%`,
            }}
            onClick={(e) => {
              e.stopPropagation();
              updateMagnetAndInteractions(obj.x, obj.y, poleFacing);
            }}
            title={obj.name}
          >
            <span className="magnet-obj-btn__emoji">{obj.emoji}</span>
            <span className="magnet-obj-btn__name">
              {obj.behavior === 'mini-magnet-n' ? 'Mini Magnet (N)' : obj.name}
            </span>
            {obj.stuck && <span className="magnet-obj-tag magnet-obj-tag--stick">STICK!</span>}
            {obj.repelled && <span className="magnet-obj-tag magnet-obj-tag--repel">PUSH!</span>}
            {obj.ignoredPulse && (
              <span className="magnet-obj-tag magnet-obj-tag--nope">NOPE</span>
            )}
          </button>
        ))}

        {/* Draggable Giant Bar Magnet */}
        <div
          className="big-magnet"
          style={{
            left: `${(magnetPos.x / BOARD_W) * 100}%`,
            top: `${(magnetPos.y / BOARD_H) * 100}%`,
          }}
        >
          <div className="big-magnet__aura" aria-hidden="true" />
          <div className="big-magnet__bar">
            <span
              className={`big-magnet__half ${
                poleFacing === 'N' ? 'big-magnet__half--red' : 'big-magnet__half--blue'
              }`}
            >
              {poleFacing}
            </span>
            <span
              className={`big-magnet__half ${
                poleFacing === 'N' ? 'big-magnet__half--blue' : 'big-magnet__half--red'
              }`}
            >
              {poleFacing === 'N' ? 'S' : 'N'}
            </span>
          </div>
        </div>
      </div>

      {/* Live Voice Feedback Banner */}
      <button
        type="button"
        className={`magnet-feedback magnet-feedback--${feedback.kind}`}
        onClick={() => speakText(feedback.text, 'magnet-feedback')}
      >
        <span>
          {feedback.kind === 'stick'
            ? '🧲'
            : feedback.kind === 'repel'
            ? '⚡'
            : feedback.kind === 'ignore'
            ? '🙅'
            : '✨'}
        </span>
        <span>{feedback.text}</span>
        <Volume2 size={18} />
      </button>
    </div>
  );
}
