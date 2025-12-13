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
        <li>PWA support: {{ pwaLabel }}</li>
        <li>Audio permissions: {{ audioStatus }}</li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { STORAGE_KEY, STORAGE_VERSION, useDataStore } from '../stores/dataStore';
import { useMetronomeService } from '../services/metronomeService';

const dataStore = useDataStore();
dataStore.load();
const version = STORAGE_VERSION;
const pwaReady = ref<'pending' | 'ready' | 'failed'>('pending');
const pwaLabel = computed(() => {
  if (pwaReady.value === 'ready') return 'Ready for offline';
  if (pwaReady.value === 'failed') return 'Registration failed';
  return 'Registering…';
});

const audioStatus = ref('Tap Play to unlock audio engine');
const { audioState } = useMetronomeService();
watch(
  audioState,
  (state) => {
    switch (state) {
      case 'running':
        audioStatus.value = 'Audio ready';
        break;
      case 'suspended':
        audioStatus.value = 'Tap Play to unlock audio engine';
        break;
      case 'closed':
        audioStatus.value = 'Audio unavailable (closed)';
        break;
      case 'error':
        audioStatus.value = 'Audio blocked (check permissions)';
        break;
      default:
        audioStatus.value = 'Tap Play to unlock audio engine';
    }
  },
  { immediate: true }
);

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
  try {
    const content = await file.text();
    dataStore.importData(content);
    alert('Import complete');
  } catch (error) {
    console.error('Import failed', error);
    alert('Import failed. Please confirm the file is valid JSON.');
  } finally {
    input.value = '';
  }
};

const clearAll = () => {
  if (confirm('Clear all data?')) {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  }
};

onMounted(() => {
  if ('serviceWorker' in navigator) {
    const timeout = window.setTimeout(() => {
      if (pwaReady.value === 'pending') {
        pwaReady.value = 'failed';
      }
    }, 8000);

    navigator.serviceWorker.ready
      .then(() => {
        pwaReady.value = 'ready';
      })
      .catch(() => {
        pwaReady.value = 'failed';
      })
      .finally(() => {
        window.clearTimeout(timeout);
      });

    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        if (!registrations.length && pwaReady.value === 'pending') {
          pwaReady.value = 'failed';
        }
      })
      .catch(() => {
        pwaReady.value = 'failed';
      });
  } else {
    pwaReady.value = 'failed';
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
