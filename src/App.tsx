import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Compass,
  Gamepad2,
  Map as MapIcon,
  RotateCcw,
  Search,
  Shuffle,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { PHYSICS_ZONES, TOTAL_WONDERS } from './data/zones';
import { PhysicsZone } from './types';
import { useSpeech } from './hooks/useSpeech';
import { PhysicsMap } from './components/PhysicsMap';
import { PhysicsDrawer } from './components/PhysicsDrawer';
import { WonderEntry, WonderMode } from './components/WonderMode';
import { PlaygroundMode } from './components/PlaygroundMode';

type AppMode = 'map' | 'wonders' | 'playground';

const STORAGE_WONDERS_KEY = 'force-lab-explorer:discovered-wonders:v1';

function loadSavedSet(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed) : new Set();
  } catch {
    return new Set();
  }
}

export function App() {
  const [mode, setMode] = useState<AppMode>('map');
  const [wonderModeInspecting, setWonderModeInspecting] = useState<boolean>(false);
  const [carouselIndex, setCarouselIndex] = useState<number>(0);

  const [selectedZone, setSelectedZone] = useState<PhysicsZone | null>(null);
  const [wonderIndex, setWonderIndex] = useState<number>(0);
  const [jumpTarget, setJumpTarget] = useState<{
    x: number;
    y: number;
    zoom: number;
    nonce: number;
  } | null>(null);
  const [resetSignal, setResetSignal] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [passportOpen, setPassportOpen] = useState<boolean>(false);
  const [autoRead, setAutoRead] = useState<boolean>(true);

  const [discoveredWonders, setDiscoveredWonders] = useState<Set<string>>(() =>
    loadSavedSet(STORAGE_WONDERS_KEY)
  );

  const speech = useSpeech();

  // Flatten all 42 wonders for Wonder Cards Carousel & Surprise Me
  const allWonderEntries = useMemo<WonderEntry[]>(() => {
    const list: WonderEntry[] = [];
    for (const zone of PHYSICS_ZONES) {
      zone.wonders.forEach((wonder, idx) => {
        list.push({ wonder, zone, wonderIndexInZone: idx });
      });
    }
    return list;
  }, []);

  // Persist Physics Explorer Passport to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_WONDERS_KEY,
        JSON.stringify(Array.from(discoveredWonders))
      );
    } catch {
      // ignore storage errors
    }
  }, [discoveredWonders]);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const results: Array<{
      key: string;
      emoji: string;
      title: string;
      subtitle: string;
      zone: PhysicsZone;
      wonderIdx: number;
    }> = [];

    for (const zone of PHYSICS_ZONES) {
      if (
        zone.name.toLowerCase().includes(q) ||
        zone.subtitle.toLowerCase().includes(q)
      ) {
        results.push({
          key: `zone-${zone.id}`,
          emoji: zone.emoji,
          title: zone.name,
          subtitle: `${zone.subtitle} • ${zone.wonders.length} wonders`,
          zone,
          wonderIdx: 0,
        });
      }

      zone.wonders.forEach((wonder, idx) => {
        if (
          wonder.name.toLowerCase().includes(q) ||
          wonder.forcePower.toLowerCase().includes(q) ||
          wonder.animalPro.animal.toLowerCase().includes(q) ||
          wonder.tagline.toLowerCase().includes(q)
        ) {
          results.push({
            key: `wonder-${zone.id}-${wonder.id}`,
            emoji: wonder.emoji,
            title: wonder.name,
            subtitle: `${zone.shortName} • 🐾 ${wonder.animalPro.emoji} ${wonder.animalPro.animal}`,
            zone,
            wonderIdx: idx,
          });
        }
      });
    }

    return results.slice(0, 10);
  }, [searchQuery]);

  const markDiscovered = useCallback((zone: PhysicsZone, wIdx: number) => {
    const wonder = zone.wonders[wIdx];
    if (wonder) {
      setDiscoveredWonders((prev) => {
        if (prev.has(wonder.id)) return prev;
        const next = new Set(prev);
        next.add(wonder.id);
        return next;
      });
    }
  }, []);

  const handleSelectZone = useCallback(
    (zone: PhysicsZone, startWonderIdx = 0, forceReadWonderOnly = false) => {
      setSelectedZone(zone);
      setWonderIndex(startWonderIdx);
      setSearchOpen(false);
      setSearchQuery('');
      setPassportOpen(false);
      markDiscovered(zone, startWonderIdx);

      const wonder = zone.wonders[startWonderIdx] ?? zone.wonders[0];
      if (forceReadWonderOnly && speech.supported) {
        speech.playNarration(zone, wonder, false);
      } else if (autoRead && speech.supported) {
        // Include zone intro when opening zone hub (index 0) and not already in that zone
        const includeIntro = startWonderIdx === 0 && selectedZone?.id !== zone.id;
        speech.playNarration(zone, wonder, includeIntro);
      } else {
        speech.stop();
      }
    },
    [autoRead, speech, markDiscovered, selectedZone?.id]
  );

  const handleSelectFromWonderMode = useCallback(
    (entry: WonderEntry, indexInList: number) => {
      setCarouselIndex(indexInList);
      setWonderModeInspecting(true);
      handleSelectZone(entry.zone, entry.wonderIndexInZone, true);
    },
    [handleSelectZone]
  );

  const handleBackToWonderCarousel = useCallback(() => {
    speech.stop();
    setSelectedZone(null);
    setWonderModeInspecting(false);
  }, [speech]);

  const handleSwitchMode = useCallback(
    (nextMode: AppMode) => {
      if (nextMode === mode && !wonderModeInspecting) return;
      speech.stop();
      setMode(nextMode);
      setWonderModeInspecting(false);
      setSearchOpen(false);
      setPassportOpen(false);
      if (nextMode !== 'map') {
        setSelectedZone(null);
      }
    },
    [mode, wonderModeInspecting, speech]
  );

  const handleSelectWonderIndex = useCallback(
    (nextIdx: number) => {
      if (!selectedZone) return;
      setWonderIndex(nextIdx);
      markDiscovered(selectedZone, nextIdx);

      if (autoRead && speech.supported) {
        const wonder = selectedZone.wonders[nextIdx];
        if (wonder) {
          speech.playNarration(selectedZone, wonder, false);
        }
      } else {
        speech.stop();
      }
    },
    [selectedZone, autoRead, speech, markDiscovered]
  );

  const handleStartZoneTour = useCallback(() => {
    if (!selectedZone) return;
    speech.playZoneTour(selectedZone, (idx) => {
      setWonderIndex(idx);
      markDiscovered(selectedZone, idx);
    });
  }, [selectedZone, speech, markDiscovered]);

  const handleCloseDrawer = useCallback(() => {
    speech.stop();
    setSelectedZone(null);
    if (mode === 'wonders') {
      setWonderModeInspecting(false);
    }
  }, [speech, mode]);

  const handleToggleAutoRead = useCallback(() => {
    setAutoRead((prev) => {
      const next = !prev;
      if (!next) {
        speech.stop();
      }
      return next;
    });
  }, [speech]);

  const handleSurpriseMe = useCallback(() => {
    if (mode === 'wonders' && !wonderModeInspecting) {
      const randomIdx = Math.floor(Math.random() * allWonderEntries.length);
      handleSelectFromWonderMode(allWonderEntries[randomIdx], randomIdx);
      return;
    }

    if (mode === 'playground') {
      setMode('map');
    }

    const randomEntry =
      allWonderEntries[Math.floor(Math.random() * allWonderEntries.length)];
    handleSelectZone(randomEntry.zone, randomEntry.wonderIndexInZone, false);
  }, [
    mode,
    wonderModeInspecting,
    allWonderEntries,
    handleSelectFromWonderMode,
    handleSelectZone,
  ]);

  const handleJumpZone = useCallback((zone: PhysicsZone) => {
    setJumpTarget({
      x: zone.x,
      y: zone.y,
      zoom: 1.16,
      nonce: Date.now(),
    });
  }, []);

  const handleResetPark = useCallback(() => {
    speech.stop();
    setSelectedZone(null);
    setJumpTarget(null);
    setWonderModeInspecting(false);
    setPassportOpen(false);
    setMode('map');
    setResetSignal((n) => n + 1);
  }, [speech]);

  const handleResetPassport = useCallback(() => {
    setDiscoveredWonders(new Set());
  }, []);

  const showingCarousel = mode === 'wonders' && !wonderModeInspecting;
  const showingPlayground = mode === 'playground';
  const focusedWonder =
    mode === 'wonders' && wonderModeInspecting && selectedZone
      ? {
          wonder: selectedZone.wonders[wonderIndex] ?? selectedZone.wonders[0],
          zone: selectedZone,
        }
      : null;

  return (
    <div className="app-shell">
      {/* Top Cheerful Header Bar */}
      <header className="top-bar">
        <button
          type="button"
          className="brand-btn"
          onClick={handleResetPark}
          title="Back to Full Physics Playground Map"
        >
          <span className="brand-btn__icon">⚡</span>
          <div className="brand-btn__text">
            <h1>Bounce, Zoom &amp; Float</h1>
            <span>
              {showingCarousel
                ? `Browse ${TOTAL_WONDERS} physics wonders & animal pros!`
                : showingPlayground
                ? 'Play with ramps, water & magnets!'
                : 'Tap any zone or wonder to explore & hear!'}
            </span>
          </div>
        </button>

        {/* 3-Mode Switcher: Physics Map / Wonder Cards / Play Lab */}
        <div className="mode-switcher" role="group" aria-label="Explorer mode">
          <button
            type="button"
            className={`mode-btn ${mode === 'map' ? 'mode-btn--active' : ''}`}
            onClick={() => handleSwitchMode('map')}
          >
            <MapIcon size={16} />
            <span>Physics Map</span>
          </button>
          <button
            type="button"
            className={`mode-btn ${mode === 'wonders' ? 'mode-btn--active' : ''}`}
            onClick={() => handleSwitchMode('wonders')}
          >
            <Sparkles size={16} />
            <span>Wonder Cards</span>
          </button>
          <button
            type="button"
            className={`mode-btn ${mode === 'playground' ? 'mode-btn--active' : ''}`}
            onClick={() => handleSwitchMode('playground')}
          >
            <Gamepad2 size={16} />
            <span>Play Lab</span>
          </button>
        </div>

        {/* Search Box */}
        <div className="search-wrap">
          <div className="search-input-box">
            <Search size={17} className="search-icon" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setSearchOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              placeholder={
                showingCarousel
                  ? 'Filter wonders or animals (Cheetah, Magnet)...'
                  : 'Search force, toy, or animal (Penguin, Gears)...'
              }
              aria-label="Search physics wonders, zones, or animal pros"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => {
                  setSearchQuery('');
                  setSearchOpen(false);
                }}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {!showingCarousel && searchOpen && searchQuery.trim().length > 0 && (
            <div className="search-dropdown">
              {searchResults.length === 0 ? (
                <div className="search-empty">
                  No matches yet — try &quot;Penguin&quot;, &quot;Magnet&quot;, &quot;Duck&quot;, or &quot;Gears&quot;!
                </div>
              ) : (
                searchResults.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    className="search-item"
                    onClick={() => {
                      if (mode === 'playground') setMode('map');
                      handleSelectZone(item.zone, item.wonderIdx);
                    }}
                  >
                    <span className="search-item__emoji">{item.emoji}</span>
                    <div className="search-item__text">
                      <strong>{item.title}</strong>
                      <span>{item.subtitle}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Action Pills & Explorer Passport */}
        <div className="top-actions">
          {speech.supported && (
            <button
              type="button"
              className={`action-pill ${autoRead ? 'action-pill--read-on' : ''}`}
              onClick={handleToggleAutoRead}
              title="Toggle Read-Aloud Mode"
            >
              {autoRead ? <Volume2 size={18} /> : <VolumeX size={18} />}
              <span>Read Aloud: {autoRead ? 'ON' : 'OFF'}</span>
            </button>
          )}

          <button
            type="button"
            className="action-pill action-pill--surprise"
            onClick={handleSurpriseMe}
            title="Jump to a surprise physics wonder!"
          >
            <Shuffle size={17} />
            <span>Surprise Me!</span>
          </button>

          <button
            type="button"
            className="passport-badge"
            onClick={() => setPassportOpen((o) => !o)}
            title="Open your Physics Explorer Passport!"
          >
            <span>⭐</span>
            <strong>
              {discoveredWonders.size} / {TOTAL_WONDERS}
            </strong>
          </button>
        </div>
      </header>

      {/* Main Content Area: Play Lab OR Wonder Cards OR Interactive Physics World Map */}
      {showingPlayground ? (
        <PlaygroundMode
          autoRead={autoRead}
          speakText={speech.speakText}
          onStopSpeech={speech.stop}
        />
      ) : showingCarousel ? (
        <WonderMode
          entries={allWonderEntries}
          zones={PHYSICS_ZONES}
          activeIndex={carouselIndex}
          searchQuery={searchQuery}
          discoveredWonderIds={discoveredWonders}
          hasWonderStudioVoice={speech.hasWonderStudioVoice}
          onChangeActiveIndex={setCarouselIndex}
          onSelectWonder={handleSelectFromWonderMode}
        />
      ) : (
        <>
          <main className="map-stage">
            <PhysicsMap
              zones={PHYSICS_ZONES}
              selectedZone={selectedZone}
              selectedWonderIndex={wonderIndex}
              focusedWonder={focusedWonder}
              discoveredWonderIds={discoveredWonders}
              jumpTarget={jumpTarget}
              resetSignal={resetSignal}
              onSelectZone={(z, idx = 0) => handleSelectZone(z, idx)}
            />

            {/* Back to Wonder Cards floating button when inspecting from Carousel */}
            {mode === 'wonders' && wonderModeInspecting && (
              <button
                type="button"
                className="back-carousel-btn"
                onClick={handleBackToWonderCarousel}
              >
                <ArrowLeft size={18} />
                <span>Back to Wonder Cards</span>
              </button>
            )}

            {/* Friendly Welcome Hint when nothing is open */}
            {!selectedZone && mode === 'map' && (
              <div className="welcome-toast">
                <Compass size={18} />
                <span>
                  Drag, zoom, or tap any Physics Zone or Wonder badge to discover &amp; listen!
                </span>
              </div>
            )}

            {/* Slide-out Physics Detail Drawer */}
            {selectedZone && (
              <PhysicsDrawer
                zone={selectedZone}
                wonderIndex={wonderIndex}
                discoveredWonderIds={discoveredWonders}
                autoRead={autoRead}
                onToggleAutoRead={handleToggleAutoRead}
                speech={speech}
                onSelectWonderIndex={handleSelectWonderIndex}
                onStartZoneTour={handleStartZoneTour}
                onClose={handleCloseDrawer}
              />
            )}
          </main>

          {/* Bottom Quick-Jump Bar across all 6 Physics Zones */}
          {mode === 'map' && (
            <footer className="zone-jump-bar" aria-label="Quick-jump to a physics zone">
              {PHYSICS_ZONES.map((z) => (
                <button
                  key={z.id}
                  type="button"
                  className={`zone-jump-btn ${
                    selectedZone?.id === z.id ? 'zone-jump-btn--active' : ''
                  }`}
                  style={{ '--zone-color': z.color } as React.CSSProperties}
                  onClick={() => handleJumpZone(z)}
                >
                  <span>{z.emoji}</span>
                  <span>{z.shortName}</span>
                </button>
              ))}
              <button
                type="button"
                className="zone-jump-btn zone-jump-btn--all"
                onClick={handleResetPark}
              >
                <span>🗺️</span>
                <span>Full Park</span>
              </button>
            </footer>
          )}
        </>
      )}

      {/* Physics Explorer Passport Modal */}
      {passportOpen && (
        <div
          className="passport-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Physics Explorer Passport"
          onClick={() => setPassportOpen(false)}
        >
          <div className="passport-card" onClick={(e) => e.stopPropagation()}>
            <div className="passport-card__header">
              <div>
                <h2>⭐ Physics Explorer Passport</h2>
                <p>
                  You discovered <strong>{discoveredWonders.size}</strong> out of{' '}
                  <strong>{TOTAL_WONDERS}</strong> Physics Wonders!
                </p>
              </div>
              <button
                type="button"
                className="icon-circle-btn"
                onClick={() => setPassportOpen(false)}
                aria-label="Close passport"
              >
                <X size={20} />
              </button>
            </div>

            <div className="passport-zones">
              {PHYSICS_ZONES.map((z) => {
                const count = z.wonders.filter((w) => discoveredWonders.has(w.id)).length;
                const pct = Math.round((count / z.wonders.length) * 100);
                return (
                  <button
                    key={z.id}
                    type="button"
                    className="passport-zone-row"
                    onClick={() => {
                      setMode('map');
                      handleSelectZone(z, 0);
                    }}
                  >
                    <span className="passport-zone-row__emoji">{z.emoji}</span>
                    <div className="passport-zone-row__info">
                      <div className="passport-zone-row__top">
                        <strong>{z.name}</strong>
                        <span>
                          {count}/{z.wonders.length} {count === z.wonders.length ? '🏆' : '⭐'}
                        </span>
                      </div>
                      <div className="passport-bar">
                        <div
                          className="passport-bar__fill"
                          style={{ width: `${pct}%`, background: z.color }}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="passport-card__footer">
              <button
                type="button"
                className="toy-reset-btn"
                onClick={handleResetPassport}
              >
                <RotateCcw size={15} /> Reset Stamps
              </button>
              <button
                type="button"
                className="btn-read-aloud"
                onClick={() => setPassportOpen(false)}
              >
                Keep Exploring!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
