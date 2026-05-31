<script setup lang="ts">
const { hydrated } = useAuth()
</script>

<template>
  <Transition name="fade">
    <div v-if="!hydrated" class="app-loading">
      <div class="app-loading__content">
        <img src="/images/logo/image.png" alt="devclub.store" class="app-loading__logo">
        <div class="app-loading__spinner">
          <div class="app-loading__dot" />
          <div class="app-loading__dot" />
          <div class="app-loading__dot" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.app-loading {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
}

.app-loading__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.app-loading__logo {
  width: 64px;
  height: 64px;
  animation: pulse 1.5s ease-in-out infinite;
}

.app-loading__spinner {
  display: flex;
  gap: 8px;
}

.app-loading__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #1565C0;
  animation: bounce 1.2s ease-in-out infinite;
}

.app-loading__dot:nth-child(2) {
  animation-delay: 0.2s;
}

.app-loading__dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
}

@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-12px); }
}

.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-leave-to {
  opacity: 0;
}
</style>
