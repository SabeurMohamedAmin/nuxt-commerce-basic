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
        <!-- Left Column: Image + Category + Tip -->
        <v-col cols="12" md="5">
          <v-card flat variant="outlined" rounded="lg" class="mb-4">
            <v-img :src="product.image" :alt="product.title" height="240" cover />
          </v-card>

          <!-- Category -->
          <div class="d-flex align-center ga-2 mb-3">
            <span class="text-body-2 text-grey">Category:</span>
            <NuxtLink
              :to="`/products?category=${product.categorySlug}`"
              class="text-body-2 text-primary text-decoration-none font-weight-medium"
            >
              {{ product.category }}
            </NuxtLink>
          </div>

          <!-- Membership Tip -->
          <v-alert type="info" variant="tonal" density="compact" class="mb-4">
            <template #prepend>
              <v-icon size="18" color="amber">mdi-lightbulb</v-icon>
            </template>
            <span class="text-body-2">
              Tip: Get unlimited access to all products with a
              <NuxtLink to="/membership" class="text-primary font-weight-medium">membership</NuxtLink>
            </span>
          </v-alert>
        </v-col>

        <!-- Right Column: Price + Actions -->
        <v-col cols="12" md="7">
          <!-- Price Card -->
          <v-card flat variant="outlined" rounded="lg" class="pa-6 mb-4">
            <p class="text-body-2 text-grey mb-1">
              {{ product.title }} – your best solution for crafting exceptional websites with ease
            </p>
            <div class="bg-grey-lighten-4 rounded-lg pa-4 my-4">
              <p class="text-h3 font-weight-bold text-grey-darken-4">${{ product.price.toFixed(2) }}</p>
              <p class="text-body-2 text-grey">One-time purchase</p>
            </div>

            <!-- Action Buttons -->
            <v-btn
              variant="outlined"
              block
              class="mb-2"
              @click="handleAddToCart"
            >
              <v-icon start>mdi-cart-plus</v-icon>
              Add to Cart
            </v-btn>

            <v-btn
              color="primary"
              block
              size="large"
              class="mb-2"
              @click="handleBuyNow"
            >
              <v-icon start>mdi-flash</v-icon>
              Buy Now
            </v-btn>

            <v-btn variant="text" block class="mb-2">
              <v-icon start>mdi-download</v-icon>
              View in Library
            </v-btn>
          </v-card>

          <!-- Secondary Actions -->
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

      <!-- Description Section -->
      <v-card flat variant="outlined" rounded="lg" class="mt-8 pa-6">
        <h2 class="text-h6 font-weight-bold mb-4">Description</h2>

        <div class="text-body-2 text-grey-darken-2 description-content">
          <p class="mb-3">
            <strong>{{ product.title }}</strong>
          </p>
          <p class="mb-3">
            Transform your website building experience with this premium product, the industry-leading solution.
            Create stunning, professional websites without touching a single line of code. Trusted by millions of
            users, it empowers web developers, agencies, and site owners to bring their creative visions to life with
            unprecedented speed and flexibility.
          </p>

          <p class="font-weight-bold mb-2">Key Features:</p>
          <p class="mb-2">
            <strong>Frontend &amp; Backend Editor:</strong> Build pages live on the frontend for instant visual feedback or use the classic backend editor for structured control.
          </p>
          <p class="mb-2">
            <strong>Intuitive Drag &amp; Drop Interface:</strong> Easily add, move, and customize elements with a simple mouse drag. No coding skills required.
          </p>
          <p class="mb-2">
            <strong>Massive Content Element Library:</strong> Access a vast collection of pre-built content blocks, from text and images to advanced sliders, tabs, and post grids.
          </p>
          <p class="mb-2">
            <strong>Responsive by Design:</strong> Ensure your site looks perfect on all devices with fine-grained control over responsive behavior for every element.
          </p>
          <p class="mb-2">
            <strong>Template System &amp; Global Elements:</strong> Save any row or section as a template for reuse. Create global elements to update content across your entire site instantly.
          </p>
          <p class="mb-3">
            <strong>Deep WordPress Integration:</strong> Works seamlessly with any WordPress theme and most popular plugins, ensuring full compatibility.
          </p>

          <p class="font-weight-bold mb-2">Why Choose This Product?</p>
          <p class="mb-2">
            <strong>Unmatched Efficiency:</strong> Drastically reduce development time and project costs. Deliver custom, high-quality websites faster than ever.
          </p>
          <p class="mb-2">
            <strong>Empower Your Clients:</strong> Provide site owners with an easy-to-use tool to manage and update their own content, reducing ongoing maintenance requests.
          </p>
          <p class="mb-2">
            <strong>Professional Results:</strong> Go beyond basic page builders. This product offers advanced design options and structural control that professional developers demand.
          </p>
          <p class="mb-3">
            <strong>Proven Reliability:</strong> Continuously updated and maintained, offering a stable and trusted foundation for any project.
          </p>
        </div>
      </v-card>

      <!-- FAQ Section -->
      <v-card flat variant="outlined" rounded="lg" class="mt-6 pa-6">
        <h2 class="text-h6 font-weight-bold mb-4">Frequently Asked Questions</h2>

        <v-expansion-panels variant="accordion" flat>
          <v-expansion-panel v-for="faq in faqs" :key="faq.question">
            <v-expansion-panel-title class="text-body-2 font-weight-medium">
              {{ faq.question }}
            </v-expansion-panel-title>
            <v-expansion-panel-text class="text-body-2 text-grey-darken-1">
              {{ faq.answer }}
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card>

      <!-- Related Products -->
      <section class="mt-8">
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
                  <span class="text-caption text-primary font-weight-bold">${{ related.price.toFixed(2) }}</span>
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
      <v-btn color="primary" variant="outlined" class="mt-4" to="/products">
        Browse Products
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { products } from '~/data/products'

const route = useRoute()
const { addToCart } = useCart()

const product = computed(() =>
  products.find(p => p.slug === route.params.slug)
)

const relatedProducts = computed(() => {
  if (!product.value) return []
  return products
    .filter(p => p.categorySlug === product.value!.categorySlug && p.id !== product.value!.id)
    .slice(0, 5)
})

const faqs = [
  {
    question: 'What is the best page builder plugin for WordPress?',
    answer: 'This depends on your needs, but our marketplace offers the most popular and highly-rated page builders available, all at an affordable price.',
  },
  {
    question: 'How do I create a custom layout without coding?',
    answer: 'Most of our template kits and page builders include drag-and-drop interfaces that let you create custom layouts visually without writing any code.',
  },
  {
    question: 'Is a premium page builder worth it compared to free alternatives?',
    answer: 'Premium page builders offer more features, better support, regular updates, and professional-grade design options that free alternatives typically lack.',
  },
]

function handleAddToCart() {
  if (product.value) {
    addToCart({
      id: product.value.id,
      title: product.value.title,
      price: product.value.price,
      image: product.value.image,
    })
  }
}

function handleBuyNow() {
  handleAddToCart()
  navigateTo('/checkout')
}

useHead({
  title: product.value?.title || 'Product Not Found',
})
</script>

<style scoped>
.related-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 28px;
}
</style>
