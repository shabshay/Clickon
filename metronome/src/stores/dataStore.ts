import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Preset, Setlist, Song, StoredState, TimeSignatureId } from '../types';

export const STORAGE_KEY = 'clickon-metronome-data';
export const STORAGE_VERSION = 1;

const uid = () => crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 10);

const defaultPreset: Preset = {
  id: uid(),
  name: 'Pocket',
  bpm: 120,
  timeSignature: '4/4',
  soundSet: 'wood',
  accentSoundSet: 'snare',
  accentVolume: 1.2,
  subdivision: 'quarter',
  swing: 0
};

export const useDataStore = defineStore('data', () => {
  const presets = ref<Preset[]>([defaultPreset]);
  const songs = ref<Song[]>([]);
  const setlists = ref<Setlist[]>([]);
  const loaded = ref(false);

  const presetMap = computed(() => Object.fromEntries(presets.value.map((p) => [p.id, p])));
  const songMap = computed(() => Object.fromEntries(songs.value.map((s) => [s.id, s])));

  const load = () => {
    if (loaded.value) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredState;
        const next = parsed.version === STORAGE_VERSION ? parsed : migrate(parsed);
        presets.value = next.presets.length ? next.presets : [defaultPreset];
        songs.value = next.songs;
        setlists.value = next.setlists;
      }
    } catch (error) {
      console.warn('Failed to load data', error);
    } finally {
      loaded.value = true;
    }
  };

  const persist = () => {
    const payload: StoredState = {
      version: STORAGE_VERSION,
      presets: presets.value,
      songs: songs.value,
      setlists: setlists.value
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  };

  const upsertPreset = (preset: Partial<Preset> & { name: string; bpm: number; timeSignature: TimeSignatureId }) => {
    const id = preset.id ?? uid();
    const existingIndex = presets.value.findIndex((p) => p.id === id);
    const nextPreset: Preset = {
      id,
      name: preset.name,
      bpm: preset.bpm,
      timeSignature: preset.timeSignature,
      soundSet: preset.soundSet ?? 'wood',
      accentSoundSet: preset.accentSoundSet ?? preset.soundSet ?? 'snare',
      accentVolume: preset.accentVolume ?? 1.2,
      subdivision: preset.subdivision ?? 'quarter',
      swing: preset.swing ?? 0,
      notes: preset.notes
    };
    if (existingIndex >= 0) {
      presets.value.splice(existingIndex, 1, nextPreset);
    } else {
      presets.value.push(nextPreset);
    }
    persist();
    return nextPreset;
  };

  const duplicatePreset = (id: string) => {
    const preset = presetMap.value[id];
    if (!preset) return null;
    const clone = { ...preset, id: uid(), name: `${preset.name} Copy` };
    presets.value.push(clone);
    persist();
    return clone;
  };

  const deletePreset = (id: string) => {
    presets.value = presets.value.filter((p) => p.id !== id);
    persist();
  };

  const upsertSong = (song: Partial<Song> & { title: string; bpm: number; timeSignature: TimeSignatureId }) => {
    const id = song.id ?? uid();
    const payload: Song = {
      id,
      title: song.title,
      artist: song.artist,
      bpm: song.bpm,
      timeSignature: song.timeSignature,
      presetId: song.presetId,
      notes: song.notes
    };
    const idx = songs.value.findIndex((s) => s.id === id);
    if (idx >= 0) {
      songs.value.splice(idx, 1, payload);
    } else {
      songs.value.push(payload);
    }
    persist();
    return payload;
  };

  const deleteSong = (id: string) => {
    songs.value = songs.value.filter((s) => s.id !== id);
    setlists.value = setlists.value.map((list) => ({
      ...list,
      songOrder: list.songOrder.filter((songId) => songId !== id)
    }));
    persist();
  };

  const upsertSetlist = (list: Partial<Setlist> & { name: string }) => {
    const id = list.id ?? uid();
    const payload: Setlist = {
      id,
      name: list.name,
      songOrder: list.songOrder ?? []
    };
    const idx = setlists.value.findIndex((s) => s.id === id);
    if (idx >= 0) {
      setlists.value.splice(idx, 1, payload);
    } else {
      setlists.value.push(payload);
    }
    persist();
    return payload;
  };

  const addSongToSetlist = (setlistId: string, songId: string) => {
    const list = setlists.value.find((s) => s.id === setlistId);
    if (!list) return;
    list.songOrder.push(songId);
    persist();
  };

  const reorderSetlist = (setlistId: string, from: number, to: number) => {
    const list = setlists.value.find((s) => s.id === setlistId);
    if (!list) return;
    const [item] = list.songOrder.splice(from, 1);
    list.songOrder.splice(to, 0, item);
    persist();
  };

  const deleteSetlist = (id: string) => {
    setlists.value = setlists.value.filter((s) => s.id !== id);
    persist();
  };

  const exportData = () => {
    const payload: StoredState = {
      version: STORAGE_VERSION,
      presets: presets.value,
      songs: songs.value,
      setlists: setlists.value
    };
    return JSON.stringify(payload, null, 2);
  };

  const importData = (json: string) => {
    const payload = JSON.parse(json) as StoredState;
    if (!payload.version) throw new Error('Invalid backup file.');
    const next = payload.version === STORAGE_VERSION ? payload : migrate(payload);
    presets.value = next.presets.length ? next.presets : [defaultPreset];
    songs.value = next.songs;
    setlists.value = next.setlists;
    persist();
  };

  return {
    presets,
    songs,
    setlists,
    presetMap,
    songMap,
    load,
    upsertPreset,
    duplicatePreset,
    deletePreset,
    upsertSong,
    deleteSong,
    upsertSetlist,
    deleteSetlist,
    addSongToSetlist,
    reorderSetlist,
    exportData,
    importData
  };
});

const migrate = (payload: StoredState): StoredState => {
  // Placeholder for future migrations.
  payload.version = STORAGE_VERSION;
  return payload;
};
