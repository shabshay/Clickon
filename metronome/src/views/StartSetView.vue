<template>
<section class="panel start-set" v-if="setlist && orderedSongs.length">
  <aside class="warning" v-if="missingSongs.length">
    <div>
      <p>Some songs in this setlist are missing from your library.</p>
      <ul>
        <li v-for="missing in missingSongs" :key="missing.id">
          Position {{ missing.position + 1 }} — {{ missing.title }} (ID: {{ missing.id }})
        </li>
      </ul>
    </div>
    <button class="ghost" @click="cleanMissingSongs">Remove missing songs</button>
  </aside>
  <header>
    <button @click="goBack">← Back</button>
    <div>
      <h1>{{ setlist.name }}</h1>
      <p>{{ currentIndex + 1 }} / {{ orderedSongs.length }}</p>
    </div>
  </header>
    <article class="current" v-if="currentSong">
      <h2>{{ currentSong.title }}</h2>
      <p class="artist">{{ currentSong.artist || 'Unknown artist' }}</p>
      <p class="stats">{{ currentSong.bpm }} BPM · {{ currentSong.timeSignature }}</p>
      <p class="notes" v-if="currentSong.notes">{{ currentSong.notes }}</p>
      <div class="controls">
        <button @click="prevSong" :disabled="currentIndex === 0">Prev</button>
        <button class="play" @click="startSong">Start</button>
        <button @click="goNextSong" :disabled="currentIndex === orderedSongs.length - 1">Next</button>
      </div>
      <div class="metronome-actions">
        <button @click="pauseMetronome">Pause</button>
        <button @click="stopMetronome">Stop</button>
      </div>
    </article>
    <section class="next" v-if="upNextSong">
      <h3>Next</h3>
      <p>{{ upNextSong.title }} · {{ upNextSong.bpm }} BPM</p>
    </section>
  </section>
  <section class="panel" v-else>
    <p>This setlist has no songs yet.</p>
    <button @click="goBack">Return</button>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDataStore } from '../stores/dataStore';
import { useMetronomeService } from '../services/metronomeService';
import type { Song } from '../types';
import { getMissingSetlistEntries, removeMissingFromSetlist } from '../utils/setlistHelpers';

const route = useRoute();
const router = useRouter();
const dataStore = useDataStore();
dataStore.load();
const { start, pause, stop } = useMetronomeService();

const setlistId = computed(() => route.params.setlistId as string);
const currentIndex = ref(0);

const setlist = computed(() => dataStore.setlists.find((list) => list.id === setlistId.value));
const orderedSongs = computed(() =>
  setlist.value ? setlist.value.songOrder.map((id) => dataStore.songs.find((song) => song.id === id)).filter(Boolean) as Song[] : []
);

const missingSongs = computed(() => getMissingSetlistEntries(setlist.value, dataStore.songMap));

watch(
  () => setlist.value,
  () => {
    currentIndex.value = 0;
  }
);

watch(
  () => orderedSongs.value.length,
  (len) => {
    if (len === 0) {
      currentIndex.value = 0;
    } else if (currentIndex.value >= len) {
      currentIndex.value = len - 1;
    }
  }
);

const currentSong = computed(() => orderedSongs.value[currentIndex.value]);
const upNextSong = computed(() => orderedSongs.value[currentIndex.value + 1]);

const startSong = async () => {
  if (!currentSong.value) return;
  const preset = currentSong.value.presetId
    ? dataStore.presets.find((p) => p.id === currentSong.value?.presetId)
    : null;
  const settings = {
    bpm: currentSong.value.bpm,
    timeSignature: currentSong.value.timeSignature,
    subdivision: preset?.subdivision ?? 'quarter',
    soundSet: preset?.soundSet ?? 'wood',
    accentSoundSet: preset?.accentSoundSet ?? 'snare',
    accentVolume: preset?.accentVolume ?? 1.2,
    swing: preset?.swing ?? 0
  };
  await start(settings as any);
};

const prevSong = () => {
  if (currentIndex.value === 0) return;
  currentIndex.value -= 1;
};

const goNextSong = () => {
  if (currentIndex.value >= orderedSongs.value.length - 1) return;
  currentIndex.value += 1;
};

const cleanMissingSongs = () => {
  if (!setlist.value || !missingSongs.value.length) return;
  const cleanedOrder = removeMissingFromSetlist(setlist.value, dataStore.songMap);
  dataStore.upsertSetlist({ ...setlist.value, songOrder: cleanedOrder });

  if (currentIndex.value >= cleanedOrder.length) {
    currentIndex.value = Math.max(cleanedOrder.length - 1, 0);
  }
};

const pauseMetronome = () => {
  pause();
};

const stopMetronome = () => {
  stop();
};

const goBack = () => {
  router.push({ name: 'setlists' });
};
</script>

<style scoped>
.start-set {
  max-width: 640px;
  margin: 0 auto;
  gap: 1rem;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.current {
  margin-top: 1rem;
}

.artist {
  color: var(--muted);
}

.stats {
  font-size: 1.2rem;
}

.notes {
  background: rgba(255, 255, 255, 0.05);
  padding: 0.75rem;
  border-radius: 0.75rem;
}

.controls {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.controls .play {
  flex: 1;
  background: var(--accent);
  color: #111;
  border: none;
}

.metronome-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.next {
  margin-top: 1rem;
  color: var(--muted);
}

.warning {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid var(--accent);
  border-radius: 0.75rem;
  background: rgba(255, 200, 0, 0.1);
}

.warning ul {
  margin: 0.25rem 0 0;
  padding-left: 1.25rem;
}

.warning .ghost {
  align-self: center;
  border: 1px solid var(--accent);
  background: transparent;
  color: inherit;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
}
</style>
