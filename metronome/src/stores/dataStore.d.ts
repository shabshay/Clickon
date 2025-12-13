import type { Preset, Setlist, Song, TimeSignatureId } from '../types';
export declare const STORAGE_KEY = "clickon-metronome-data";
export declare const STORAGE_VERSION = 1;
export declare const useDataStore: import("pinia").StoreDefinition<"data", Pick<{
    presets: import("vue").Ref<{
        id: string;
        name: string;
        bpm: number;
        timeSignature: TimeSignatureId;
        soundSet: import("../types").SoundSetId;
        accentSoundSet: import("../types").SoundSetId;
        accentVolume: number;
        subdivision: import("../types").Subdivision;
        swing?: number | undefined;
        notes?: string | undefined;
    }[], Preset[] | {
        id: string;
        name: string;
        bpm: number;
        timeSignature: TimeSignatureId;
        soundSet: import("../types").SoundSetId;
        accentSoundSet: import("../types").SoundSetId;
        accentVolume: number;
        subdivision: import("../types").Subdivision;
        swing?: number | undefined;
        notes?: string | undefined;
    }[]>;
    songs: import("vue").Ref<{
        id: string;
        title: string;
        artist?: string | undefined;
        bpm: number;
        timeSignature: TimeSignatureId;
        presetId?: string | undefined;
        notes?: string | undefined;
    }[], Song[] | {
        id: string;
        title: string;
        artist?: string | undefined;
        bpm: number;
        timeSignature: TimeSignatureId;
        presetId?: string | undefined;
        notes?: string | undefined;
    }[]>;
    setlists: import("vue").Ref<{
        id: string;
        name: string;
        songOrder: string[];
    }[], Setlist[] | {
        id: string;
        name: string;
        songOrder: string[];
    }[]>;
    presetMap: import("vue").ComputedRef<{
        [k: string]: {
            id: string;
            name: string;
            bpm: number;
            timeSignature: TimeSignatureId;
            soundSet: import("../types").SoundSetId;
            accentSoundSet: import("../types").SoundSetId;
            accentVolume: number;
            subdivision: import("../types").Subdivision;
            swing?: number | undefined;
            notes?: string | undefined;
        };
    }>;
    songMap: import("vue").ComputedRef<{
        [k: string]: {
            id: string;
            title: string;
            artist?: string | undefined;
            bpm: number;
            timeSignature: TimeSignatureId;
            presetId?: string | undefined;
            notes?: string | undefined;
        };
    }>;
    load: () => void;
    upsertPreset: (preset: Partial<Preset> & {
        name: string;
        bpm: number;
        timeSignature: TimeSignatureId;
    }) => Preset;
    duplicatePreset: (id: string) => {
        id: `${string}-${string}-${string}-${string}-${string}`;
        name: string;
        bpm: number;
        timeSignature: TimeSignatureId;
        soundSet: import("../types").SoundSetId;
        accentSoundSet: import("../types").SoundSetId;
        accentVolume: number;
        subdivision: import("../types").Subdivision;
        swing?: number | undefined;
        notes?: string | undefined;
    } | null;
    deletePreset: (id: string) => void;
    upsertSong: (song: Partial<Song> & {
        title: string;
        bpm: number;
        timeSignature: TimeSignatureId;
    }) => Song;
    deleteSong: (id: string) => void;
    upsertSetlist: (list: Partial<Setlist> & {
        name: string;
    }) => Setlist;
    deleteSetlist: (id: string) => void;
    addSongToSetlist: (setlistId: string, songId: string) => void;
    reorderSetlist: (setlistId: string, from: number, to: number) => void;
    exportData: () => string;
    importData: (json: string) => void;
}, "songs" | "setlists" | "presets">, Pick<{
    presets: import("vue").Ref<{
        id: string;
        name: string;
        bpm: number;
        timeSignature: TimeSignatureId;
        soundSet: import("../types").SoundSetId;
        accentSoundSet: import("../types").SoundSetId;
        accentVolume: number;
        subdivision: import("../types").Subdivision;
        swing?: number | undefined;
        notes?: string | undefined;
    }[], Preset[] | {
        id: string;
        name: string;
        bpm: number;
        timeSignature: TimeSignatureId;
        soundSet: import("../types").SoundSetId;
        accentSoundSet: import("../types").SoundSetId;
        accentVolume: number;
        subdivision: import("../types").Subdivision;
        swing?: number | undefined;
        notes?: string | undefined;
    }[]>;
    songs: import("vue").Ref<{
        id: string;
        title: string;
        artist?: string | undefined;
        bpm: number;
        timeSignature: TimeSignatureId;
        presetId?: string | undefined;
        notes?: string | undefined;
    }[], Song[] | {
        id: string;
        title: string;
        artist?: string | undefined;
        bpm: number;
        timeSignature: TimeSignatureId;
        presetId?: string | undefined;
        notes?: string | undefined;
    }[]>;
    setlists: import("vue").Ref<{
        id: string;
        name: string;
        songOrder: string[];
    }[], Setlist[] | {
        id: string;
        name: string;
        songOrder: string[];
    }[]>;
    presetMap: import("vue").ComputedRef<{
        [k: string]: {
            id: string;
            name: string;
            bpm: number;
            timeSignature: TimeSignatureId;
            soundSet: import("../types").SoundSetId;
            accentSoundSet: import("../types").SoundSetId;
            accentVolume: number;
            subdivision: import("../types").Subdivision;
            swing?: number | undefined;
            notes?: string | undefined;
        };
    }>;
    songMap: import("vue").ComputedRef<{
        [k: string]: {
            id: string;
            title: string;
            artist?: string | undefined;
            bpm: number;
            timeSignature: TimeSignatureId;
            presetId?: string | undefined;
            notes?: string | undefined;
        };
    }>;
    load: () => void;
    upsertPreset: (preset: Partial<Preset> & {
        name: string;
        bpm: number;
        timeSignature: TimeSignatureId;
    }) => Preset;
    duplicatePreset: (id: string) => {
        id: `${string}-${string}-${string}-${string}-${string}`;
        name: string;
        bpm: number;
        timeSignature: TimeSignatureId;
        soundSet: import("../types").SoundSetId;
        accentSoundSet: import("../types").SoundSetId;
        accentVolume: number;
        subdivision: import("../types").Subdivision;
        swing?: number | undefined;
        notes?: string | undefined;
    } | null;
    deletePreset: (id: string) => void;
    upsertSong: (song: Partial<Song> & {
        title: string;
        bpm: number;
        timeSignature: TimeSignatureId;
    }) => Song;
    deleteSong: (id: string) => void;
    upsertSetlist: (list: Partial<Setlist> & {
        name: string;
    }) => Setlist;
    deleteSetlist: (id: string) => void;
    addSongToSetlist: (setlistId: string, songId: string) => void;
    reorderSetlist: (setlistId: string, from: number, to: number) => void;
    exportData: () => string;
    importData: (json: string) => void;
}, "presetMap" | "songMap">, Pick<{
    presets: import("vue").Ref<{
        id: string;
        name: string;
        bpm: number;
        timeSignature: TimeSignatureId;
        soundSet: import("../types").SoundSetId;
        accentSoundSet: import("../types").SoundSetId;
        accentVolume: number;
        subdivision: import("../types").Subdivision;
        swing?: number | undefined;
        notes?: string | undefined;
    }[], Preset[] | {
        id: string;
        name: string;
        bpm: number;
        timeSignature: TimeSignatureId;
        soundSet: import("../types").SoundSetId;
        accentSoundSet: import("../types").SoundSetId;
        accentVolume: number;
        subdivision: import("../types").Subdivision;
        swing?: number | undefined;
        notes?: string | undefined;
    }[]>;
    songs: import("vue").Ref<{
        id: string;
        title: string;
        artist?: string | undefined;
        bpm: number;
        timeSignature: TimeSignatureId;
        presetId?: string | undefined;
        notes?: string | undefined;
    }[], Song[] | {
        id: string;
        title: string;
        artist?: string | undefined;
        bpm: number;
        timeSignature: TimeSignatureId;
        presetId?: string | undefined;
        notes?: string | undefined;
    }[]>;
    setlists: import("vue").Ref<{
        id: string;
        name: string;
        songOrder: string[];
    }[], Setlist[] | {
        id: string;
        name: string;
        songOrder: string[];
    }[]>;
    presetMap: import("vue").ComputedRef<{
        [k: string]: {
            id: string;
            name: string;
            bpm: number;
            timeSignature: TimeSignatureId;
            soundSet: import("../types").SoundSetId;
            accentSoundSet: import("../types").SoundSetId;
            accentVolume: number;
            subdivision: import("../types").Subdivision;
            swing?: number | undefined;
            notes?: string | undefined;
        };
    }>;
    songMap: import("vue").ComputedRef<{
        [k: string]: {
            id: string;
            title: string;
            artist?: string | undefined;
            bpm: number;
            timeSignature: TimeSignatureId;
            presetId?: string | undefined;
            notes?: string | undefined;
        };
    }>;
    load: () => void;
    upsertPreset: (preset: Partial<Preset> & {
        name: string;
        bpm: number;
        timeSignature: TimeSignatureId;
    }) => Preset;
    duplicatePreset: (id: string) => {
        id: `${string}-${string}-${string}-${string}-${string}`;
        name: string;
        bpm: number;
        timeSignature: TimeSignatureId;
        soundSet: import("../types").SoundSetId;
        accentSoundSet: import("../types").SoundSetId;
        accentVolume: number;
        subdivision: import("../types").Subdivision;
        swing?: number | undefined;
        notes?: string | undefined;
    } | null;
    deletePreset: (id: string) => void;
    upsertSong: (song: Partial<Song> & {
        title: string;
        bpm: number;
        timeSignature: TimeSignatureId;
    }) => Song;
    deleteSong: (id: string) => void;
    upsertSetlist: (list: Partial<Setlist> & {
        name: string;
    }) => Setlist;
    deleteSetlist: (id: string) => void;
    addSongToSetlist: (setlistId: string, songId: string) => void;
    reorderSetlist: (setlistId: string, from: number, to: number) => void;
    exportData: () => string;
    importData: (json: string) => void;
}, "load" | "upsertPreset" | "duplicatePreset" | "deletePreset" | "upsertSong" | "deleteSong" | "upsertSetlist" | "deleteSetlist" | "addSongToSetlist" | "reorderSetlist" | "exportData" | "importData">>;
