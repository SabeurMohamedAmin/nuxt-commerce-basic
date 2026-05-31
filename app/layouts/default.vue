<script setup lang="ts"></script>

<template>
  <v-app>
    <AppHeader />
    <v-main>
      <slot />
    </v-main>
    <AppFooter />
    <ClientOnly>
      <CartDrawer />
    </ClientOnly>
  </v-app>
</template>

<style scoped></style>
