<template>
  <div class="gradient-background" aria-hidden="true">
    <span class="orb orb-purple"></span>
    <span class="orb orb-cyan"></span>
    <span class="orb orb-pink"></span>
    <span class="vignette"></span>
  </div>
</template>

<style scoped>
.gradient-background {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  background: radial-gradient(circle at 20% 20%, rgba(90, 67, 255, 0.08), transparent 30%),
    radial-gradient(circle at 80% 10%, rgba(31, 203, 255, 0.08), transparent 32%),
    linear-gradient(145deg, var(--bg-0), var(--bg-1));
  z-index: 0;
}

.orb {
  position: absolute;
  filter: blur(60px);
  opacity: 0.7;
  transform: translate3d(0, 0, 0);
  width: 520px;
  height: 520px;
  animation: float 16s ease-in-out infinite alternate;
}

.orb-purple {
  background: radial-gradient(circle, rgba(155, 123, 255, 0.3), transparent 60%);
  top: -120px;
  left: -80px;
  animation-delay: -3s;
}

.orb-cyan {
  background: radial-gradient(circle, rgba(62, 214, 255, 0.25), transparent 65%);
  top: 20%;
  right: -120px;
  animation-delay: -6s;
}

.orb-pink {
  background: radial-gradient(circle, rgba(255, 119, 224, 0.2), transparent 60%);
  bottom: -180px;
  left: 25%;
  animation-duration: 18s;
}

.vignette {
  position: absolute;
  inset: 0;
  box-shadow: inset 0 0 120px rgba(0, 0, 0, 0.55);
  background: radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.04), transparent 45%);
  mix-blend-mode: soft-light;
}

@keyframes float {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }
  to {
    transform: translate3d(20px, -30px, 0) scale(1.05);
  }
}
</style>
