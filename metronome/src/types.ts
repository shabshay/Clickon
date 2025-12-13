export type TimeSignatureId = '4/4' | '3/4' | '6/8';

export interface Preset {
  id: string;
  name: string;
  bpm: number;
  timeSignature: TimeSignatureId;
  soundSet: SoundSetId;
  accentSoundSet: SoundSetId;
  accentVolume: number;
  subdivision: Subdivision;
  swing?: number;
  notes?: string;
}

export interface Song {
  id: string;
  title: string;
  artist?: string;
  bpm: number;
  timeSignature: TimeSignatureId;
  presetId?: string;
  notes?: string;
}

export interface Setlist {
  id: string;
  name: string;
  songOrder: string[];
}

export interface StoredState {
  version: number;
  presets: Preset[];
  songs: Song[];
  setlists: Setlist[];
}

export type SoundSetId = 'beep' | 'wood' | 'snare';
export type Subdivision = 'quarter' | 'eighth' | 'triplet';

export interface MetronomeSettings {
  bpm: number;
  timeSignature: TimeSignatureId;
  subdivision: Subdivision;
  soundSet: SoundSetId;
  accentSoundSet: SoundSetId;
  accentVolume: number;
  swing?: number;
}
