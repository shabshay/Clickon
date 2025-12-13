<template>
  <section class="grid-two songs">
    <div class="panel">
      <header class="panel-header">
        <h2>Songs</h2>
        <input type="search" v-model="search" placeholder="Search songs" />
      </header>
      <div class="song-list">
        <article v-for="song in filteredSongs" :key="song.id" class="song-row">
          <div>
            <strong>{{ song.title }}</strong>
            <small>
              {{ song.artist || 'Unknown' }} · {{ song.bpm }} BPM · {{ song.timeSignature }}
              <span v-if="song.presetId"> · Preset: {{ presetMap[song.presetId]?.name }}</span>
            </small>
            <p v-if="song.notes">{{ song.notes }}</p>
          </div>
          <div class="actions">
            <button @click="useSongSettings(song)">Use</button>
            <button @click="editSong(song)">Edit</button>
            <button @click="removeSong(song.id)">Delete</button>
          </div>
        </article>
      </div>
    </div>
    <div class="panel">
      <h2>{{ songForm.id ? 'Edit Song' : 'Add Song' }}</h2>
      <form @submit.prevent="submitSong">
        <label>
          Title
          <input v-model="songForm.title" required />
        </label>
        <label>
          Artist
          <input v-model="songForm.artist" />
        </label>
        <div class="grid-two">
          <label>
            BPM
            <input type="number" min="30" max="280" v-model.number="songForm.bpm" required />
          </label>
          <label>
            Time Signature
            <select v-model="songForm.timeSignature">
              <option v-for="sig in timeSignatures" :key="sig.id" :value="sig.id">{{ sig.label }}</option>
            </select>
          </label>
        </div>
        <label>
          Preset (optional)
          <select v-model="songForm.presetId">
            <option value="">None</option>
            <option v-for="preset in dataStore.presets" :key="preset.id" :value="preset.id">{{ preset.name }}</option>
          </select>
        </label>
        <label>
          Notes
          <textarea rows="3" v-model="songForm.notes"></textarea>
        </label>
        <div class="form-actions">
          <button type="submit">{{ songForm.id ? 'Update' : 'Create' }}</button>
          <button type="button" v-if="songForm.id" @click="resetSongForm">Cancel</button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useDataStore } from '../stores/dataStore';
import { TIME_SIGNATURES } from '../constants/timeSignatures';
import type { Preset, Song } from '../types';
import { useMetronomeService } from '../services/metronomeService';

const dataStore = useDataStore();
dataStore.load();
const { start } = useMetronomeService();

const timeSignatures = TIME_SIGNATURES;
const search = ref('');
const songForm = reactive({
  id: '',
  title: '',
  artist: '',
  bpm: 120,
  timeSignature: '4/4',
  presetId: '',
  notes: ''
});

const presetMap = computed<Partial<Record<string, Preset>>>(() =>
  dataStore.presets.reduce((map, preset) => {
    map[preset.id] = preset;
    return map;
  }, {} as Record<string, Preset>)
);

const filteredSongs = computed(() => {
  const term = search.value.toLowerCase().trim();
  if (!term) return dataStore.songs;
  return dataStore.songs.filter((song) =>
    [song.title, song.artist, song.notes].some((field) => field?.toLowerCase().includes(term))
  );
});

const submitSong = () => {
  dataStore.upsertSong({
    id: songForm.id || undefined,
    title: songForm.title,
    artist: songForm.artist,
    bpm: songForm.bpm,
    timeSignature: songForm.timeSignature as Song['timeSignature'],
    presetId: songForm.presetId || undefined,
    notes: songForm.notes
  });
  resetSongForm();
};

const editSong = (song: Song) => {
  songForm.id = song.id;
  songForm.title = song.title;
  songForm.artist = song.artist ?? '';
  songForm.bpm = song.bpm;
  songForm.timeSignature = song.timeSignature;
  songForm.presetId = song.presetId ?? '';
  songForm.notes = song.notes ?? '';
};

const removeSong = (id: string) => {
  if (confirm('Delete song?')) {
    dataStore.deleteSong(id);
  }
};

const resetSongForm = () => {
  songForm.id = '';
  songForm.title = '';
  songForm.artist = '';
  songForm.bpm = 120;
  songForm.timeSignature = '4/4';
  songForm.presetId = '';
  songForm.notes = '';
};

const useSongSettings = async (song: Song) => {
  const preset = song.presetId ? dataStore.presets.find((p) => p.id === song.presetId) : null;
  const settings = {
    bpm: song.bpm,
    timeSignature: song.timeSignature,
    subdivision: preset?.subdivision ?? 'quarter',
    soundSet: preset?.soundSet ?? 'wood',
    accentSoundSet: preset?.accentSoundSet ?? 'snare',
    accentVolume: preset?.accentVolume ?? 1.2,
    swing: preset?.swing ?? 0
  };
  await start(settings as any);
};
</script>

<style scoped>
.songs {
  gap: 1.5rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.song-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.song-row {
  border: 1px solid var(--border);
  padding: 0.75rem;
  border-radius: 1rem;
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
}

.song-row small {
  color: var(--muted);
  display: block;
}

.song-row p {
  margin: 0.25rem 0 0;
  color: var(--muted);
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

@media (max-width: 768px) {
  .song-row {
    flex-direction: column;
  }

  .actions {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
