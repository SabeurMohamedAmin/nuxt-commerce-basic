<script setup lang="ts">
import { products } from '~/data/products'
import { CATEGORIES } from '~/constants'

const featuredProducts = computed(() => products.slice(0, 6))

function goToSearch(query: string) {
  navigateTo(`/products?search=${encodeURIComponent(query)}`)
}
</script>

<template>
  <div>
    <!-- Hero Section -->
    <HeroSection @search="goToSearch" />

    <!-- Categories -->
    <v-container class="py-12">
      <div class="d-flex flex-wrap justify-center ga-6">
        <NuxtLink
          v-for="cat in CATEGORIES"
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
        <v-col v-for="product in featuredProducts" :key="product.id" cols="12" sm="6" md="4">
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
    <HowItWorks />

    <!-- Why Choose Us -->
    <WhyChooseUs />

    <!-- CTA -->
    <section class="bg-primary py-12">
      <v-container class="text-center text-white">
        <h2 class="text-h4 font-weight-bold mb-4">Ready to Get Started?</h2>
        <p class="text-body-1 mb-6">Browse our collection and start downloading today</p>
        <v-btn color="white" variant="flat" rounded="pill" to="/products">Get Started</v-btn>
      </v-container>
    </section>
  </div>
</template>

<style scoped></style>
