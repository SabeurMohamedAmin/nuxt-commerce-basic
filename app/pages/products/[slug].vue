<script setup lang="ts">
import { products } from '~/data/products'
import { formatPrice } from '~/utils/format'

const route = useRoute()
const { addToCart } = useCart()
const { hasPurchased } = useAuth()

const product = computed(() =>
  products.find(p => p.slug === route.params.slug)
)

const isPurchased = computed(() =>
  product.value ? hasPurchased(product.value.id) : false
)

const relatedProducts = computed(() => {
  if (!product.value) return []
  return products
    .filter(p => p.categorySlug === product.value!.categorySlug && p.id !== product.value!.id)
    .slice(0, 5)
})

function handleAddToCart() {
  if (!product.value) return
  addToCart({
    id: product.value.id,
    title: product.value.title,
    price: product.value.price,
    image: product.value.image,
  })
}

function handleBuyNow() {
  handleAddToCart()
  navigateTo('/checkout')
}

useHead({ title: product.value?.title || 'Product Not Found' })
</script>

<template>
  <v-container class="py-6">
    <!-- Back link -->
    <NuxtLink to="/products" class="text-body-2 text-grey-darken-1 text-decoration-none d-inline-flex align-center mb-4">
      <v-icon size="16" class="mr-1">mdi-arrow-left</v-icon>
      Back to Products
    </NuxtLink>

    <template v-if="product">
      <h1 class="text-h5 font-weight-bold mb-6">{{ product.title }}</h1>

      <v-row>
        <!-- Left Column -->
        <v-col cols="12" md="5">
          <v-card flat variant="outlined" rounded="lg" class="mb-4">
            <v-img :src="product.image" :alt="product.title" height="240" cover />
          </v-card>

          <div class="d-flex align-center ga-2 mb-3">
            <span class="text-body-2 text-grey">Category:</span>
            <NuxtLink
              :to="`/products?category=${product.categorySlug}`"
              class="text-body-2 text-primary text-decoration-none font-weight-medium"
            >
              {{ product.category }}
            </NuxtLink>
          </div>

          <v-alert type="info" variant="tonal" density="compact" class="mb-4">
            <template #prepend>
              <v-icon size="18" color="amber">mdi-lightbulb</v-icon>
            </template>
            <span class="text-body-2">Buy once, download unlimited times from your library</span>
          </v-alert>
        </v-col>

        <!-- Right Column -->
        <v-col cols="12" md="7">
          <v-card flat variant="outlined" rounded="lg" class="pa-6 mb-4">
            <p class="text-body-2 text-grey mb-1">
              {{ product.title }} – your best solution for crafting exceptional websites with ease
            </p>
            <div class="bg-grey-lighten-4 rounded-lg pa-4 my-4">
              <p class="text-h3 font-weight-bold text-grey-darken-4">{{ formatPrice(product.price) }}</p>
              <p class="text-body-2 text-grey">One-time purchase</p>
            </div>

            <v-btn variant="outlined" block class="mb-2" @click="handleAddToCart">
              <v-icon start>mdi-cart-plus</v-icon>
              Add to Cart
            </v-btn>
            <v-btn color="primary" block size="large" class="mb-2" @click="handleBuyNow">
              <v-icon start>mdi-flash</v-icon>
              Buy Now
            </v-btn>
            <v-btn v-if="isPurchased" variant="text" block class="mb-2" to="/account">
              <v-icon start>mdi-download</v-icon>
              Download from Library
            </v-btn>
          </v-card>

          <div class="d-flex ga-3">
            <v-btn variant="outlined" size="small" class="flex-grow-1">
              <v-icon start size="18">mdi-bookmark-outline</v-icon>
              Add to Collection
            </v-btn>
            <v-btn variant="outlined" size="small" class="flex-grow-1">
              <v-icon start size="18">mdi-share-variant</v-icon>
              Share
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <!-- Description -->
      <ProductDescription class="mt-8" />

      <!-- FAQ -->
      <ProductFaq class="mt-6" />

      <!-- Related Products -->
      <section v-if="relatedProducts.length" class="mt-8">
        <h2 class="text-h6 font-weight-bold mb-4">You might also like</h2>
        <v-row>
          <v-col
            v-for="related in relatedProducts"
            :key="related.id"
            cols="6"
            sm="4"
            md="3"
            lg="2"
          >
            <v-card variant="outlined" rounded="lg" hover :to="`/products/${related.slug}`">
              <v-img :src="related.image" :alt="related.title" height="100" cover />
              <v-card-text class="pa-2">
                <p class="text-caption font-weight-medium related-title">{{ related.title.toUpperCase() }}</p>
                <div class="d-flex align-center justify-space-between mt-1">
                  <span class="text-caption text-primary font-weight-bold">{{ formatPrice(related.price) }}</span>
                  <v-icon size="14">mdi-arrow-right</v-icon>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </section>
    </template>

    <!-- Not Found -->
    <v-card v-else flat class="text-center py-12">
      <v-icon size="64" color="grey-lighten-1">mdi-alert-circle-outline</v-icon>
      <p class="text-h6 text-grey mt-4">Product not found</p>
      <v-btn color="primary" variant="outlined" class="mt-4" to="/products">Browse Products</v-btn>
    </v-card>
  </v-container>
</template>

<style scoped>
.related-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 28px;
}
</style>
