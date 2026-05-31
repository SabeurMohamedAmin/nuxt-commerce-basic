<script setup lang="ts">
const features = [
  { icon: 'mdi-download', title: 'Instant Downloads', description: 'Get immediate access after purchase — download as many times as you need' },
  { icon: 'mdi-currency-usd-off', title: 'No Subscriptions', description: 'Pay once per product, own it forever. No recurring fees.' },
  { icon: 'mdi-star-check', title: 'Secure Checkout', description: 'Safe and easy payment powered by Stripe' },
  { icon: 'mdi-headset', title: 'Support', description: 'Get help whenever you need with our support team' },
]
</script>

<template>
  <v-container class="py-12">
    <h2 class="text-h4 font-weight-bold text-center mb-8">Why Choose Us?</h2>
    <v-row>
      <v-col v-for="feature in features" :key="feature.title" cols="12" sm="6" md="3">
        <div class="text-center">
          <v-icon size="40" color="primary" class="mb-3">{{ feature.icon }}</v-icon>
          <h3 class="text-body-1 font-weight-bold mb-2">{{ feature.title }}</h3>
          <p class="text-body-2 text-grey">{{ feature.description }}</p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>
