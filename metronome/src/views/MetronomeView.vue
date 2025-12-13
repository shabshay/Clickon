<template>
  <section class="metronome grid-two">
    <div class="panel main">
      <div class="bpm-display">
        <div class="label">BPM</div>
        <div class="value">{{ bpm }}</div>
        <div class="signature">{{ timeSignature }}</div>
      </div>
      <div class="controls">
        <button @click="changeBpm(-1)">-</button>
        <input type="range" min="30" max="280" v-model.number="bpm" />
        <button @click="changeBpm(1)">+</button>
      </div>
      <div class="secondary-controls">
        <button @click="tapTempo">Tap Tempo</button>
      </div>
      <div class="playback-buttons">
        <button class="square" :class="{ active: isRunning }" @click="togglePlay">
          {{ isRunning ? 'Pause' : 'Play' }}
        </button>
        <button class="square" @click="stopMetronome">Stop</button>
      </div>
      <div class="beat-indicator">
        <span v-for="n in beats.measure" :key="n" :class="{ active: n - 1 === beats.beat }"></span>
      </div>
      <div class="grid-two more">
        <label>
          Time Signature
          <select v-model="timeSignature">
            <option v-for="sig in timeSignatures" :key="sig.id" :value="sig.id">{{ sig.label }}</option>
          </select>
        </label>
        <label>
          Subdivision
          <select v-model="subdivision">
            <option value="quarter">Quarter</option>
            <option value="eighth">Eighth</option>
            <option value="triplet">Triplet</option>
          </select>
        </label>
        <label>
          Accent Volume
          <input type="range" min="0.6" max="1.8" step="0.1" v-model.number="accentVolume" />
        </label>
        <label>
          Swing Feel
          <input type="range" min="0" max="0.4" step="0.05" v-model.number="swing" />
        </label>
        <label>
          Click Sound
          <select v-model="soundSet">
            <option v-for="option in soundOptions" :key="option.id" :value="option.id">{{ option.label }}</option>
          </select>
        </label>
        <label>
          Accent Sound
          <select v-model="accentSoundSet">
            <option v-for="option in soundOptions" :key="option.id" :value="option.id">{{ option.label }}</option>
          </select>
        </label>
      </div>
    </div>

    <div class="panel presets">
      <header>
        <h2>Presets</h2>
        <button @click="startPresetFromCurrent">Save Current</button>
      </header>
      <div class="preset-list">
        <div v-for="preset in dataStore.presets" :key="preset.id" class="preset-row">
          <div>
            <strong>{{ preset.name }}</strong>
            <small>{{ preset.bpm }} BPM · {{ preset.timeSignature }}</small>
          </div>
          <div class="actions">
            <button @click="loadPreset(preset)">Load</button>
            <button @click="editPreset(preset)">Edit</button>
            <button @click="duplicatePreset(preset.id)">Duplicate</button>
            <button @click="deletePreset(preset.id)">Delete</button>
          </div>
        </div>
      </div>
      <form v-if="presetForm.visible" @submit.prevent="submitPreset">
        <label>
          Name
          <input v-model="presetForm.name" required />
        </label>
        <div class="grid-two">
          <label>
            BPM
            <input type="number" min="30" max="280" v-model.number="presetForm.bpm" required />
          </label>
          <label>
            Time Signature
            <select v-model="presetForm.timeSignature">
              <option v-for="sig in timeSignatures" :key="sig.id" :value="sig.id">{{ sig.label }}</option>
            </select>
          </label>
        </div>
        <label>
          Subdivision
          <select v-model="presetForm.subdivision">
            <option value="quarter">Quarter</option>
            <option value="eighth">Eighth</option>
            <option value="triplet">Triplet</option>
          </select>
        </label>
        <label>
          Swing
          <input type="range" min="0" max="0.4" step="0.05" v-model.number="presetForm.swing" />
        </label>
        <label>
          Sound
          <select v-model="presetForm.soundSet">
            <option v-for="option in soundOptions" :key="option.id" :value="option.id">{{ option.label }}</option>
          </select>
        </label>
        <label>
          Accent Sound
          <select v-model="presetForm.accentSoundSet">
            <option v-for="option in soundOptions" :key="option.id" :value="option.id">{{ option.label }}</option>
          </select>
        </label>
        <label>
          Accent Volume
          <input type="number" min="0.6" max="1.8" step="0.1" v-model.number="presetForm.accentVolume" />
        </label>
        <div class="form-actions">
          <button type="submit">{{ presetForm.id ? 'Update' : 'Create' }}</button>
          <button type="button" @click="cancelPreset">Cancel</button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useDataStore } from '../stores/dataStore';
import { useMetronomeService } from '../services/metronomeService';
import { TIME_SIGNATURES } from '../constants/timeSignatures';
import { SOUND_OPTIONS } from '../constants/sounds';
import type { Preset, SoundSetId, TimeSignatureId, Subdivision } from '../types';
import { useHaptics } from '../composables/useHaptics';

const dataStore = useDataStore();
dataStore.load();
const { pulse } = useHaptics();
const { start, pause, stop, isRunning, beats } = useMetronomeService();

const timeSignatures = TIME_SIGNATURES;
const soundOptions = SOUND_OPTIONS;

const bpm = ref(120);
const timeSignature = ref<TimeSignatureId>('4/4');
const subdivision = ref<Subdivision>('quarter');
const swing = ref(0);
const soundSet = ref<SoundSetId>('wood');
const accentSoundSet = ref<SoundSetId>('snare');
const accentVolume = ref(1.2);

const tapHistory = ref<number[]>([]);

const presetForm = reactive({
  id: '',
  visible: false,
  name: '',
  bpm: 120,
  timeSignature: '4/4' as TimeSignatureId,
  subdivision: 'quarter' as Subdivision,
  soundSet: 'wood' as SoundSetId,
  accentSoundSet: 'snare' as SoundSetId,
  accentVolume: 1.2,
  swing: 0
});

let bootstrappedPreset = false;
watch(
  () => dataStore.presets,
  (presets) => {
    if (!bootstrappedPreset && presets.length) {
      applyPreset(presets[0]);
      bootstrappedPreset = true;
    }
  },
  { immediate: true }
);

const applyPreset = (preset: Preset) => {
  bpm.value = preset.bpm;
  timeSignature.value = preset.timeSignature;
  subdivision.value = preset.subdivision;
  soundSet.value = preset.soundSet;
  accentSoundSet.value = preset.accentSoundSet;
  swing.value = preset.swing ?? 0;
  accentVolume.value = preset.accentVolume;
};

const changeBpm = (amount: number) => {
  const next = clamp(bpm.value + amount, 30, 280);
  bpm.value = next;
  pulse();
};

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

const tapTempo = () => {
  const now = performance.now();
  tapHistory.value = tapHistory.value.filter((ts) => now - ts < 2500);
  tapHistory.value.push(now);
  if (tapHistory.value.length >= 2) {
    const intervals = tapHistory.value.slice(1).map((ts, idx) => ts - tapHistory.value[idx]);
    const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const bpmGuess = clamp(Math.round(60000 / avg), 30, 280);
    bpm.value = bpmGuess;
  }
  pulse();
};

const buildSettings = () => ({
  bpm: bpm.value,
  timeSignature: timeSignature.value,
  subdivision: subdivision.value,
  soundSet: soundSet.value,
  accentSoundSet: accentSoundSet.value,
  accentVolume: accentVolume.value,
  swing: swing.value
});

const togglePlay = async () => {
  if (isRunning.value) {
    pause();
  } else {
    await start(buildSettings());
  }
};

const stopMetronome = () => {
  stop();
};

const loadPreset = (preset: Preset) => {
  applyPreset(preset);
};

const startPresetFromCurrent = () => {
  presetForm.visible = true;
  presetForm.id = '';
  presetForm.name = '';
  presetForm.bpm = bpm.value;
  presetForm.timeSignature = timeSignature.value;
  presetForm.subdivision = subdivision.value;
  presetForm.soundSet = soundSet.value;
  presetForm.accentSoundSet = accentSoundSet.value;
  presetForm.accentVolume = accentVolume.value;
  presetForm.swing = swing.value;
};

const editPreset = (preset: Preset) => {
  presetForm.visible = true;
  presetForm.id = preset.id;
  presetForm.name = preset.name;
  presetForm.bpm = preset.bpm;
  presetForm.timeSignature = preset.timeSignature;
  presetForm.subdivision = preset.subdivision;
  presetForm.soundSet = preset.soundSet;
  presetForm.accentSoundSet = preset.accentSoundSet;
  presetForm.accentVolume = preset.accentVolume;
  presetForm.swing = preset.swing ?? 0;
};

const submitPreset = () => {
  const saved = dataStore.upsertPreset({
    id: presetForm.id || undefined,
    name: presetForm.name,
    bpm: presetForm.bpm,
    timeSignature: presetForm.timeSignature,
    subdivision: presetForm.subdivision,
    soundSet: presetForm.soundSet,
    accentSoundSet: presetForm.accentSoundSet,
    accentVolume: presetForm.accentVolume,
    swing: presetForm.swing
  });
  presetForm.visible = false;
  applyPreset(saved);
};

const cancelPreset = () => {
  presetForm.visible = false;
};

const deletePreset = (id: string) => {
  if (confirm('Delete preset?')) {
    dataStore.deletePreset(id);
  }
};

const duplicatePreset = (id: string) => {
  const cloned = dataStore.duplicatePreset(id);
  if (cloned) applyPreset(cloned);
};
</script>

<style scoped>
.metronome {
  gap: 1.5rem;
}

.main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.bpm-display {
  text-align: center;
}

.bpm-display .label {
  font-size: 0.95rem;
  color: var(--muted);
}

.bpm-display .value {
  font-size: clamp(4rem, 12vw, 6rem);
  font-weight: 600;
}

.controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.controls button {
  width: 3rem;
  height: 3rem;
  border-radius: 999px;
  font-size: 1.5rem;
}

.controls input[type='range'] {
  flex: 1;
}

.secondary-controls {
  display: flex;
  gap: 0.75rem;
}

.playback-buttons {
  display: flex;
  gap: 0.75rem;
}

.playback-buttons .square {
  flex: 1;
  padding: 1rem;
  font-size: 1.25rem;
  border-radius: 1rem;
}

.playback-buttons .square.active {
  border-color: var(--accent);
  color: var(--accent);
}

.beat-indicator {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.beat-indicator span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--border);
}

.beat-indicator span.active {
  background: var(--accent);
}

.preset-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 300px;
  overflow: auto;
  margin-bottom: 1rem;
}

.preset-row {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: center;
}

.preset-row small {
  color: var(--muted);
  display: block;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

@media (max-width: 768px) {
  .actions {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
