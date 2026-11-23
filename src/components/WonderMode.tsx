import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  Shuffle,
  Volume2,
} from 'lucide-react';
import { PhysicsWonder, PhysicsZone, ZoneId } from '../types';

export interface WonderEntry {
  wonder: PhysicsWonder;
  zone: PhysicsZone;
  wonderIndexInZone: number;
}

interface WonderModeProps {
  entries: WonderEntry[];
  zones: PhysicsZone[];
  activeIndex: number;
  searchQuery: string;
  discoveredWonderIds: Set<string>;
  hasWonderStudioVoice: (wonderId: string) => boolean;
  onChangeActiveIndex: (index: number) => void;
  onSelectWonder: (entry: WonderEntry, indexInList: number) => void;
}

type ZoneFilter = 'all' | ZoneId;

export function WonderMode({
  entries,
  zones,
  activeIndex,
  searchQuery,
  discoveredWonderIds,
  hasWonderStudioVoice,
  onChangeActiveIndex,
  onSelectWonder,
}: WonderModeProps) {
  const [zoneFilter, setZoneFilter] = useState<ZoneFilter>('all');
  const [shuffleOrder, setShuffleOrder] = useState<number[] | null>(null);
  const touchStartX = useRef<number | null>(null);
  const filmstripRef = useRef<HTMLDivElement | null>(null);

  const orderedEntries = useMemo(() => {
    if (!shuffleOrder) return entries;
    return shuffleOrder.map((i) => entries[i]).filter(Boolean);
  }, [entries, shuffleOrder]);

  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return orderedEntries.filter(({ wonder, zone }) => {
      if (zoneFilter !== 'all' && zone.id !== zoneFilter) return false;
      if (!q) return true;
      return (
        wonder.name.toLowerCase().includes(q) ||
        wonder.forcePower.toLowerCase().includes(q) ||
        wonder.animalPro.animal.toLowerCase().includes(q) ||
        zone.name.toLowerCase().includes(q)
      );
    });
  }, [orderedEntries, zoneFilter, searchQuery]);

  const safeIndex =
    filteredEntries.length > 0
      ? ((activeIndex % filteredEntries.length) + filteredEntries.length) %
        filteredEntries.length
      : 0;

  const currentEntry = filteredEntries[safeIndex] ?? null;
  const prevEntry =
    filteredEntries.length > 1
      ? filteredEntries[(safeIndex - 1 + filteredEntries.length) % filteredEntries.length]
      : null;
  const nextEntry =
    filteredEntries.length > 1
      ? filteredEntries[(safeIndex + 1) % filteredEntries.length]
      : null;

  const goPrev = () => {
    if (filteredEntries.length <= 1) return;
    onChangeActiveIndex((safeIndex - 1 + filteredEntries.length) % filteredEntries.length);
  };

  const goNext = () => {
    if (filteredEntries.length <= 1) return;
    onChangeActiveIndex((safeIndex + 1) % filteredEntries.length);
  };

  const handleShuffle = () => {
    const indices = entries.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setShuffleOrder(indices);
    onChangeActiveIndex(0);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'ArrowRight') {
        if (filteredEntries.length > 1) {
          onChangeActiveIndex((safeIndex + 1) % filteredEntries.length);
        }
      } else if (e.key === 'ArrowLeft') {
        if (filteredEntries.length > 1) {
          onChangeActiveIndex(
            (safeIndex - 1 + filteredEntries.length) % filteredEntries.length
          );
        }
      } else if (e.key === 'Enter' && currentEntry) {
        onSelectWonder(currentEntry, safeIndex);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [filteredEntries.length, safeIndex, currentEntry, onChangeActiveIndex, onSelectWonder]);

  useEffect(() => {
    const strip = filmstripRef.current;
    if (!strip) return;
    const activeEl = strip.querySelector<HTMLElement>('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [safeIndex, zoneFilter]);

  return (
    <section className="wonder-mode" aria-label="Physics Wonder Cards Carousel">
      {/* Zone Filter Toolbar */}
      <div className="wonder-mode__toolbar">
        <div className="wonder-mode__filters" role="tablist" aria-label="Filter by physics zone">
          <button
            type="button"
            role="tab"
            aria-selected={zoneFilter === 'all'}
            className={`filter-chip ${zoneFilter === 'all' ? 'filter-chip--active' : ''}`}
            onClick={() => {
              setZoneFilter('all');
              onChangeActiveIndex(0);
            }}
          >
            ⚡ All Wonders
          </button>
          {zones.map((z) => (
            <button
              key={z.id}
              type="button"
              role="tab"
              aria-selected={zoneFilter === z.id}
              className={`filter-chip ${zoneFilter === z.id ? 'filter-chip--active' : ''}`}
              onClick={() => {
                setZoneFilter(z.id);
                onChangeActiveIndex(0);
              }}
            >
              {z.emoji} {z.shortName}
            </button>
          ))}
        </div>

        <div className="wonder-mode__meta">
          <span className="wonder-mode__count">
            {filteredEntries.length > 0
              ? `${safeIndex + 1} / ${filteredEntries.length} Wonders`
              : '0 Wonders'}
          </span>
          <button
            type="button"
            className="filter-chip filter-chip--shuffle"
            onClick={handleShuffle}
            title="Shuffle all physics wonders"
          >
            <Shuffle size={15} /> Shuffle
          </button>
        </div>
      </div>

      {filteredEntries.length === 0 || !currentEntry ? (
        <div className="wonder-mode__empty">
          <span className="wonder-mode__empty-emoji">🔍</span>
          <h2>No matching physics wonders found</h2>
          <p>Try clearing the search box or switching to All Wonders!</p>
        </div>
      ) : (
        <div className="wonder-mode__content">
          {/* Spotlight Carousel Stage */}
          <div
            className="carousel-stage"
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return;
              const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
              const delta = endX - touchStartX.current;
              touchStartX.current = null;
              if (delta > 45) goPrev();
              else if (delta < -45) goNext();
            }}
          >
            {filteredEntries.length > 1 && (
              <button
                type="button"
                className="carousel-arrow carousel-arrow--left"
                onClick={goPrev}
                aria-label="Previous wonder"
              >
                <ChevronLeft size={34} />
              </button>
            )}

            {prevEntry && (
              <button
                type="button"
                className="carousel-peek carousel-peek--left"
                onClick={goPrev}
                aria-label={`Previous: ${prevEntry.wonder.name}`}
              >
                <img
                  src={`./images/wonders/${prevEntry.wonder.id}.jpg`}
                  alt={prevEntry.wonder.name}
                  className="carousel-peek__img"
                />
                <div className="carousel-peek__name">
                  {prevEntry.wonder.emoji} {prevEntry.wonder.name}
                </div>
              </button>
            )}

            {/* Main Featured Wonder Card */}
            <button
              type="button"
              className="carousel-hero-card"
              style={
                { '--wonder-accent': currentEntry.wonder.accentColor } as React.CSSProperties
              }
              onClick={() => onSelectWonder(currentEntry, safeIndex)}
            >
              <div className="carousel-hero-card__photo-wrap">
                <img
                  src={`./images/wonders/${currentEntry.wonder.id}.jpg`}
                  alt={currentEntry.wonder.name}
                  className="carousel-hero-card__photo"
                />

                <div className="carousel-hero-card__badges">
                  <span className="carousel-group-pill">
                    {currentEntry.zone.emoji} {currentEntry.zone.shortName}
                  </span>
                  <span className="carousel-animal-pill">
                    🐾 {currentEntry.wonder.animalPro.emoji} {currentEntry.wonder.animalPro.animal}
                  </span>
                  {hasWonderStudioVoice(currentEntry.wonder.id) && (
                    <span className="carousel-ai-pill">✨ AI Voice</span>
                  )}
                  {discoveredWonderIds.has(currentEntry.wonder.id) && (
                    <span className="carousel-star-pill">⭐ Explored</span>
                  )}
                </div>
              </div>

              <div className="carousel-hero-card__footer">
                <div className="carousel-hero-card__title-row">
                  <span className="carousel-hero-card__emoji">
                    {currentEntry.wonder.emoji}
                  </span>
                  <h2>{currentEntry.wonder.name}</h2>
                </div>

                <p className="carousel-hero-card__tagline">
                  {currentEntry.wonder.tagline}
                </p>

                <span className="carousel-hero-card__cta">
                  <Compass size={18} />
                  <span>Tap to jump to the Physics Map &amp; listen!</span>
                  <Volume2 size={18} />
                </span>
              </div>
            </button>

            {nextEntry && (
              <button
                type="button"
                className="carousel-peek carousel-peek--right"
                onClick={goNext}
                aria-label={`Next: ${nextEntry.wonder.name}`}
              >
                <img
                  src={`./images/wonders/${nextEntry.wonder.id}.jpg`}
                  alt={nextEntry.wonder.name}
                  className="carousel-peek__img"
                />
                <div className="carousel-peek__name">
                  {nextEntry.wonder.emoji} {nextEntry.wonder.name}
                </div>
              </button>
            )}

            {filteredEntries.length > 1 && (
              <button
                type="button"
                className="carousel-arrow carousel-arrow--right"
                onClick={goNext}
                aria-label="Next wonder"
              >
                <ChevronRight size={34} />
              </button>
            )}
          </div>

          {/* Bottom Horizontal Picture Deck */}
          <div className="carousel-deck-wrap">
            <div className="carousel-deck-header">
              <span>⚡ Swipe or tap any card below to jump onto the Physics Map:</span>
            </div>
            <div ref={filmstripRef} className="carousel-deck" role="list">
              {filteredEntries.map((entry, idx) => {
                const isActive = idx === safeIndex;
                const seen = discoveredWonderIds.has(entry.wonder.id);
                return (
                  <button
                    key={entry.wonder.id}
                    type="button"
                    role="listitem"
                    data-active={isActive}
                    className={`deck-card ${isActive ? 'deck-card--active' : ''}`}
                    onClick={() => onSelectWonder(entry, idx)}
                  >
                    <div className="deck-card__img-wrap">
                      <img
                        src={`./images/wonders/${entry.wonder.id}.jpg`}
                        alt={entry.wonder.name}
                        className="deck-card__img"
                        loading="lazy"
                      />
                      {seen && <span className="deck-card__star">⭐</span>}
                    </div>
                    <span className="deck-card__name">{entry.wonder.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
