<script setup lang="ts">
import { products } from '~/data/products'
import { CATEGORIES, SORT_OPTIONS } from '~/constants'

const route = useRoute()

const categoryOptions = [{ name: 'All Categories', slug: '' }, ...CATEGORIES]

const {
  search,
  selectedCategory,
  sortBy,
  currentPage,
  filteredProducts,
  paginatedProducts,
  totalPages,
} = useProductFilter({ products })

// Initialize from query params
onMounted(() => {
  if (route.query.search) search.value = route.query.search as string
  if (route.query.category) selectedCategory.value = route.query.category as string
})
</script>

<template>
  <v-container class="py-8">
    <!-- Page Header -->
    <h1 class="text-h4 font-weight-bold mb-1">Digital Products</h1>
    <p class="text-body-2 text-grey mb-6">
      Browse our collection of {{ filteredProducts.length }} products
    </p>

    <!-- Filters -->
    <v-card flat variant="outlined" rounded="lg" class="mb-6">
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" md="5">
            <v-text-field
              v-model="search"
              placeholder="Search products..."
              variant="outlined"
              density="compact"
              hide-details
              prepend-inner-icon="mdi-magnify"
              clearable
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="selectedCategory"
              :items="categoryOptions"
              item-title="name"
              item-value="slug"
              placeholder="All Categories"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="sortBy"
              :items="SORT_OPTIONS"
              item-title="label"
              item-value="value"
              variant="outlined"
              density="compact"
              hide-details
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Products Grid -->
    <v-row>
      <v-col
        v-for="product in paginatedProducts"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <ProductCard :product="product" />
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-card v-if="filteredProducts.length === 0" flat class="text-center py-12">
      <v-icon size="64" color="grey-lighten-1">mdi-magnify</v-icon>
      <p class="text-h6 text-grey mt-4">No products found</p>
      <p class="text-body-2 text-grey">Try adjusting your search or filters</p>
    </v-card>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="d-flex justify-center mt-8">
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="5"
        rounded="circle"
        color="primary"
      />
    </div>
  </v-container>
</template>

<style scoped></style>
