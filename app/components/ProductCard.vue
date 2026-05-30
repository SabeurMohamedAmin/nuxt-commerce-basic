<template>
  <v-card class="product-card h-100" variant="outlined" rounded="lg" hover>
    <NuxtLink :to="`/products/${product.slug}`" class="text-decoration-none">
      <v-img
        :src="product.image"
        :alt="product.title"
        height="180"
        cover
        class="rounded-t-lg"
      />
    </NuxtLink>

    <v-card-text class="pb-2">
      <NuxtLink :to="`/products/${product.slug}`" class="text-decoration-none">
        <p class="text-body-2 text-grey-darken-3 font-weight-medium product-title">
          {{ product.title.toUpperCase() }}
        </p>
      </NuxtLink>
    </v-card-text>

    <v-card-actions class="pt-0 px-4 pb-4">
      <span class="text-primary font-weight-bold text-body-2">${{ product.price.toFixed(2) }}</span>
      <v-spacer />
      <v-btn variant="text" size="small" :to="`/products/${product.slug}`" class="text-body-2">
        View
      </v-btn>
      <v-btn icon variant="text" size="x-small">
        <v-icon size="18">mdi-bookmark-outline</v-icon>
      </v-btn>
      <v-btn icon variant="flat" size="x-small" color="primary" @click.prevent="handleAddToCart">
        <v-icon size="18">mdi-cart-plus</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { Product } from '~/data/products'

const props = defineProps<{
  product: Product
}>()

const { addToCart } = useCart()

function handleAddToCart() {
  addToCart({
    id: props.product.id,
    title: props.product.title,
    price: props.product.price,
    image: props.product.image,
  })
}
</script>

<style scoped>
.product-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 40px;
}
</style>
