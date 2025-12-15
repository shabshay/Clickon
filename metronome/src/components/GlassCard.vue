<template>
  <div class="glass-card" v-bind="$attrs">
    <slot />
  </div>
</template>

<style scoped>
.glass-card {
  background: var(--glass);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-card);
  padding: 1.5rem;
  box-shadow: var(--shadow);
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  position: relative;
  transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
}

.glass-card::after {
  content: '';
  position: absolute;
  inset: 1px;
  border-radius: inherit;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0));
  pointer-events: none;
  opacity: 0.7;
}

.glass-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow), var(--glow);
  border-color: rgba(255, 255, 255, 0.2);
}
</style>
