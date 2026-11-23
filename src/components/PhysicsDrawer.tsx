import { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Maximize2,
  Pause,
  PawPrint,
  Play,
  Sparkles,
  Square,
  Volume2,
  X,
  Zap,
} from 'lucide-react';
import { PhysicsWonder, PhysicsZone } from '../types';
import { SpeedPreset } from '../hooks/useSpeech';
import { useWonderPhoto } from '../hooks/useWonderPhoto';

interface PhysicsDrawerProps {
  zone: PhysicsZone;
  wonderIndex: number;
  discoveredWonderIds: Set<string>;
  autoRead: boolean;
  onToggleAutoRead: () => void;
  speech: {
    supported: boolean;
    hasStudioVoice: boolean;
    hasWonderStudioVoice: (wonderId: string) => boolean;
    activeEngine: 'audio' | 'tts' | null;
    speedPreset: SpeedPreset;
    setSpeedPreset: (preset: SpeedPreset) => void;
    isSpeaking: boolean;
    isPaused: boolean;
    activeSegmentId: string | null;
    playZoneIntro: (zone: PhysicsZone) => void;
    playNarration: (zone: PhysicsZone, wonder: PhysicsWonder, includeZoneIntro: boolean) => void;
    playZoneTour: (zone: PhysicsZone, onWonderChange: (idx: number) => void) => void;
    speakText: (text: string, segmentId?: string) => void;
    pause: () => void;
    resume: () => void;
    stop: () => void;
  };
  onSelectWonderIndex: (index: number) => void;
  onStartZoneTour: () => void;
  onClose: () => void;
}

export function PhysicsDrawer({
  zone,
  wonderIndex,
  discoveredWonderIds,
  autoRead,
  onToggleAutoRead,
  speech,
  onSelectWonderIndex,
  onStartZoneTour,
  onClose,
}: PhysicsDrawerProps) {
  const wonder = zone.wonders[wonderIndex] ?? zone.wonders[0];
  const { src: photoUrl, handleImageError } = useWonderPhoto(wonder.id, wonder.wikiTitle);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handlePrev = () => {
    const nextIdx = (wonderIndex - 1 + zone.wonders.length) % zone.wonders.length;
    onSelectWonderIndex(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = (wonderIndex + 1) % zone.wonders.length;
    onSelectWonderIndex(nextIdx);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'ArrowRight') {
        onSelectWonderIndex((wonderIndex + 1) % zone.wonders.length);
      } else if (e.key === 'ArrowLeft') {
        onSelectWonderIndex((wonderIndex - 1 + zone.wonders.length) % zone.wonders.length);
      } else if (e.key === 'Escape') {
        if (lightboxOpen) {
          setLightboxOpen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [wonderIndex, zone.wonders.length, onSelectWonderIndex, onClose, lightboxOpen]);

  const handleReadCurrentWonder = () => {
    speech.playNarration(zone, wonder, false);
  };

  const isReadingWonderStory =
    speech.activeSegmentId === 'wonder-story' || speech.activeSegmentId === 'wonder-cause';
  const isActivelyTalking = speech.isSpeaking && !speech.isPaused;

  return (
    <>
      <aside className="physics-drawer" aria-label={`Physics wonders of ${zone.name}`}>
        {/* Compact Zone Header */}
        <div
          className="drawer-header"
          style={{ '--zone-color': zone.color } as React.CSSProperties}
        >
          <div className="drawer-header__compact-row">
            <span className="drawer-header__emoji">{zone.emoji}</span>
            <div className="drawer-header__title-wrap">
              <h2 className="drawer-header__title">{zone.name}</h2>
              <p className="drawer-header__subtitle">{zone.subtitle}</p>
            </div>
            <button
              type="button"
              className="icon-circle-btn"
              onClick={onClose}
              aria-label="Close physics explorer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Visual Wonder Photo Gallery Strip */}
        <div className="wonder-strip" role="tablist" aria-label="Wonders in this physics zone">
          {zone.wonders.map((w, idx) => {
            const active = idx === wonderIndex;
            const seen = discoveredWonderIds.has(w.id);
            return (
              <button
                key={w.id}
                type="button"
                role="tab"
                aria-selected={active}
                className={`wonder-thumb-card ${active ? 'wonder-thumb-card--active' : ''}`}
                onClick={() => onSelectWonderIndex(idx)}
              >
                <div className="wonder-thumb-card__img-wrap">
                  <img
                    src={`./images/wonders/${w.id}.jpg`}
                    alt={w.name}
                    className="wonder-thumb-card__img"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <span className="wonder-thumb-card__fallback-emoji">{w.emoji}</span>
                  {seen && <span className="wonder-thumb-card__star">⭐</span>}
                </div>
                <span className="wonder-thumb-card__name">{w.name}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Physics Wonder Content */}
        <div className="drawer-body">
          {/* Hero Photo Card */}
          <div
            className={`wonder-hero ${isReadingWonderStory ? 'speaking-highlight' : ''}`}
            style={{ '--wonder-accent': wonder.accentColor } as React.CSSProperties}
          >
            <div className="wonder-hero__media">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={wonder.name}
                  className="wonder-hero__img"
                  loading="eager"
                  onError={handleImageError}
                  onClick={() => setLightboxOpen(true)}
                />
              ) : (
                <div className="wonder-hero__fallback">
                  <span className="wonder-hero__big-emoji">{wonder.emoji}</span>
                </div>
              )}

              {photoUrl && (
                <button
                  type="button"
                  className="hero-zoom-btn"
                  onClick={() => setLightboxOpen(true)}
                  title="See big picture"
                  aria-label="Open large picture"
                >
                  <Maximize2 size={15} /> Big Photo
                </button>
              )}

              <span className="wonder-hero__counter">
                {wonderIndex + 1} / {zone.wonders.length}
              </span>

              {isActivelyTalking && (
                <div className="talking-banner" aria-live="polite">
                  <span className="talking-bars" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span>
                    {speech.activeSegmentId === 'zone-intro'
                      ? `Exploring ${zone.name}...`
                      : `Talking about ${wonder.name}...`}
                  </span>
                </div>
              )}

              {zone.wonders.length > 1 && (
                <>
                  <button
                    type="button"
                    className="hero-nav-btn hero-nav-btn--prev"
                    onClick={handlePrev}
                    aria-label="Previous physics wonder"
                  >
                    <ChevronLeft size={26} />
                  </button>
                  <button
                    type="button"
                    className="hero-nav-btn hero-nav-btn--next"
                    onClick={handleNext}
                    aria-label="Next physics wonder"
                  >
                    <ChevronRight size={26} />
                  </button>
                </>
              )}
            </div>

            <div className="wonder-hero__info">
              <div className="wonder-hero__name-row">
                <h3>
                  <span className="wonder-hero__emoji-inline">{wonder.emoji}</span> {wonder.name}
                </h3>
                <span className="force-badge">
                  <Zap size={13} /> {wonder.forcePower}
                </span>
              </div>

              <div className="quick-badges">
                <span className="quick-badge quick-badge--animal">
                  🐾 Animal Physics Pro: {wonder.animalPro.emoji} {wonder.animalPro.animal}
                </span>
                <span className="quick-badge">
                  <Sparkles size={13} /> {wonder.tagline}
                </span>
              </div>
            </div>
          </div>

          {/* Read Aloud Control Bar */}
          {speech.supported && (
            <div className="speech-bar">
              <div className="speech-bar__buttons">
                {!speech.isSpeaking ? (
                  <button
                    type="button"
                    className="btn-read-aloud"
                    onClick={handleReadCurrentWonder}
                  >
                    <Volume2 size={18} /> Read Aloud
                  </button>
                ) : speech.isPaused ? (
                  <button
                    type="button"
                    className="btn-read-aloud btn-read-aloud--active"
                    onClick={speech.resume}
                  >
                    <Play size={18} /> Resume
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-read-aloud btn-read-aloud--active"
                    onClick={speech.pause}
                  >
                    <Pause size={18} /> Pause
                  </button>
                )}

                {speech.isSpeaking && (
                  <button
                    type="button"
                    className="btn-stop-speech"
                    onClick={speech.stop}
                    aria-label="Stop reading"
                  >
                    <Square size={15} /> Stop
                  </button>
                )}

                {!speech.isSpeaking && zone.wonders.length > 1 && (
                  <button
                    type="button"
                    className="btn-tour-all"
                    onClick={onStartZoneTour}
                    title="Hear every physics wonder in this zone!"
                  >
                    🎙️ Tour All ({zone.wonders.length})
                  </button>
                )}
              </div>

              <div className="speech-bar__options">
                {speech.hasWonderStudioVoice(wonder.id) && (
                  <span className="studio-voice-tag" title="Pre-recorded AI Studio Narration">
                    ✨ AI Voice
                  </span>
                )}
                <button
                  type="button"
                  className={`speed-pill ${
                    speech.speedPreset === 'slow' ? 'speed-pill--active' : ''
                  }`}
                  onClick={() => speech.setSpeedPreset('slow')}
                  title="Slow story pace"
                >
                  🐢
                </button>
                <button
                  type="button"
                  className={`speed-pill ${
                    speech.speedPreset === 'normal' ? 'speed-pill--active' : ''
                  }`}
                  onClick={() => speech.setSpeedPreset('normal')}
                  title="Normal kid-friendly speed"
                >
                  🦊
                </button>
                <button
                  type="button"
                  className={`speed-pill ${
                    speech.speedPreset === 'fast' ? 'speed-pill--active' : ''
                  }`}
                  onClick={() => speech.setSpeedPreset('fast')}
                  title="Fast speed"
                >
                  ⚡
                </button>

                <button
                  type="button"
                  className={`auto-read-mini ${autoRead ? 'auto-read-mini--on' : ''}`}
                  onClick={onToggleAutoRead}
                  title="Automatically read when tapping wonders"
                >
                  {autoRead ? 'Auto: ON' : 'Auto: OFF'}
                </button>
              </div>
            </div>
          )}

          {/* Cause & Effect Card: What Happens? */}
          <button
            type="button"
            className={`cause-card ${
              speech.activeSegmentId === 'wonder-cause' ? 'speaking-highlight' : ''
            }`}
            onClick={() => speech.speakText(wonder.causeEffect, 'wonder-cause')}
          >
            <span className="cause-card__icon">⚡</span>
            <div className="cause-card__text">
              <strong>What Happens?</strong>
              <span>{wonder.causeEffect}</span>
            </div>
            {speech.supported && <Volume2 size={18} className="card-speaker-icon" />}
          </button>

          {/* Dedicated Animal Physics Pro Comparison Card */}
          <button
            type="button"
            className={`animal-pro-card ${
              speech.activeSegmentId === 'wonder-animal' ? 'speaking-highlight' : ''
            }`}
            onClick={() =>
              speech.speakText(
                `Animal Physics Pro: ${wonder.animalPro.animal}! ${wonder.animalPro.story}`,
                'wonder-animal'
              )
            }
          >
            <div className="animal-pro-card__top">
              <span className="animal-pro-card__pill">
                <PawPrint size={14} /> 🐾 Animal Physics Pro
              </span>
              <span className="animal-pro-card__badge">{wonder.animalPro.badge}</span>
            </div>
            <div className="animal-pro-card__body">
              <span className="animal-pro-card__emoji">{wonder.animalPro.emoji}</span>
              <div className="animal-pro-card__copy">
                <strong>{wonder.animalPro.animal}</strong>
                <p>{wonder.animalPro.story}</p>
              </div>
              {speech.supported && <Volume2 size={18} className="card-speaker-icon" />}
            </div>
          </button>

          {/* Try This at Home! 1-Sentence Household Experiment */}
          <button
            type="button"
            className={`try-home-card ${
              speech.activeSegmentId === 'wonder-home' ? 'speaking-highlight' : ''
            }`}
            onClick={() =>
              speech.speakText(`Try this at home! ${wonder.tryAtHome}`, 'wonder-home')
            }
          >
            <span className="try-home-card__icon">🧪</span>
            <div className="try-home-card__text">
              <strong>
                <FlaskConical size={14} /> Try This at Home!
              </strong>
              <span>{wonder.tryAtHome}</span>
            </div>
            {speech.supported && <Volume2 size={18} className="card-speaker-icon" />}
          </button>

          {/* Zone Intro Card */}
          <button
            type="button"
            className={`zone-intro-box ${
              speech.activeSegmentId === 'zone-intro' ? 'speaking-highlight' : ''
            }`}
            onClick={() => speech.playZoneIntro(zone)}
            title="Tap to hear about this physics zone"
          >
            <div className="zone-intro-box__header">
              <span>
                {zone.emoji} About {zone.name}
              </span>
              {speech.supported && (
                <span className="inline-speak-pill">
                  <Volume2 size={13} /> Hear Zone
                </span>
              )}
            </div>
            <p>{zone.intro}</p>
          </button>

          {/* Tappable Physics Fun Facts */}
          <div className="facts-section">
            <h4 className="facts-section__title">✨ Cool Physics Facts! (Tap any fact to hear it)</h4>
            <ul className="facts-list">
              {wonder.facts.map((fact, idx) => {
                const segId = `fact-${idx}`;
                const isReadingThis = speech.activeSegmentId === segId;
                return (
                  <li key={idx}>
                    <button
                      type="button"
                      className={`fact-card ${isReadingThis ? 'speaking-highlight' : ''}`}
                      onClick={() => speech.speakText(fact, segId)}
                    >
                      <span className="fact-card__num">{idx + 1}</span>
                      <span className="fact-card__text">{fact}</span>
                      {speech.supported && (
                        <Volume2 size={16} className="fact-card__speaker" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Big Bottom Navigation for Little Fingers */}
          {zone.wonders.length > 1 && (
            <div className="drawer-footer-nav">
              <button type="button" className="big-nav-btn" onClick={handlePrev}>
                <ChevronLeft size={20} /> Previous Wonder
              </button>
              <button
                type="button"
                className="big-nav-btn big-nav-btn--primary"
                onClick={handleNext}
              >
                Next Wonder <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Fullscreen Big Photo Lightbox */}
      {lightboxOpen && photoUrl && (
        <div
          className="photo-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Large picture of ${wonder.name}`}
          onClick={() => setLightboxOpen(false)}
        >
          <div className="photo-lightbox__card" onClick={(e) => e.stopPropagation()}>
            <div className="photo-lightbox__top">
              <div className="photo-lightbox__title">
                <span>{wonder.emoji}</span>
                <h3>{wonder.name}</h3>
                <span className="photo-lightbox__place">• {zone.name}</span>
              </div>
              <button
                type="button"
                className="icon-circle-btn"
                onClick={() => setLightboxOpen(false)}
                aria-label="Close big photo"
              >
                <X size={20} />
              </button>
            </div>

            <div className="photo-lightbox__stage">
              <img src={photoUrl} alt={wonder.name} className="photo-lightbox__img" />

              {zone.wonders.length > 1 && (
                <>
                  <button
                    type="button"
                    className="hero-nav-btn hero-nav-btn--prev"
                    onClick={handlePrev}
                    aria-label="Previous wonder"
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button
                    type="button"
                    className="hero-nav-btn hero-nav-btn--next"
                    onClick={handleNext}
                    aria-label="Next wonder"
                  >
                    <ChevronRight size={28} />
                  </button>
                </>
              )}
            </div>

            <div className="photo-lightbox__footer">
              <p className="photo-lightbox__caption">
                🐾 <strong>{wonder.animalPro.emoji} {wonder.animalPro.animal}:</strong>{' '}
                {wonder.animalPro.story}
              </p>
              {speech.supported && (
                <div className="photo-lightbox__controls">
                  {!speech.isSpeaking ? (
                    <button
                      type="button"
                      className="btn-read-aloud"
                      onClick={handleReadCurrentWonder}
                    >
                      <Volume2 size={18} /> Read Aloud
                    </button>
                  ) : speech.isPaused ? (
                    <button
                      type="button"
                      className="btn-read-aloud btn-read-aloud--active"
                      onClick={speech.resume}
                    >
                      <Play size={18} /> Resume
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn-read-aloud btn-read-aloud--active"
                      onClick={speech.pause}
                    >
                      <Pause size={18} /> Pause
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
