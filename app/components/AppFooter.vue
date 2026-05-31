<script setup lang="ts">
import { FOOTER_LINKS } from '~/constants'

const currentYear = new Date().getFullYear()

const socials = [
  { icon: 'mdi-facebook' },
  { icon: 'mdi-twitter' },
  { icon: 'mdi-pinterest' },
]
</script>

<template>
  <v-footer class="bg-white border-t pa-0">
    <v-container class="py-8">
      <div class="d-flex flex-wrap justify-center ga-6 mb-4">
        <NuxtLink
          v-for="link in FOOTER_LINKS"
          :key="link.to"
          :to="link.to"
          class="text-body-2 text-grey-darken-1 text-decoration-none"
        >
          {{ link.label }}
        </NuxtLink>
      </div>

      <div class="d-flex justify-center ga-3 mb-4">
        <v-btn v-for="social in socials" :key="social.icon" icon variant="text" size="small" color="grey-darken-1">
          <v-icon>{{ social.icon }}</v-icon>
        </v-btn>
      </div>

      <p class="text-center text-body-2 text-grey">
        &copy; {{ currentYear }} devclub.store - All Rights Reserved
      </p>
    </v-container>
  </v-footer>
</template>

<style scoped></style>
