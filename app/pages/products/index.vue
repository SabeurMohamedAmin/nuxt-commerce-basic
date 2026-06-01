<script setup lang="ts">
import type { Product } from '~/types'
import { CATEGORIES, SORT_OPTIONS, PAGINATION } from '~/constants'

const route = useRoute()

const search = ref((route.query.search as string) || '')
const selectedCategory = ref((route.query.category as string) || '')
const sortBy = ref('default')
const currentPage = ref(1)
const loading = ref(true)
const allProducts = ref<Product[]>([])

const categoryOptions = [{ name: 'All Categories', slug: '' }, ...CATEGORIES]

async function fetchProducts() {
  loading.value = true
  try {
    const data = await $fetch('/api/products', {
      params: {
        search: search.value || undefined,
        category: selectedCategory.value || undefined,
        page: 1,
        limit: 1000,
      },
    })
    allProducts.value = data.products
  } catch {
    allProducts.value = []
  }
  loading.value = false
}

onMounted(fetchProducts)

// Re-fetch when filters change
watch([search, selectedCategory], () => {
  currentPage.value = 1
  fetchProducts()
})

const sortedProducts = computed(() => {
  const result = [...allProducts.value]
  switch (sortBy.value) {
    case 'name-asc': return result.sort((a, b) => a.title.localeCompare(b.title))
    case 'name-desc': return result.sort((a, b) => b.title.localeCompare(a.title))
    case 'price-asc': return result.sort((a, b) => a.price - b.price)
    case 'price-desc': return result.sort((a, b) => b.price - a.price)
    default: return result
  }
})

const totalPages = computed(() => Math.ceil(sortedProducts.value.length / PAGINATION.PRODUCTS_PER_PAGE))
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * PAGINATION.PRODUCTS_PER_PAGE
  return sortedProducts.value.slice(start, start + PAGINATION.PRODUCTS_PER_PAGE)
})

watch(sortBy, () => { currentPage.value = 1 })
</script>

<template>
  <v-container class="py-8">
    <h1 class="text-h4 font-weight-bold mb-1">Digital Products</h1>
    <p class="text-body-2 text-grey mb-6">Browse our collection of {{ allProducts.length }} products</p>

    <v-card flat variant="outlined" rounded="lg" class="mb-6">
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" md="5">
            <v-text-field v-model="search" placeholder="Search products..." variant="outlined" density="compact" hide-details prepend-inner-icon="mdi-magnify" clearable />
          </v-col>
          <v-col cols="12" md="4">
            <v-select v-model="selectedCategory" :items="categoryOptions" item-title="name" item-value="slug" placeholder="All Categories" variant="outlined" density="compact" hide-details clearable />
          </v-col>
          <v-col cols="12" md="3">
            <v-select v-model="sortBy" :items="SORT_OPTIONS" item-title="label" item-value="value" variant="outlined" density="compact" hide-details />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <div v-if="loading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <template v-else>
      <v-row v-if="paginatedProducts.length">
        <v-col v-for="product in paginatedProducts" :key="product.id" cols="12" sm="6" md="4" lg="3">
          <ProductCard :product="product" />
        </v-col>
      </v-row>

      <v-card v-else flat class="text-center py-12">
        <v-icon size="64" color="grey-lighten-1">mdi-magnify</v-icon>
        <p class="text-h6 text-grey mt-4">No products found</p>
        <p class="text-body-2 text-grey">Try adjusting your search or filters</p>
      </v-card>

      <div v-if="totalPages > 1" class="d-flex justify-center mt-8">
        <v-pagination v-model="currentPage" :length="totalPages" :total-visible="5" rounded="circle" color="primary" />
      </div>
    </template>
  </v-container>
</template>

<style scoped></style>
