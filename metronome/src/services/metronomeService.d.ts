import type { MetronomeSettings } from '../types';
export declare const useMetronomeService: () => {
    start: (settings: MetronomeSettings) => Promise<void>;
    pause: () => void;
    stop: () => void;
    isRunning: import("vue").Ref<boolean, boolean>;
    currentStep: import("vue").Ref<number, number>;
    lastAccent: import("vue").Ref<boolean, boolean>;
    beats: import("vue").ComputedRef<{
        beat: number;
        measure: number;
    }>;
    activeSettings: import("vue").Ref<{
        bpm: number;
        timeSignature: import("../types").TimeSignatureId;
        subdivision: import("../types").Subdivision;
        soundSet: import("../types").SoundSetId;
        accentSoundSet: import("../types").SoundSetId;
        accentVolume: number;
        swing?: number | undefined;
    } | null, MetronomeSettings | {
        bpm: number;
        timeSignature: import("../types").TimeSignatureId;
        subdivision: import("../types").Subdivision;
        soundSet: import("../types").SoundSetId;
        accentSoundSet: import("../types").SoundSetId;
        accentVolume: number;
        swing?: number | undefined;
    } | null>;
    audioState: import("vue").Ref<"error" | AudioContextState | "uninitialized", "error" | AudioContextState | "uninitialized">;
};
