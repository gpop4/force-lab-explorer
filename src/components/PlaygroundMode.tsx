import { useState } from 'react';
import { RampRacerToy } from './playgrounds/RampRacerToy';
import { SinkFloatToy } from './playgrounds/SinkFloatToy';
import { MagnetTesterToy } from './playgrounds/MagnetTesterToy';

export type ToyTabId = 'ramp' | 'tub' | 'magnet';

interface PlaygroundModeProps {
  autoRead: boolean;
  speakText: (text: string, segmentId?: string) => void;
  onStopSpeech: () => void;
}

const TOY_TABS: Array<{ id: ToyTabId; emoji: string; title: string; subtitle: string }> = [
  {
    id: 'ramp',
    emoji: '🏎️',
    title: 'Ramp & Friction Racer',
    subtitle: 'Ice, Wood, Carpet or Mud!',
  },
  {
    id: 'tub',
    emoji: '⛵',
    title: 'Sink or Float Tub',
    subtitle: 'Splash & test buoyancy!',
  },
  {
    id: 'magnet',
    emoji: '🧲',
    title: 'Magnet Tester',
    subtitle: 'Stick, push away, or ignore!',
  },
];

export function PlaygroundMode({ autoRead, speakText, onStopSpeech }: PlaygroundModeProps) {
  const [activeToy, setActiveToy] = useState<ToyTabId>('ramp');

  const handleSelectToy = (id: ToyTabId) => {
    if (id === activeToy) return;
    onStopSpeech();
    setActiveToy(id);
  };

  return (
    <section className="playground-mode" aria-label="Interactive Physics Mini-Playgrounds">
      <div className="playground-tabs" role="tablist" aria-label="Choose a physics toy">
        {TOY_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeToy === tab.id}
            className={`playground-tab ${activeToy === tab.id ? 'playground-tab--active' : ''}`}
            onClick={() => handleSelectToy(tab.id)}
          >
            <span className="playground-tab__emoji">{tab.emoji}</span>
            <div className="playground-tab__text">
              <strong>{tab.title}</strong>
              <span>{tab.subtitle}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="playground-stage">
        {activeToy === 'ramp' && <RampRacerToy autoRead={autoRead} speakText={speakText} />}
        {activeToy === 'tub' && <SinkFloatToy autoRead={autoRead} speakText={speakText} />}
        {activeToy === 'magnet' && <MagnetTesterToy autoRead={autoRead} speakText={speakText} />}
      </div>
    </section>
  );
}
