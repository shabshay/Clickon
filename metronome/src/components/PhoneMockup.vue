<script setup lang="ts">
const props = defineProps({
  label: { type: String, required: true },
  gradient: {
    type: String,
    default: 'linear-gradient(160deg, #12182f 0%, #0c0f1f 100%)'
  },
  accent: {
    type: String,
    default: '#9b7bff'
  },
  tilt: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <div class="mockup" :class="{ tilt }" :style="{ '--mockup-accent': props.accent }">
    <div class="frame" :style="{ background: props.gradient }">
      <div class="notch"></div>
      <div class="screen">
        <slot />
      </div>
    </div>
    <p class="label">{{ label }}</p>
  </div>
</template>

<style scoped>
.mockup {
  display: grid;
  gap: 0.65rem;
  justify-items: center;
  filter: drop-shadow(0 18px 36px rgba(0, 0, 0, 0.45)) drop-shadow(0 0 14px color-mix(in srgb, var(--mockup-accent), transparent 75%));
  transition: transform 240ms ease, filter 240ms ease;
}

.mockup:hover {
  transform: translateY(-6px);
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.55))
    drop-shadow(0 0 22px color-mix(in srgb, var(--mockup-accent), transparent 65%));
}

.frame {
  width: min(320px, 78vw);
  aspect-ratio: 9 / 19.5;
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04), 0 26px 60px rgba(0, 0, 0, 0.6),
    0 0 18px color-mix(in srgb, var(--mockup-accent), transparent 70%);
  transform: rotate(-2deg);
  transition: transform 200ms ease;
}

.mockup.tilt .frame {
  transform: rotate(2deg);
}

.notch {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 140px;
  height: 26px;
  border-radius: 18px;
  background: rgba(0, 0, 0, 0.22);
  box-shadow: inset 0 -1px 0 rgba(255, 255, 255, 0.06);
  z-index: 2;
}

.screen {
  position: absolute;
  inset: 10px;
  border-radius: 26px;
  background: inherit;
  padding: 1.4rem 1.2rem;
  color: var(--text-0);
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.label {
  margin: 0;
  color: var(--text-1);
  font-size: 0.95rem;
  letter-spacing: 0.01em;
}
</style>
