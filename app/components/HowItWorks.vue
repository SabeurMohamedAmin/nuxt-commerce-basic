<script setup lang="ts">
const steps = [
  { icon: 'mdi-magnify', title: '1. Browse & Choose', description: 'Find the perfect theme or plugin from our collection' },
  { icon: 'mdi-cart-check', title: '2. Purchase', description: 'Pay once with secure Stripe checkout — no subscriptions' },
  { icon: 'mdi-download', title: '3. Download Anytime', description: 'Access your purchases forever — unlimited re-downloads' },
]
</script>

<template>
  <section class="bg-grey-lighten-4 py-12 mt-8">
    <v-container>
      <h2 class="text-h4 font-weight-bold text-center mb-8">How It Works</h2>
      <v-row>
        <v-col v-for="step in steps" :key="step.title" cols="12" md="4">
          <div class="text-center">
            <v-avatar color="primary" size="56" class="mb-3">
              <v-icon color="white">{{ step.icon }}</v-icon>
            </v-avatar>
            <h3 class="text-body-1 font-weight-bold mb-2">{{ step.title }}</h3>
            <p class="text-body-2 text-grey">{{ step.description }}</p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<style scoped></style>
