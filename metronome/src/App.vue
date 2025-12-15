<template>
  <div class="app-shell">
    <header class="top-bar">
      <div class="brand">
        <span class="dot"></span>
        <span>Clickon Metronome</span>
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
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';

const links = [
  { to: '/metronome', label: 'Metronome' },
  { to: '/songs', label: 'Songs' },
  { to: '/setlists', label: 'Setlists' },
  { to: '/settings', label: 'Settings' }
];
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  padding: 1rem;
  max-width: 960px;
  margin: 0 auto;
  width: 100%;
}

.top-bar {
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
}

.brand {
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
}

.brand .dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background: var(--accent);
  display: inline-block;
}

nav {
  display: flex;
  gap: 0.75rem;
}

nav a {
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  color: var(--muted);
  border: 1px solid transparent;
}

nav a.active,
nav a:hover {
  color: var(--text);
  border-color: var(--border);
}

@media (max-width: 640px) {
  main {
    padding: 0.75rem;
  }

  nav {
    width: 100%;
    margin-top: 0.75rem;
    justify-content: space-between;
    flex-wrap: wrap;
  }
}
</style>
