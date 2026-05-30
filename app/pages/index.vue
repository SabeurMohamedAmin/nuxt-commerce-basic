<template>
  <div>
    <!-- Hero Section -->
    <section class="hero-section">
      <v-container class="py-16 text-center text-white">
        <h1 class="text-h3 text-md-h2 font-weight-bold mb-4">Digital Products Marketplace</h1>
        <p class="text-body-1 mb-8 mx-auto" style="max-width: 600px">
          Access premium digital products, courses, and resources.
          Buy once, download anytime from your library.
        </p>

        <!-- Search Bar -->
        <v-card class="mx-auto" max-width="560" rounded="pill" flat>
          <v-text-field
            v-model="searchQuery"
            placeholder="Find a product..."
            variant="solo"
            flat
            hide-details
            rounded="pill"
            class="hero-search"
            @keyup.enter="goToSearch"
          >
            <template #append-inner>
              <v-btn color="primary" rounded="pill" size="small" @click="goToSearch">
                Search
              </v-btn>
            </template>
          </v-text-field>
        </v-card>

        <p class="text-body-2 mt-4 text-white-darken-1">
          ✓ All Items $2.49 Each ✓ Digital only ✓ Instant Download ✓ Unlimited Re-downloads
        </p>

        <div class="d-flex justify-center ga-3 mt-6">
          <v-btn color="white" variant="flat" rounded="pill" to="/products">
            Browse Products
          </v-btn>
        </div>
      </v-container>
    </section>

    <!-- Categories Section -->
    <v-container class="py-12">
      <div class="d-flex flex-wrap justify-center ga-6">
        <NuxtLink
          v-for="cat in categories"
          :key="cat.slug"
          :to="`/products?category=${cat.slug}`"
          class="text-decoration-none text-center"
        >
          <v-avatar color="primary" variant="tonal" size="56" class="mb-2">
            <v-icon>{{ cat.icon }}</v-icon>
          </v-avatar>
          <p class="text-caption text-grey-darken-2" style="max-width: 80px">{{ cat.name }}</p>
        </NuxtLink>
      </div>
    </v-container>

    <!-- Featured Products -->
    <v-container class="py-8">
      <h2 class="text-h4 font-weight-bold text-center mb-2">Featured Products</h2>
      <p class="text-body-2 text-grey text-center mb-8">Check out our most popular digital products</p>

      <v-row>
        <v-col
          v-for="product in featuredProducts"
          :key="product.id"
          cols="12"
          sm="6"
          md="4"
        >
          <ProductCard :product="product" />
        </v-col>
      </v-row>

      <div class="text-center mt-8">
        <v-btn variant="outlined" color="primary" rounded="pill" to="/products">
          View All Products
        </v-btn>
      </div>
    </v-container>

    <!-- How It Works -->
    <section class="bg-grey-lighten-4 py-12 mt-8">
      <v-container>
        <h2 class="text-h4 font-weight-bold text-center mb-8">How It Works</h2>
        <v-row>
          <v-col cols="12" md="4">
            <div class="text-center">
              <v-avatar color="primary" size="56" class="mb-3">
                <v-icon color="white">mdi-magnify</v-icon>
              </v-avatar>
              <h3 class="text-body-1 font-weight-bold mb-2">1. Browse & Choose</h3>
              <p class="text-body-2 text-grey">Find the perfect theme or plugin from our collection</p>
            </div>
          </v-col>
          <v-col cols="12" md="4">
            <div class="text-center">
              <v-avatar color="primary" size="56" class="mb-3">
                <v-icon color="white">mdi-cart-check</v-icon>
              </v-avatar>
              <h3 class="text-body-1 font-weight-bold mb-2">2. Purchase</h3>
              <p class="text-body-2 text-grey">Pay once with secure Stripe checkout — no subscriptions</p>
            </div>
          </v-col>
          <v-col cols="12" md="4">
            <div class="text-center">
              <v-avatar color="primary" size="56" class="mb-3">
                <v-icon color="white">mdi-download</v-icon>
              </v-avatar>
              <h3 class="text-body-1 font-weight-bold mb-2">3. Download Anytime</h3>
              <p class="text-body-2 text-grey">Access your purchases forever — unlimited re-downloads</p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Why Choose Us -->
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

    <!-- CTA Section -->
    <section class="bg-primary py-12">
      <v-container class="text-center text-white">
        <h2 class="text-h4 font-weight-bold mb-4">Ready to Get Started?</h2>
        <p class="text-body-1 mb-6">Browse our collection and start downloading today</p>
        <v-btn color="white" variant="flat" rounded="pill" to="/products">
          Get Started
        </v-btn>
      </v-container>
    </section>
  </div>
</template>

<script setup lang="ts">
import { products, categories } from '~/data/products'

const searchQuery = ref('')
const featuredProducts = computed(() => products.slice(0, 6))

const features = [
  { icon: 'mdi-download', title: 'Instant Downloads', description: 'Get immediate access after purchase — download as many times as you need' },
  { icon: 'mdi-currency-usd-off', title: 'No Subscriptions', description: 'Pay once per product, own it forever. No recurring fees.' },
  { icon: 'mdi-star-check', title: 'Secure Checkout', description: 'Safe and easy payment powered by Stripe' },
  { icon: 'mdi-headset', title: 'Support', description: 'Get help whenever you need with our support team' },
]

function goToSearch() {
  if (searchQuery.value.trim()) {
    navigateTo(`/products?search=${encodeURIComponent(searchQuery.value)}`)
  }
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #1565C0 0%, #0D47A1 50%, #1A237E 100%);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
</style>
