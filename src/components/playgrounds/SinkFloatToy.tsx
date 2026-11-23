import { useState } from 'react';
import { RotateCcw, Volume2 } from 'lucide-react';

interface SinkFloatToyProps {
  autoRead: boolean;
  speakText: (text: string, segmentId?: string) => void;
}

interface TubItem {
  id: string;
  name: string;
  emoji: string;
  floats: boolean;
  reason: string;
}

const TUB_ITEMS: TubItem[] = [
  {
    id: 'duck',
    name: 'Rubber Duck',
    emoji: '🦆',
    floats: true,
    reason: 'Float! The rubber duck is hollow and full of light air, just like a real duck’s puffy feathers!',
  },
  {
    id: 'pebble',
    name: 'Heavy Pebble',
    emoji: '🪨',
    floats: false,
    reason: 'Plop, sink! The tiny pebble is packed super tight with heavy rock and has no air inside!',
  },
  {
    id: 'boat',
    name: 'Toy Sailboat',
    emoji: '⛵',
    floats: true,
    reason: 'Float! The wide hollow boat shape pushes lots of water away so water lifts it right up!',
  },
  {
    id: 'key',
    name: 'Metal Key',
    emoji: '🔑',
    floats: false,
    reason: 'Sink! Solid heavy metal drops straight past the water all the way to the sandy bottom!',
  },
  {
    id: 'apple',
    name: 'Red Apple',
    emoji: '🍎',
    floats: true,
    reason: 'Float! Surprise — apples are crunchy because they have tons of tiny hidden air pockets inside!',
  },
  {
    id: 'coin',
    name: 'Shiny Coin',
    emoji: '🪙',
    floats: false,
    reason: 'Sink! Even though a coin is super small, its tightly packed metal is heavier than water!',
  },
  {
    id: 'beachball',
    name: 'Beach Ball',
    emoji: '🏖️',
    floats: true,
    reason: 'Float! A big beach ball is stuffed with super-light air, so the water pushes it way up high!',
  },
  {
    id: 'log',
    name: 'Wood Log',
    emoji: '🪵',
    floats: true,
    reason: 'Float! Wood has tiny air tubes inside from when it was a growing tree, so logs float easily!',
  },
  {
    id: 'turtle',
    name: 'Sea Turtle',
    emoji: '🐢',
    floats: true,
    reason: 'Float! Sea turtles take big breaths of air into their lungs so they can bob happily at the top!',
  },
  {
    id: 'brick',
    name: 'Heavy Brick',
    emoji: '🧱',
    floats: false,
    reason: 'Splash and sink! A heavy clay brick is much heavier than the water it pushes aside!',
  },
];

interface DroppedEntry {
  item: TubItem;
  slotX: number;
  splashKey: number;
}

export function SinkFloatToy({ autoRead, speakText }: SinkFloatToyProps) {
  const [dropped, setDropped] = useState<DroppedEntry[]>([]);
  const [lastFeedback, setLastFeedback] = useState<{
    emoji: string;
    floats: boolean;
    text: string;
  } | null>(null);

  const droppedIds = new Set(dropped.map((d) => d.item.id));
  const floaters = dropped.filter((d) => d.item.floats);
  const sinkers = dropped.filter((d) => !d.item.floats);

  const handleDropItem = (item: TubItem) => {
    if (droppedIds.has(item.id)) {
      setLastFeedback({ emoji: item.emoji, floats: item.floats, text: item.reason });
      if (autoRead) speakText(item.reason, `tub-${item.id}`);
      return;
    }

    const sameGroupCount = item.floats ? floaters.length : sinkers.length;
    const slotX = 12 + ((sameGroupCount * 15) % 78);

    setDropped((prev) => [...prev, { item, slotX, splashKey: Date.now() }]);
    setLastFeedback({ emoji: item.emoji, floats: item.floats, text: item.reason });
    if (autoRead) {
      speakText(item.reason, `tub-${item.id}`);
    }
  };

  const handleEmptyTub = () => {
    setDropped([]);
    setLastFeedback(null);
  };

  return (
    <div className="toy-panel">
      {/* Tappable Tray of Objects & Animals */}
      <div className="tub-tray-wrap">
        <div className="tub-tray-header">
          <span className="toy-control-label">Tap any toy or animal to drop it in the water!</span>
          <button type="button" className="toy-reset-btn" onClick={handleEmptyTub}>
            <RotateCcw size={16} /> Empty Tub
          </button>
        </div>

        <div className="tub-tray">
          {TUB_ITEMS.map((item) => {
            const inTub = droppedIds.has(item.id);
            return (
              <button
                key={item.id}
                type="button"
                className={`tub-item-btn ${inTub ? 'tub-item-btn--used' : ''}`}
                onClick={() => handleDropItem(item)}
              >
                <span className="tub-item-btn__emoji">{item.emoji}</span>
                <span className="tub-item-btn__name">{item.name}</span>
                {inTub && (
                  <span
                    className={`tub-item-btn__tag ${
                      item.floats ? 'tub-tag--float' : 'tub-tag--sink'
                    }`}
                  >
                    {item.floats ? '🎈 Float' : '⚓ Sink'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Animated Water Tank */}
      <div className="tub-stage">
        <div className="tub-sky">
          <div className="tub-scoreboard">
            <span className="tub-score-pill tub-score-pill--float">
              🎈 Floated: {floaters.length}
            </span>
            <span className="tub-score-pill tub-score-pill--sink">
              ⚓ Sank: {sinkers.length}
            </span>
          </div>
          {dropped.length === 0 && (
            <div className="tub-empty-hint">💦 Tap something above to make a splash!</div>
          )}
        </div>

        <div className="tub-water">
          {/* Decorative Rising Bubbles */}
          <span className="tub-bubble tub-bubble--1" aria-hidden="true" />
          <span className="tub-bubble tub-bubble--2" aria-hidden="true" />
          <span className="tub-bubble tub-bubble--3" aria-hidden="true" />
          <span className="tub-bubble tub-bubble--4" aria-hidden="true" />

          {/* Dropped Items — Floaters bob at top, Sinkers rest on sandy bottom */}
          {dropped.map(({ item, slotX, splashKey }) => (
            <button
              key={item.id}
              type="button"
              className={`tub-dropped-item ${
                item.floats ? 'tub-dropped-item--float' : 'tub-dropped-item--sink'
              }`}
              style={{ left: `${slotX}%` }}
              onClick={() => {
                setLastFeedback({ emoji: item.emoji, floats: item.floats, text: item.reason });
                speakText(item.reason, `tub-${item.id}`);
              }}
              title={item.name}
            >
              <span key={splashKey} className="tub-splash-burst" aria-hidden="true">
                💦
              </span>
              <span className="tub-dropped-item__emoji">{item.emoji}</span>
              <span className="tub-dropped-item__badge">
                {item.floats ? 'FLOAT!' : 'SINK!'}
              </span>
            </button>
          ))}

          {/* Sandy Bottom */}
          <div className="tub-sand" />
        </div>

        {lastFeedback && (
          <button
            type="button"
            className={`tub-feedback-bar ${
              lastFeedback.floats ? 'tub-feedback-bar--float' : 'tub-feedback-bar--sink'
            }`}
            onClick={() => speakText(lastFeedback.text, 'tub-feedback')}
          >
            <span className="tub-feedback-bar__emoji">{lastFeedback.emoji}</span>
            <span>{lastFeedback.text}</span>
            <Volume2 size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
