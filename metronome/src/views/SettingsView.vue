<template>
  <section class="grid-two settings">
    <div class="panel">
      <h2>Storage & Backup</h2>
      <p>All presets, songs, and setlists are stored in your browser via localStorage. No account needed.</p>
      <div class="actions">
        <button @click="exportJson">Export JSON</button>
        <label class="import">
          Import JSON
          <input type="file" accept="application/json" @change="importJson" />
        </label>
      </div>
      <button class="danger" @click="clearAll">Reset Data</button>
    </div>
    <div class="panel">
      <h2>App Status</h2>
      <ul>
        <li>Storage version: {{ version }}</li>
        <li>PWA support: {{ pwaReady ? 'Ready for offline' : 'Registering…' }}</li>
        <li>Audio permissions: {{ audioState }}</li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { STORAGE_KEY, STORAGE_VERSION, useDataStore } from '../stores/dataStore';

const dataStore = useDataStore();
dataStore.load();
const version = STORAGE_VERSION;
const pwaReady = ref(false);
const audioState = ref('Tap Play to unlock audio engine');

const exportJson = () => {
  const blob = new Blob([dataStore.exportData()], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'clickon-metronome-backup.json';
  anchor.click();
  URL.revokeObjectURL(url);
};

const importJson = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];
  const content = await file.text();
  dataStore.importData(content);
  input.value = '';
  alert('Import complete');
};

const clearAll = () => {
  if (confirm('Clear all data?')) {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  }
};

onMounted(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(() => {
      pwaReady.value = true;
    });
  }
});
</script>

<style scoped>
.settings {
  gap: 1.5rem;
}

.actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.import {
  border: 1px dashed var(--border);
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
  cursor: pointer;
}

.import input {
  display: none;
}

.danger {
  border-color: #ff6666;
  color: #ff6666;
}

ul {
  list-style: none;
  padding: 0;
}

li + li {
  margin-top: 0.25rem;
}
</style>
