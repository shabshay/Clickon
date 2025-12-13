<template>
  <section class="grid-two setlists">
    <div class="panel">
      <header class="panel-header">
        <h2>Setlists</h2>
        <button @click="newSetlist">New</button>
      </header>
      <div class="setlist-list">
        <button
          v-for="list in dataStore.setlists"
          :key="list.id"
          :class="['setlist-button', { active: list.id === selectedSetlistId }]"
          @click="selectedSetlistId = list.id"
        >
          {{ list.name }}
        </button>
      </div>
      <form v-if="creating" @submit.prevent="saveSetlist" class="create-form">
        <label>
          Name
          <input v-model="setlistForm.name" required />
        </label>
        <div class="form-actions">
          <button type="submit">{{ setlistForm.id ? 'Update' : 'Create' }}</button>
          <button type="button" @click="cancelSetlist">Cancel</button>
        </div>
      </form>
    </div>

    <div class="panel" v-if="currentSetlist">
      <header class="panel-header">
        <h2>{{ currentSetlist.name }}</h2>
        <div class="header-actions">
          <button @click="startSet(currentSetlist.id)" :disabled="!currentSetlist.songOrder.length">Start Set</button>
          <button @click="editSetlist(currentSetlist)">Rename</button>
          <button @click="removeSetlist(currentSetlist.id)">Delete</button>
        </div>
      </header>
      <div class="setlist-songs">
        <div
          v-for="(songId, index) in currentSetlist.songOrder"
          :key="songId"
          class="setlist-song"
          draggable="true"
          @dragstart="onDragStart(index)"
          @dragover.prevent
          @drop="onDrop(index)"
        >
          <div>
            <strong>{{ songMap[songId]?.title || 'Unknown song' }}</strong>
            <small>
              {{ songMap[songId]?.artist || '' }} · {{ songMap[songId]?.bpm }} BPM ·
              {{ songMap[songId]?.timeSignature }}
            </small>
          </div>
          <div class="actions">
            <button @click="moveSong(index, -1)">↑</button>
            <button @click="moveSong(index, 1)">↓</button>
            <button @click="removeSongFromList(index)">Remove</button>
          </div>
        </div>
        <p v-if="!currentSetlist.songOrder.length" class="muted">No songs yet. Add one below.</p>
      </div>
      <form @submit.prevent="addSong" class="add-song">
        <label>
          Add Song
          <select v-model="selectedSongToAdd">
            <option value="">Select song</option>
            <option v-for="song in dataStore.songs" :key="song.id" :value="song.id">
              {{ song.title }} · {{ song.bpm }} BPM
            </option>
          </select>
        </label>
        <button type="submit" :disabled="!selectedSongToAdd">Add</button>
      </form>
    </div>

    <div class="panel" v-else>
      <p>No setlists yet. Create one to get started.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useDataStore } from '../stores/dataStore';
import type { Setlist, Song } from '../types';

const dataStore = useDataStore();
dataStore.load();
const router = useRouter();

const selectedSetlistId = ref<string>('');
const creating = ref(false);
const dragIndex = ref<number | null>(null);
const selectedSongToAdd = ref('');

const setlistForm = reactive({
  id: '',
  name: ''
});

const songMap = computed<Partial<Record<string, Song>>>(() =>
  dataStore.songs.reduce((map, song) => {
    map[song.id] = song;
    return map;
  }, {} as Record<string, Song>)
);

watch(
  () => dataStore.setlists,
  (lists) => {
    if (!lists.length) {
      selectedSetlistId.value = '';
      return;
    }
    if (!lists.some((l) => l.id === selectedSetlistId.value)) {
      selectedSetlistId.value = lists[0].id;
    }
  },
  { immediate: true }
);

const currentSetlist = computed(() => dataStore.setlists.find((list) => list.id === selectedSetlistId.value));

const newSetlist = () => {
  creating.value = true;
  setlistForm.id = '';
  setlistForm.name = '';
};

const editSetlist = (list: Setlist) => {
  creating.value = true;
  setlistForm.id = list.id;
  setlistForm.name = list.name;
};

const saveSetlist = () => {
  const saved = dataStore.upsertSetlist({ id: setlistForm.id || undefined, name: setlistForm.name });
  creating.value = false;
  selectedSetlistId.value = saved.id;
};

const cancelSetlist = () => {
  creating.value = false;
};

const removeSetlist = (id: string) => {
  if (confirm('Delete setlist?')) {
    dataStore.deleteSetlist(id);
  }
};

const addSong = () => {
  if (!currentSetlist.value || !selectedSongToAdd.value) return;
  dataStore.addSongToSetlist(currentSetlist.value.id, selectedSongToAdd.value);
  selectedSongToAdd.value = '';
};

const moveSong = (index: number, delta: number) => {
  if (!currentSetlist.value) return;
  const target = index + delta;
  if (target < 0 || target >= currentSetlist.value.songOrder.length) return;
  dataStore.reorderSetlist(currentSetlist.value.id, index, target);
};

const removeSongFromList = (index: number) => {
  if (!currentSetlist.value) return;
  const nextOrder = currentSetlist.value.songOrder.filter((_, idx) => idx !== index);
  dataStore.upsertSetlist({ ...currentSetlist.value, songOrder: nextOrder });
};

const onDragStart = (index: number) => {
  dragIndex.value = index;
};

const onDrop = (index: number) => {
  if (dragIndex.value === null || !currentSetlist.value) return;
  dataStore.reorderSetlist(currentSetlist.value.id, dragIndex.value, index);
  dragIndex.value = null;
};

const startSet = (setlistId: string) => {
  router.push({ name: 'start-set', params: { setlistId } });
};
</script>

<style scoped>
.setlists {
  gap: 1.5rem;
}

.setlist-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.setlist-button {
  background: var(--panel);
  border-radius: 0.75rem;
  padding: 0.75rem;
  border: 1px solid var(--border);
  text-align: left;
}

.setlist-button.active {
  border-color: var(--accent);
  color: var(--accent);
}

.setlist-songs {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 1rem 0;
}

.setlist-song {
  border: 1px dashed var(--border);
  padding: 0.75rem;
  border-radius: 1rem;
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
}

.setlist-song small {
  color: var(--muted);
  display: block;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.add-song {
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
}

.muted {
  color: var(--muted);
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

@media (max-width: 768px) {
  .setlist-song {
    flex-direction: column;
  }

  .actions {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
