import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/metronome',
      name: 'metronome',
      component: () => import('../views/MetronomeView.vue')
    },
    {
      path: '/songs',
      name: 'songs',
      component: () => import('../views/SongsView.vue')
    },
    {
      path: '/setlists',
      name: 'setlists',
      component: () => import('../views/SetlistsView.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue')
    },
    {
      path: '/start-set/:setlistId',
      name: 'start-set',
      component: () => import('../views/StartSetView.vue'),
      props: true
    }
  ]
});

export default router;
