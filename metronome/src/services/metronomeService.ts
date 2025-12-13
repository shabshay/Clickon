import { computed, ref } from 'vue';
import type { MetronomeSettings } from '../types';
import { metronomeEngine, SUBDIVISION_STEPS } from './metronomeEngine';
import { getSignature } from '../constants/timeSignatures';

const isRunning = ref(false);
const currentStep = ref(0);
const lastAccent = ref(false);
const activeSettings = ref<MetronomeSettings | null>(null);

metronomeEngine.subscribeTick(({ step, isAccent }) => {
  currentStep.value = step;
  lastAccent.value = isAccent;
});

metronomeEngine.subscribeState(({ running }) => {
  isRunning.value = running;
  if (!running) {
    currentStep.value = 0;
  }
});

export const useMetronomeService = () => {
  const beats = computed(() => {
    const settings = activeSettings.value;
    if (!settings) return { beat: 0, measure: 4 };
    const stepsPerBeat = SUBDIVISION_STEPS[settings.subdivision];
    const signature = getSignature(settings.timeSignature);
    const beat = Math.floor(currentStep.value / stepsPerBeat) % signature.beatsPerMeasure;
    return { beat, measure: signature.beatsPerMeasure };
  });

  const start = async (settings: MetronomeSettings) => {
    activeSettings.value = settings;
    await metronomeEngine.start(settings);
  };

  const pause = () => {
    metronomeEngine.pause();
  };

  const stop = () => {
    metronomeEngine.stop();
    currentStep.value = 0;
  };

  return {
    start,
    pause,
    stop,
    isRunning,
    currentStep,
    lastAccent,
    beats,
    activeSettings
  };
};
