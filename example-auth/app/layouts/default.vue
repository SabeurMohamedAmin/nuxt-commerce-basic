<script setup lang="ts">
</script>

<template>
  <nav-bar />
  <main class="pages">
    <slot />
  </main>
</template>

<style scoped>
.pages{
  margin-top: 4rem;
  padding: 1rem;
}
</style>
