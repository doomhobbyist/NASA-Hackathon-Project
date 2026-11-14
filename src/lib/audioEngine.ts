export type SpeakerKind = 'narrator' | 'toon' | 'machine' | 'chapter';

export interface SpeechState {
  isSpeaking: boolean;
  isLoading: boolean;
  speakerLabel: string;
  captionText: string;
  speakerKind: SpeakerKind | null;
}

export interface SpeakOptions {
  text: string;
  speakerLabel: string;
  speakerKind: SpeakerKind;
  voiceName?: 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr';
  style?: string;
}

type Listener = (state: SpeechState) => void;
type MusicListener = (playing: boolean) => void;

class SilentMachinesAudioEngine {
  private audioCtx: AudioContext | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private abortController: AbortController | null = null;
  private clientWavCache = new Map<string, string>();
  private listeners = new Set<Listener>();
  private musicListeners = new Set<MusicListener>();

  // Ambient pad nodes
  private ambientActive = false;
  private ambientGain: GainNode | null = null;
  private ambientInterval: number | null = null;
  private ambientNodes: AudioNode[] = [];

  // Rover driving hum nodes
  private roverInterval: number | null = null;

  private muted = false;

  private state: SpeechState = {
    isSpeaking: false,
    isLoading: false,
    speakerLabel: '',
    captionText: '',
    speakerKind: null,
  };

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return null;
      this.audioCtx = new Ctx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  subscribeMusic(listener: MusicListener): () => void {
    this.musicListeners.add(listener);
    listener(this.ambientActive);
    return () => {
      this.musicListeners.delete(listener);
    };
  }

  private setState(partial: Partial<SpeechState>) {
    this.state = { ...this.state, ...partial };
    this.updateAmbientDucking();
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  getMuted(): boolean {
    return this.muted;
  }

  setMuted(value: boolean) {
    this.muted = value;
    if (value) {
      this.stopSpeech();
      this.stopAmbientMusic();
      this.stopRoverDriveSound();
    }
  }

  isAmbientPlaying(): boolean {
    return this.ambientActive;
  }

  toggleAmbientMusic() {
    if (this.ambientActive) {
      this.stopAmbientMusic();
    } else {
      this.startAmbientMusic();
    }
  }

  startAmbientMusic() {
    if (this.muted || this.ambientActive) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    this.ambientActive = true;
    for (const l of this.musicListeners) l(true);

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(
      this.state.isSpeaking ? 0.045 : 0.11,
      ctx.currentTime + 2.2
    );

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(780, ctx.currentTime);

    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    this.ambientGain = masterGain;

    // Gentle D Lydian cosmic chord progression
    const chords = [
      [146.83, 220.0, 277.18, 369.99], // Dmaj7
      [164.81, 246.94, 329.63, 415.3], // Emaj / E6
      [123.47, 185.0, 293.66, 369.99], // Bm7
      [110.0, 164.81, 277.18, 329.63], // Aadd9
    ];

    let chordIndex = 0;

    const triggerChord = () => {
      if (!this.ambientActive || !this.audioCtx || !this.ambientGain) return;
      const now = this.audioCtx.currentTime;
      const freqs = chords[chordIndex % chords.length];
      chordIndex += 1;

      freqs.forEach((freq, idx) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const noteGain = this.audioCtx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        noteGain.gain.setValueAtTime(0.0001, now);
        noteGain.gain.linearRampToValueAtTime(0.22 / freqs.length, now + 1.8);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 6.4);

        osc.connect(noteGain);
        noteGain.connect(filter);

        osc.start(now);
        osc.stop(now + 6.6);
        this.ambientNodes.push(osc, noteGain);
      });
    };

    triggerChord();
    this.ambientInterval = window.setInterval(triggerChord, 5600);
  }

  stopAmbientMusic() {
    this.ambientActive = false;
    for (const l of this.musicListeners) l(false);

    if (this.ambientInterval !== null) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }

    if (this.ambientGain && this.audioCtx) {
      try {
        const now = this.audioCtx.currentTime;
        this.ambientGain.gain.cancelScheduledValues(now);
        this.ambientGain.gain.setValueAtTime(Math.max(this.ambientGain.gain.value, 0.001), now);
        this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      } catch {
        // Ignore cleanup race
      }
    }

    const oldNodes = this.ambientNodes;
    this.ambientNodes = [];
    setTimeout(() => {
      for (const n of oldNodes) {
        try {
          n.disconnect();
        } catch {
          // Ignore
        }
      }
    }, 700);
  }

  private updateAmbientDucking() {
    if (!this.ambientActive || !this.ambientGain || !this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const target = this.state.isSpeaking ? 0.045 : 0.11;
    this.ambientGain.gain.cancelScheduledValues(now);
    this.ambientGain.gain.setTargetAtTime(target, now, 0.35);
  }

  playMelody(notes: { freq: number; duration: number; delay: number }[]) {
    if (this.muted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    notes.forEach(({ freq, duration, delay }) => {
      const osc = ctx.createOscillator();
      const sub = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      sub.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);
      sub.frequency.setValueAtTime(freq * 2, now + delay);

      gain.gain.setValueAtTime(0.0001, now + delay);
      gain.gain.linearRampToValueAtTime(0.11, now + delay + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration);

      osc.connect(gain);
      sub.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      sub.start(now + delay);
      osc.stop(now + delay + duration + 0.05);
      sub.stop(now + delay + duration + 0.05);
    });
  }

  startRoverDriveSound() {
    if (this.muted) return;
    this.stopRoverDriveSound();
    const ctx = this.ensureContext();
    if (!ctx) return;

    let step = 0;
    const playStep = () => {
      if (!this.audioCtx || this.muted) return;
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // Gentle playful servo-wheel chirp
      osc.type = 'sine';
      const baseFreq = 220 + (step % 4) * 35;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.12, now + 0.08);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.032, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
      step += 1;
    };

    playStep();
    this.roverInterval = window.setInterval(playStep, 190);
  }

  stopRoverDriveSound() {
    if (this.roverInterval !== null) {
      clearInterval(this.roverInterval);
      this.roverInterval = null;
    }
  }

  playArrivalChime() {
    this.playMelody([
      { freq: 523.25, duration: 0.16, delay: 0 },
      { freq: 659.25, duration: 0.16, delay: 0.1 },
      { freq: 783.99, duration: 0.25, delay: 0.2 },
      { freq: 1046.5, duration: 0.45, delay: 0.32 },
    ]);
  }

  playQuizChime(correct: boolean) {
    if (correct) {
      this.playMelody([
        { freq: 523.25, duration: 0.15, delay: 0 },
        { freq: 659.25, duration: 0.15, delay: 0.1 },
        { freq: 783.99, duration: 0.35, delay: 0.2 },
      ]);
    } else {
      this.playMelody([
        { freq: 349.23, duration: 0.18, delay: 0 },
        { freq: 311.13, duration: 0.32, delay: 0.15 },
      ]);
    }
  }

  stopSpeech() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.src = '';
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.setState({
      isSpeaking: false,
      isLoading: false,
      speakerLabel: '',
      captionText: '',
      speakerKind: null,
    });
  }

  async speak(options: SpeakOptions): Promise<void> {
    const {
      text,
      speakerLabel,
      speakerKind,
      voiceName = 'Zephyr',
      style = '',
    } = options;

    this.stopSpeech();

    if (this.muted) {
      // Even when muted, show the spoken caption briefly so accessibility stays 100% intact
      this.setState({
        isSpeaking: false,
        isLoading: false,
        speakerLabel,
        captionText: text,
        speakerKind,
      });
      return;
    }

    const cacheKey = `${speakerKind}:${voiceName}:${text}`;
    const controller = new AbortController();
    this.abortController = controller;

    this.setState({
      isLoading: true,
      isSpeaking: false,
      speakerLabel,
      captionText: text,
      speakerKind,
    });

    const cachedSrc = this.clientWavCache.get(cacheKey);
    if (cachedSrc) {
      await this.playWavDataUrl(cachedSrc, speakerLabel, text, speakerKind, controller.signal);
      return;
    }

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          persona: speakerKind,
          voiceName,
          style,
        }),
        signal: controller.signal,
      });

      if (controller.signal.aborted) return;

      if (res.ok) {
        const data = await res.json();
        if (data?.audioBase64) {
          const wavUrl = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
          this.clientWavCache.set(cacheKey, wavUrl);
          await this.playWavDataUrl(wavUrl, speakerLabel, text, speakerKind, controller.signal);
          return;
        }
      }
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') return;
    }

    if (controller.signal.aborted) return;
    // Graceful browser natural voice fallback if server TTS isn't configured
    this.speakWithBrowserFallback(text, speakerLabel, speakerKind, controller.signal);
  }

  private playWavDataUrl(
    url: string,
    speakerLabel: string,
    text: string,
    speakerKind: SpeakerKind,
    signal: AbortSignal
  ): Promise<void> {
    return new Promise((resolve) => {
      if (signal.aborted) {
        resolve();
        return;
      }

      const audio = new Audio(url);
      this.currentAudio = audio;

      audio.onplay = () => {
        if (signal.aborted) return;
        this.setState({
          isLoading: false,
          isSpeaking: true,
          speakerLabel,
          captionText: text,
          speakerKind,
        });
      };

      const finish = () => {
        if (this.currentAudio === audio) {
          this.currentAudio = null;
        }
        if (!signal.aborted) {
          this.setState({
            isSpeaking: false,
            isLoading: false,
          });
        }
        resolve();
      };

      audio.onended = finish;
      audio.onerror = () => {
        finish();
        if (!signal.aborted) {
          this.speakWithBrowserFallback(text, speakerLabel, speakerKind, signal);
        }
      };

      audio.play().catch(() => {
        // If autoplay blocked, fallback cleanly
        finish();
      });
    });
  }

  private speakWithBrowserFallback(
    text: string,
    speakerLabel: string,
    speakerKind: SpeakerKind,
    signal: AbortSignal
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || signal.aborted) {
      this.setState({ isLoading: false, isSpeaking: false });
      return;
    }

    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    // Prefer warm, natural-sounding voices over robotic defaults
    const preferredOrder = [
      'Google US English',
      'Microsoft Aria',
      'Microsoft Jenny',
      'Samantha',
      'Karen',
      'Daniel',
      'Alex',
      'Natural',
    ];
    let chosen = voices.find((v) =>
      preferredOrder.some((name) => v.name.includes(name) && v.lang.startsWith('en'))
    );
    if (!chosen) {
      chosen = voices.find((v) => v.lang.startsWith('en')) || voices[0];
    }
    if (chosen) {
      utterance.voice = chosen;
    }

    utterance.rate = speakerKind === 'toon' ? 1.02 : 0.96;
    utterance.pitch = speakerKind === 'toon' ? 1.12 : 1.0;

    utterance.onstart = () => {
      if (signal.aborted) return;
      this.setState({
        isLoading: false,
        isSpeaking: true,
        speakerLabel,
        captionText: text,
        speakerKind,
      });
    };

    utterance.onend = () => {
      if (!signal.aborted) {
        this.setState({ isSpeaking: false, isLoading: false });
      }
    };

    utterance.onerror = () => {
      if (!signal.aborted) {
        this.setState({ isSpeaking: false, isLoading: false });
      }
    };

    synth.speak(utterance);
  }
}

export const audioEngine = new SilentMachinesAudioEngine();
