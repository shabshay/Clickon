<template>
  <div class="app-shell">
    <GradientBackground />
    <div class="shell-inner">
      <header class="app-header glass-panel">
        <div class="brand">
          <div class="brand-icon">
            <span class="bar bar-1"></span>
            <span class="bar bar-2"></span>
            <span class="bar bar-3"></span>
          </div>
          <div class="brand-text">
            <span class="title">Clickon</span>
            <small>Metronome</small>
          </div>
        </div>
        <nav>
          <RouterLink v-for="link in links" :key="link.to" :to="link.to" active-class="active">
            {{ link.label }}
          </RouterLink>
        </nav>
      </header>
      <main>
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import GradientBackground from './components/GradientBackground.vue';

const links = [
  { to: '/', label: 'Home' },
  { to: '/metronome', label: 'Metronome' },
  { to: '/songs', label: 'Songs' },
  { to: '/setlists', label: 'Setlists' },
  { to: '/settings', label: 'Settings' }
];
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  color: var(--text-0);
}

.shell-inner {
  position: relative;
  z-index: 1;
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.5rem;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: var(--radius-card);
  border-color: rgba(255, 255, 255, 0.16);
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-icon {
  width: 46px;
  height: 46px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(155, 123, 255, 0.4), rgba(62, 214, 255, 0.35));
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  padding: 6px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12), 0 12px 24px rgba(0, 0, 0, 0.35);
}

.brand-icon .bar {
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
}

.bar-1 {
  height: 100%;
  opacity: 0.75;
}

.bar-2 {
  height: 70%;
  align-self: end;
  opacity: 0.85;
}

.bar-3 {
  height: 50%;
  align-self: end;
  opacity: 0.65;
}

.brand-text .title {
  font-weight: 700;
  letter-spacing: 0.01em;
}

.brand-text small {
  display: block;
  color: var(--text-1);
}

nav {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

nav a {
  padding: 0.55rem 0.95rem;
  border-radius: var(--radius-pill);
  color: var(--text-1);
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  transition: border-color 200ms ease, color 200ms ease, box-shadow 200ms ease, transform 200ms ease;
}

nav a:hover {
  color: var(--text-0);
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.25), 0 0 12px rgba(62, 214, 255, 0.2);
  transform: translateY(-2px);
}

nav a.active {
  color: #050510;
  background: linear-gradient(135deg, rgba(155, 123, 255, 0.9), rgba(62, 214, 255, 0.9));
  border-color: transparent;
  box-shadow: 0 10px 26px rgba(62, 214, 255, 0.3);
}

main {
  padding: 1.25rem 0;
}

@media (max-width: 640px) {
  .shell-inner {
    padding: 1rem;
  }

  nav {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
