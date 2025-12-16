<script setup lang="ts">
import GlassCard from '@/components/GlassCard.vue';
import PhoneMockup from '@/components/PhoneMockup.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';

const screens = [
  {
    label: 'Home Screen',
    gradient: 'linear-gradient(160deg, #10142b 0%, #0a0c1a 100%)',
    accent: '#8bb6ff',
    variant: 'home'
  },
  {
    label: 'Main Selection Screen',
    gradient: 'linear-gradient(160deg, #0f172e 0%, #101739 40%, #13112c 100%)',
    accent: '#9b7bff',
    variant: 'selection',
    tilt: true
  },
  {
    label: 'Active Screen',
    gradient: 'radial-gradient(circle at 40% 35%, rgba(113, 200, 255, 0.32), rgba(12, 15, 31, 0.9) 60%), #0a0d1f',
    accent: '#3ed6ff',
    variant: 'active'
  },
  {
    label: 'Settings Screen',
    gradient: 'linear-gradient(150deg, #10142b 0%, #0d1022 40%, #0b0f1b 100%)',
    accent: '#9b7bff',
    variant: 'settings',
    tilt: true
  }
];
</script>
<template>
  <div class="home">
    <section class="hero">
      <GlassCard class="hero-card">
        <div class="brand-line">
          <div class="brand-mark">
            <span class="bar bar-1"></span>
            <span class="bar bar-2"></span>
            <span class="bar bar-3"></span>
          </div>
          <div>
            <p class="eyebrow">Premium Metronome</p>
            <h1>Clickon</h1>
            <p class="lede">Find your rhythm. Play on.</p>
          </div>
        </div>
        <p class="supporting">
          A modern metronome experience with curated presets, slick visuals, and a focus-friendly interface for
          musicians on any device.
        </p>
        <div class="cta-row">
          <PrimaryButton to="/metronome">Get Started</PrimaryButton>
          <span class="hint">No signup required · Free to play</span>
        </div>
      </GlassCard>

      <div class="mockup-gallery">
        <PhoneMockup
          v-for="screen in screens"
          :key="screen.label"
          :label="screen.label"
          :gradient="screen.gradient"
          :accent="screen.accent"
          :tilt="screen.tilt"
        >
          <div class="screen-shell" :class="screen.variant">
            <template v-if="screen.variant === 'home'">
              <div class="logo-badge">
                <div class="logo-icon">
                  <span></span>
                </div>
                <div>
                  <p class="micro">Clickon</p>
                  <strong>Find your rhythm</strong>
                </div>
              </div>
              <div class="home-cta">Get Started</div>
              <div class="mini-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </template>

            <template v-else-if="screen.variant === 'selection'">
              <div class="section-heading">
                <p class="micro">Discover</p>
                <strong>Metronome Tools</strong>
              </div>
              <div class="tile" v-for="label in ['Rhythm Trainer', 'Instrument Tuner', 'Groove Library', 'Exercises']" :key="label">
                <div class="tile-icon"></div>
                <div>
                  <p class="tile-title">{{ label }}</p>
                  <p class="micro">Ready to play</p>
                </div>
                <span class="pill">Go</span>
              </div>
            </template>

            <template v-else-if="screen.variant === 'active'">
              <div class="dial">
                <div class="ring">
                  <div class="pulse"></div>
                </div>
                <div class="dial-label">120 BPM</div>
              </div>
              <div class="timeline">
                <span v-for="n in 8" :key="n"></span>
              </div>
              <div class="controls">
                <div class="control">-</div>
                <div class="primary">Play</div>
                <div class="control">+</div>
              </div>
            </template>

            <template v-else>
              <div class="section-heading">
                <p class="micro">Settings</p>
                <strong>Stay tuned</strong>
              </div>
              <div class="setting" v-for="setting in ['Sound Effects', 'Dark Mode', 'Notifications', 'Account']" :key="setting">
                <span>{{ setting }}</span>
                <div class="switch">
                  <span class="thumb"></span>
                </div>
              </div>
            </template>
          </div>
        </PhoneMockup>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  position: relative;
  min-height: 100vh;
  padding: 1.5rem;
  color: var(--text-0);
}

.hero {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.4rem;
  z-index: 1;
}

.hero-card {
  display: grid;
  gap: 1rem;
}

.brand-line {
  display: flex;
  gap: 0.9rem;
  align-items: center;
}

.brand-mark {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(155, 123, 255, 0.35), rgba(62, 214, 255, 0.32));
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  padding: 8px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12), 0 12px 28px rgba(0, 0, 0, 0.35);
}

.brand-mark .bar {
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
}

.bar-1 {
  height: 100%;
  opacity: 0.7;
}

.bar-2 {
  height: 70%;
  align-self: end;
  opacity: 0.85;
}

.bar-3 {
  height: 50%;
  align-self: end;
  opacity: 0.6;
}

.eyebrow {
  margin: 0 0 0.2rem;
  color: var(--accent-1);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: 0.85rem;
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 2.8rem);
  letter-spacing: -0.02em;
}

.lede {
  margin: 0.25rem 0 0.75rem;
  color: var(--text-1);
  font-size: 1.05rem;
}

.supporting {
  margin: 0;
  color: var(--text-1);
  line-height: 1.6;
}

.cta-row {
  display: flex;
  gap: 0.9rem;
  align-items: center;
  flex-wrap: wrap;
}

.hint {
  color: var(--text-1);
  font-size: 0.95rem;
}

.mockup-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.3rem;
  justify-items: center;
}

.screen-shell {
  width: 100%;
  flex: 1;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 18px;
  padding: 0.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.screen-shell.home {
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 1rem;
}

.logo-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.06);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
}

.logo-icon {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(155, 123, 255, 0.8), rgba(62, 214, 255, 0.7));
  position: relative;
  display: grid;
  place-items: center;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.16), 0 10px 24px rgba(0, 0, 0, 0.35);
}

.logo-icon span {
  width: 22px;
  height: 22px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
}

.micro {
  margin: 0;
  color: var(--text-1);
  font-size: 0.85rem;
}

.home-cta {
  padding: 0.8rem 1rem;
  border-radius: var(--radius-pill);
  background: linear-gradient(135deg, rgba(155, 123, 255, 0.85), rgba(62, 214, 255, 0.8));
  color: #050510;
  font-weight: 700;
  width: fit-content;
  margin: 0 auto;
  box-shadow: 0 8px 26px rgba(62, 214, 255, 0.3);
}

.mini-dots {
  display: flex;
  gap: 0.3rem;
  justify-content: center;
}

.mini-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
}

.section-heading {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.tile {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.75rem;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.tile-icon {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(155, 123, 255, 0.65), rgba(62, 214, 255, 0.65));
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.16);
}

.tile-title {
  margin: 0;
  font-weight: 600;
}

.pill {
  padding: 0.4rem 0.7rem;
  border-radius: var(--radius-pill);
  border: 1px solid rgba(255, 255, 255, 0.16);
  font-size: 0.85rem;
}

.dial {
  display: grid;
  place-items: center;
  gap: 0.4rem;
}

.ring {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(62, 214, 255, 0.2), rgba(62, 214, 255, 0) 70%);
  display: grid;
  place-items: center;
  box-shadow: 0 0 18px rgba(62, 214, 255, 0.3);
}

.pulse {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: linear-gradient(145deg, rgba(155, 123, 255, 0.75), rgba(62, 214, 255, 0.9));
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12), 0 12px 30px rgba(0, 0, 0, 0.4);
}

.dial-label {
  font-weight: 700;
  letter-spacing: 0.04em;
}

.timeline {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 0.3rem;
}

.timeline span {
  height: 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.12);
}

.timeline span:first-child {
  background: linear-gradient(135deg, rgba(62, 214, 255, 0.9), rgba(155, 123, 255, 0.9));
}

.controls {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.6rem;
}

.controls .control,
.controls .primary {
  text-align: center;
  padding: 0.6rem 0.8rem;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.06);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.controls .primary {
  background: linear-gradient(135deg, rgba(155, 123, 255, 0.85), rgba(62, 214, 255, 0.85));
  color: #050510;
  font-weight: 700;
}

.setting {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.65rem 0.85rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 14px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
}

.switch {
  width: 46px;
  height: 26px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(155, 123, 255, 0.45), rgba(62, 214, 255, 0.5));
  padding: 4px;
  display: flex;
  justify-content: flex-end;
}

.thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

@media (min-width: 960px) {
  .hero {
    grid-template-columns: 1.1fr 1.2fr;
    align-items: center;
  }

  .mockup-gallery {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
  }
}
</style>
