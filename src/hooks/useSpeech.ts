import { useCallback, useEffect, useRef, useState } from 'react';
import { PhysicsWonder, PhysicsZone } from '../types';

export type SpeedPreset = 'slow' | 'normal' | 'fast';

interface AudioManifest {
  model?: string;
  voice?: string;
  zones: Record<string, string>;
  wonders: Record<string, string>;
}

type QueueStep =
  | {
      kind: 'audio';
      id: string;
      url: string;
      fallbackText: string;
      onStepStart?: () => void;
    }
  | {
      kind: 'tts';
      id: string;
      text: string;
      onStepStart?: () => void;
    };

const AUDIO_RATES: Record<SpeedPreset, number> = {
  slow: 0.84,
  normal: 0.96,
  fast: 1.12,
};

const TTS_RATES: Record<SpeedPreset, number> = {
  slow: 0.65,
  normal: 0.78,
  fast: 0.92,
};

function buildWonderFallbackText(wonder: PhysicsWonder): string {
  return [
    `${wonder.name}! ${wonder.tagline}`,
    `What happens? ${wonder.causeEffect}`,
    `Animal Physics Pro: ${wonder.animalPro.animal}! ${wonder.animalPro.story}`,
    `Try this at home! ${wonder.tryAtHome}`,
    ...wonder.facts.map((f, i) => `Physics fact number ${i + 1}: ${f}`),
  ].join(' ');
}

export function useSpeech() {
  const [ttsSupported] = useState(
    () => typeof window !== 'undefined' && 'speechSynthesis' in window
  );
  const [manifest, setManifest] = useState<AudioManifest>({
    zones: {},
    wonders: {},
  });
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [speedPreset, setSpeedPreset] = useState<SpeedPreset>('normal');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);
  const [activeEngine, setActiveEngine] = useState<'audio' | 'tts' | null>(null);

  const runIdRef = useRef<number>(0);
  const speedRef = useRef<SpeedPreset>(speedPreset);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pauseTimerRef = useRef<number | null>(null);
  const activeEngineRef = useRef<'audio' | 'tts' | null>(null);

  const hasStudioVoice =
    Object.keys(manifest.wonders).length > 0 || Object.keys(manifest.zones).length > 0;

  const hasWonderStudioVoice = useCallback(
    (wonderId: string) => Boolean(manifest.wonders[wonderId]),
    [manifest]
  );

  const supported = ttsSupported || hasStudioVoice;

  // Load pre-generated Kokoro-82M studio audio manifest
  useEffect(() => {
    let cancelled = false;
    fetch('./audio/manifest.json')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data && typeof data === 'object') {
          setManifest({
            model: data.model,
            voice: data.voice,
            zones: data.zones || {},
            wonders: data.wonders || {},
          });
        }
      })
      .catch(() => {
        // Manifest optional; falls back to browser Web Speech API
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Update playback rate immediately if audio is playing
  useEffect(() => {
    speedRef.current = speedPreset;
    if (audioRef.current) {
      audioRef.current.playbackRate = AUDIO_RATES[speedPreset];
    }
  }, [speedPreset]);

  // Load browser speech fallback voices
  useEffect(() => {
    if (!ttsSupported) return;

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      const english = available.filter((v) => v.lang.toLowerCase().startsWith('en'));
      const list = english.length > 0 ? english : available;
      setVoices(list);

      if (!selectedVoiceURI && list.length > 0) {
        const preferredNames = [
          'Samantha',
          'Google US English',
          'Karen',
          'Moira',
          'Tessa',
          'Daniel',
          'Alex',
        ];
        const match =
          preferredNames
            .map((name) => list.find((v) => v.name.includes(name)))
            .find(Boolean) || list[0];
        if (match) {
          setSelectedVoiceURI(match.voiceURI);
        }
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [ttsSupported, selectedVoiceURI]);

  const clearPauseTimer = useCallback(() => {
    if (pauseTimerRef.current !== null) {
      window.clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
  }, []);

  const stopAudioEl = useCallback(() => {
    const el = audioRef.current;
    if (el) {
      el.onended = null;
      el.onerror = null;
      el.onplay = null;
      el.pause();
      el.currentTime = 0;
      audioRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    runIdRef.current += 1;
    clearPauseTimer();
    stopAudioEl();
    if (ttsSupported) {
      window.speechSynthesis.cancel();
    }
    activeEngineRef.current = null;
    setActiveEngine(null);
    setIsSpeaking(false);
    setIsPaused(false);
    setActiveSegmentId(null);
  }, [ttsSupported, clearPauseTimer, stopAudioEl]);

  const pause = useCallback(() => {
    if (!isSpeaking) return;
    clearPauseTimer();
    if (activeEngineRef.current === 'audio' && audioRef.current) {
      audioRef.current.pause();
      setIsPaused(true);
    } else if (activeEngineRef.current === 'tts' && ttsSupported) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isSpeaking, ttsSupported, clearPauseTimer]);

  const resume = useCallback(() => {
    if (!isPaused) return;
    if (activeEngineRef.current === 'audio' && audioRef.current) {
      audioRef.current.play().catch(() => {});
      setIsPaused(false);
    } else if (activeEngineRef.current === 'tts' && ttsSupported) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [isPaused, ttsSupported]);

  const runQueue = useCallback(
    (steps: QueueStep[]) => {
      if (steps.length === 0) return;

      runIdRef.current += 1;
      const currentRunId = runIdRef.current;

      clearPauseTimer();
      stopAudioEl();
      if (ttsSupported) {
        window.speechSynthesis.cancel();
      }

      setIsSpeaking(true);
      setIsPaused(false);

      const chosenVoice = voices.find((v) => v.voiceURI === selectedVoiceURI) || null;

      const finishAll = () => {
        if (runIdRef.current !== currentRunId) return;
        activeEngineRef.current = null;
        setActiveEngine(null);
        setIsSpeaking(false);
        setIsPaused(false);
        setActiveSegmentId(null);
      };

      const speakTtsStep = (id: string, text: string, onDone: () => void) => {
        if (!ttsSupported) {
          onDone();
          return;
        }
        activeEngineRef.current = 'tts';
        setActiveEngine('tts');

        const utterance = new SpeechSynthesisUtterance(text);
        if (chosenVoice) {
          utterance.voice = chosenVoice;
        }
        utterance.rate = TTS_RATES[speedRef.current];
        utterance.pitch = 1.04;

        utterance.onstart = () => {
          if (runIdRef.current === currentRunId) {
            setActiveSegmentId(id);
          }
        };

        utterance.onend = () => {
          if (runIdRef.current === currentRunId) {
            onDone();
          }
        };

        utterance.onerror = () => {
          if (runIdRef.current === currentRunId) {
            finishAll();
          }
        };

        window.speechSynthesis.speak(utterance);
      };

      const playIndex = (idx: number) => {
        if (runIdRef.current !== currentRunId) return;
        if (idx >= steps.length) {
          finishAll();
          return;
        }

        const step = steps[idx];
        step.onStepStart?.();

        const advanceWithPause = () => {
          if (runIdRef.current !== currentRunId) return;
          if (idx + 1 >= steps.length) {
            finishAll();
            return;
          }
          pauseTimerRef.current = window.setTimeout(() => {
            pauseTimerRef.current = null;
            playIndex(idx + 1);
          }, 380);
        };

        if (step.kind === 'audio') {
          activeEngineRef.current = 'audio';
          setActiveEngine('audio');
          setActiveSegmentId(step.id);

          const audio = new Audio(step.url);
          audio.playbackRate = AUDIO_RATES[speedRef.current];
          audioRef.current = audio;

          audio.onended = () => {
            if (runIdRef.current === currentRunId) {
              audioRef.current = null;
              advanceWithPause();
            }
          };

          audio.onerror = () => {
            if (runIdRef.current === currentRunId) {
              audioRef.current = null;
              speakTtsStep(step.id, step.fallbackText, advanceWithPause);
            }
          };

          audio.play().catch(() => {
            if (runIdRef.current === currentRunId) {
              audioRef.current = null;
              speakTtsStep(step.id, step.fallbackText, advanceWithPause);
            }
          });
        } else {
          speakTtsStep(step.id, step.text, advanceWithPause);
        }
      };

      playIndex(0);
    },
    [ttsSupported, voices, selectedVoiceURI, clearPauseTimer, stopAudioEl]
  );

  const playZoneIntro = useCallback(
    (zone: PhysicsZone) => {
      const zoneText = `Welcome to ${zone.name}! ${zone.intro}`;
      const audioRel = manifest.zones[zone.id];
      if (audioRel) {
        runQueue([
          { kind: 'audio', id: 'zone-intro', url: `./${audioRel}`, fallbackText: zoneText },
        ]);
      } else {
        runQueue([{ kind: 'tts', id: 'zone-intro', text: zoneText }]);
      }
    },
    [manifest, runQueue]
  );

  const buildWonderSteps = useCallback(
    (wonder: PhysicsWonder, onStepStart?: () => void): QueueStep[] => {
      const wonderAudio = manifest.wonders[wonder.id];
      if (wonderAudio) {
        return [
          {
            kind: 'audio',
            id: 'wonder-story',
            url: `./${wonderAudio}`,
            fallbackText: buildWonderFallbackText(wonder),
            onStepStart,
          },
        ];
      }

      const steps: QueueStep[] = [
        {
          kind: 'tts',
          id: 'wonder-cause',
          text: `${wonder.name}! ${wonder.causeEffect}`,
          onStepStart,
        },
        {
          kind: 'tts',
          id: 'wonder-animal',
          text: `Animal Physics Pro: ${wonder.animalPro.animal}! ${wonder.animalPro.story}`,
        },
        {
          kind: 'tts',
          id: 'wonder-home',
          text: `Try this at home! ${wonder.tryAtHome}`,
        },
      ];
      wonder.facts.forEach((fact, idx) => {
        steps.push({
          kind: 'tts',
          id: `fact-${idx}`,
          text: `Physics fact number ${idx + 1}: ${fact}`,
        });
      });
      return steps;
    },
    [manifest]
  );

  const playNarration = useCallback(
    (zone: PhysicsZone, wonder: PhysicsWonder, includeZoneIntro: boolean) => {
      const steps: QueueStep[] = [];

      if (includeZoneIntro) {
        const zoneText = `Welcome to ${zone.name}! ${zone.intro}`;
        const zoneAudio = manifest.zones[zone.id];
        if (zoneAudio) {
          steps.push({
            kind: 'audio',
            id: 'zone-intro',
            url: `./${zoneAudio}`,
            fallbackText: zoneText,
          });
        } else {
          steps.push({ kind: 'tts', id: 'zone-intro', text: zoneText });
        }
      }

      steps.push(...buildWonderSteps(wonder));
      runQueue(steps);
    },
    [manifest, buildWonderSteps, runQueue]
  );

  const playZoneTour = useCallback(
    (zone: PhysicsZone, onWonderChange: (wonderIdx: number) => void) => {
      const steps: QueueStep[] = [];
      const zoneText = `Welcome to ${zone.name}! ${zone.intro}`;
      const zoneAudio = manifest.zones[zone.id];
      if (zoneAudio) {
        steps.push({
          kind: 'audio',
          id: 'zone-intro',
          url: `./${zoneAudio}`,
          fallbackText: zoneText,
        });
      } else {
        steps.push({ kind: 'tts', id: 'zone-intro', text: zoneText });
      }

      zone.wonders.forEach((wonder, idx) => {
        steps.push(...buildWonderSteps(wonder, () => onWonderChange(idx)));
      });

      runQueue(steps);
    },
    [manifest, buildWonderSteps, runQueue]
  );

  const speakText = useCallback(
    (text: string, segmentId = 'single') => {
      runQueue([{ kind: 'tts', id: segmentId, text }]);
    },
    [runQueue]
  );

  useEffect(() => {
    return () => {
      clearPauseTimer();
      stopAudioEl();
      if (ttsSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [ttsSupported, clearPauseTimer, stopAudioEl]);

  return {
    supported,
    hasStudioVoice,
    hasWonderStudioVoice,
    activeEngine,
    speedPreset,
    setSpeedPreset,
    isSpeaking,
    isPaused,
    activeSegmentId,
    playZoneIntro,
    playNarration,
    playZoneTour,
    speakText,
    pause,
    resume,
    stop,
  };
}
