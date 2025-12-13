import type { MetronomeSettings, Subdivision } from '../types';
type TickSubscriber = (payload: {
    step: number;
    isAccent: boolean;
}) => void;
type StateSubscriber = (payload: {
    running: boolean;
}) => void;
type AudioState = AudioContextState | 'error' | 'uninitialized';
type AudioStateSubscriber = (state: AudioState) => void;
export declare const SUBDIVISION_STEPS: Record<Subdivision, number>;
export declare class MetronomeEngine {
    private audioCtx;
    private settings;
    private isRunning;
    private stepCounter;
    private nextNoteTime;
    private lookahead;
    private scheduleAheadTime;
    private timerId;
    private tickSubscribers;
    private stateSubscribers;
    private audioStateSubscribers;
    private audioState;
    private buffers;
    subscribeTick(sub: TickSubscriber): () => TickSubscriber[];
    subscribeState(sub: StateSubscriber): () => StateSubscriber[];
    subscribeAudioState(sub: AudioStateSubscriber): () => AudioStateSubscriber[];
    start(settings: MetronomeSettings): Promise<void>;
    pause(): void;
    stop(): void;
    private ensureAudio;
    private publishAudioState;
    private scheduler;
    private scheduleTick;
    private advanceStep;
    private triggerBeep;
    private triggerBuffer;
    private createBuffer;
}
export declare const metronomeEngine: MetronomeEngine;
export {};
