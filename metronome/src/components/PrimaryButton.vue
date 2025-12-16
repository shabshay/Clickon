<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps<{ to?: string; type?: 'button' | 'submit' | 'reset' }>();

const componentTag = computed(() => (props.to ? RouterLink : 'button'));
</script>

<template>
  <component
    :is="componentTag"
    class="primary-button"
    :to="to"
    :type="to ? undefined : type ?? 'button'"
  >
    <slot />
  </component>
</template>

<style scoped>
.primary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.9rem 1.4rem;
  border-radius: var(--radius-pill);
  background: linear-gradient(135deg, var(--accent-0), var(--accent-1));
  color: #050510;
  font-weight: 700;
  letter-spacing: 0.01em;
  border: none;
  box-shadow: 0 10px 30px rgba(62, 214, 255, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08);
  transition: transform 200ms ease, box-shadow 200ms ease, filter 200ms ease;
  cursor: pointer;
  text-decoration: none;
}

.primary-button:hover {
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 18px 38px rgba(62, 214, 255, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.12);
  filter: drop-shadow(0 0 16px rgba(155, 123, 255, 0.45));
}

.primary-button:active {
  transform: translateY(0);
}
</style>
