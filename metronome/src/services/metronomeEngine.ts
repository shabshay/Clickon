import type { MetronomeSettings, SoundSetId, Subdivision } from '../types';
import { getSignature } from '../constants/timeSignatures';

type TickSubscriber = (payload: { step: number; isAccent: boolean }) => void;
type StateSubscriber = (payload: { running: boolean }) => void;
type AudioState = AudioContextState | 'error' | 'uninitialized';
type AudioStateSubscriber = (state: AudioState) => void;

export const SUBDIVISION_STEPS: Record<Subdivision, number> = {
  quarter: 1,
  eighth: 2,
  triplet: 3
};

export class MetronomeEngine {
  private audioCtx: AudioContext | null = null;
  private settings: MetronomeSettings | null = null;
  private isRunning = false;
  private stepCounter = 0;
  private nextNoteTime = 0;
  private lookahead = 25; // ms
  private scheduleAheadTime = 0.1; // seconds
  private timerId: number | null = null;
  private tickSubscribers: TickSubscriber[] = [];
  private stateSubscribers: StateSubscriber[] = [];
  private audioStateSubscribers: AudioStateSubscriber[] = [];
  private audioState: AudioState = 'uninitialized';
  private buffers: Partial<Record<'wood' | 'snare', AudioBuffer>> = {};

  subscribeTick(sub: TickSubscriber) {
    this.tickSubscribers.push(sub);
    return () => (this.tickSubscribers = this.tickSubscribers.filter((s) => s !== sub));
  }

  subscribeState(sub: StateSubscriber) {
    this.stateSubscribers.push(sub);
    return () => (this.stateSubscribers = this.stateSubscribers.filter((s) => s !== sub));
  }

  subscribeAudioState(sub: AudioStateSubscriber) {
    this.audioStateSubscribers.push(sub);
    sub(this.audioState);
    return () => (this.audioStateSubscribers = this.audioStateSubscribers.filter((s) => s !== sub));
  }

  async start(settings: MetronomeSettings) {
    await this.ensureAudio();
    if (!this.audioCtx) return;

    if (this.timerId) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }

    this.settings = settings;
    this.stepCounter = 0;
    this.nextNoteTime = this.audioCtx.currentTime + 0.05;
    this.isRunning = true;
    this.timerId = window.setInterval(() => this.scheduler(), this.lookahead);
    this.stateSubscribers.forEach((s) => s({ running: true }));
  }

  pause() {
    if (!this.isRunning) return;
    if (this.timerId) window.clearInterval(this.timerId);
    this.timerId = null;
    this.isRunning = false;
    this.stateSubscribers.forEach((s) => s({ running: false }));
  }

  stop() {
    if (this.timerId) window.clearInterval(this.timerId);
    this.timerId = null;
    this.isRunning = false;
    this.stepCounter = 0;
    this.stateSubscribers.forEach((s) => s({ running: false }));
  }

  private async ensureAudio() {
    try {
      if (!this.audioCtx) {
        this.audioCtx = new AudioContext();
        this.audioCtx.onstatechange = () => this.publishAudioState(this.audioCtx?.state ?? 'uninitialized');
      }

      if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }

      this.publishAudioState(this.audioCtx.state);
    } catch (error) {
      console.error('Failed to initialize audio context', error);
      this.publishAudioState('error');
    }
  }

  private publishAudioState(state: AudioState) {
    this.audioState = state;
    this.audioStateSubscribers.forEach((sub) => sub(state));
  }

  private scheduler() {
    if (!this.audioCtx || !this.settings) return;
    while (this.nextNoteTime < this.audioCtx.currentTime + this.scheduleAheadTime) {
      this.scheduleTick(this.stepCounter, this.nextNoteTime);
      this.advanceStep();
    }
  }

  private scheduleTick(step: number, time: number) {
    const settings = this.settings;
    if (!settings || !this.audioCtx) return;

    const signature = getSignature(settings.timeSignature);
    const stepsPerBeat = SUBDIVISION_STEPS[settings.subdivision];
    const beatInMeasure = Math.floor(step / stepsPerBeat) % signature.beatsPerMeasure;
    const subdivisionIndex = step % stepsPerBeat;
    const isAccent = subdivisionIndex === 0 && beatInMeasure === 0;
    const isPrimaryBeat = subdivisionIndex === 0;
    const gainValue = isAccent ? settings.accentVolume : isPrimaryBeat ? 0.9 : 0.5;

    if (settings.soundSet === 'beep' && settings.accentSoundSet === 'beep') {
      this.triggerBeep(time, isAccent ? 1800 : isPrimaryBeat ? 1400 : 900, gainValue);
    } else {
      const sound = isAccent ? settings.accentSoundSet : settings.soundSet;
      if (sound === 'beep') {
        this.triggerBeep(time, isAccent ? 1800 : isPrimaryBeat ? 1400 : 900, gainValue);
      } else {
        this.triggerBuffer(sound, time, gainValue, isAccent);
      }
    }

    this.tickSubscribers.forEach((sub) => sub({ step, isAccent }));
  }

  private advanceStep() {
    if (!this.settings || !this.audioCtx) return;
    const bpm = this.settings.bpm;
    const subdivision = SUBDIVISION_STEPS[this.settings.subdivision];
    const secondsPerBeat = 60 / bpm;
    let stepDuration = secondsPerBeat / subdivision;

    if (this.settings.subdivision === 'eighth' && this.settings.swing && this.settings.swing > 0) {
      const swingAmount = Math.min(this.settings.swing, 0.45);
      if (this.stepCounter % 2 === 0) {
        stepDuration += stepDuration * swingAmount;
      } else {
        stepDuration -= stepDuration * swingAmount;
      }
    }

    this.nextNoteTime += stepDuration;
    this.stepCounter += 1;
  }

  private triggerBeep(time: number, frequency: number, gainValue: number) {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.frequency.value = frequency;
    osc.type = 'square';
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(gainValue, time + 0.001);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(time);
    osc.stop(time + 0.12);
  }

  private triggerBuffer(type: Exclude<SoundSetId, 'beep'>, time: number, gainValue: number, isAccent: boolean) {
    if (!this.audioCtx) return;
    const buffer = this.buffers[type] ?? this.createBuffer(type);
    if (!buffer) return;
    const source = this.audioCtx.createBufferSource();
    const gain = this.audioCtx.createGain();
    source.buffer = buffer;
    gain.gain.setValueAtTime(gainValue * (isAccent ? 1.05 : 1), time);
    source.connect(gain);
    gain.connect(this.audioCtx.destination);
    source.start(time);
  }

  private createBuffer(type: 'wood' | 'snare'): AudioBuffer | null {
    if (!this.audioCtx) return null;
    const duration = 0.2;
    const sampleRate = this.audioCtx.sampleRate;
    const frameCount = Math.floor(sampleRate * duration);
    const buffer = this.audioCtx.createBuffer(1, frameCount, sampleRate);
    const channel = buffer.getChannelData(0);

    for (let i = 0; i < frameCount; i += 1) {
      const t = i / frameCount;
      const envelope = Math.exp(-15 * t);
      const noise = Math.random() * 2 - 1;
      if (type === 'wood') {
        const tone = Math.sin(2 * Math.PI * 900 * (i / sampleRate));
        channel[i] = (tone * 0.6 + noise * 0.2) * envelope;
      } else {
        const tone = Math.sin(2 * Math.PI * 220 * (i / sampleRate));
        channel[i] = (noise * 0.8 + tone * 0.4) * envelope;
      }
    }

    this.buffers[type] = buffer;
    return buffer;
  }
}

export const metronomeEngine = new MetronomeEngine();
