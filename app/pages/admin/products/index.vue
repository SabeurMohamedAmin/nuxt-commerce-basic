<script setup lang="ts">
import type { Product } from '~/types'
import { CATEGORIES, PAGINATION } from '~/constants'
import { formatPrice } from '~/utils/format'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const categoryOptions = [{ name: 'All Categories', slug: '' }, ...CATEGORIES]
const deleteDialog = ref(false)
const productToDelete = ref<Product | null>(null)
const loading = ref(true)
const allProducts = ref<Product[]>([])

// Fetch products from API
async function fetchProducts() {
  loading.value = true
  try {
    allProducts.value = await $fetch('/api/admin/products')
  } catch {
    allProducts.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchProducts)

const { search, selectedCategory, currentPage, filteredProducts, paginatedProducts, totalPages } =
  useProductFilter({ products: allProducts.value, perPage: PAGINATION.ADMIN_PER_PAGE })

// Re-compute filter when products load
const filteredList = computed(() => {
  let result = [...allProducts.value]
  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter(p => p.title.toLowerCase().includes(q))
  }
  if (selectedCategory.value) {
    result = result.filter(p => p.categorySlug === selectedCategory.value)
  }
  return result
})

const totalPagesComputed = computed(() => Math.ceil(filteredList.value.length / PAGINATION.ADMIN_PER_PAGE))
const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * PAGINATION.ADMIN_PER_PAGE
  return filteredList.value.slice(start, start + PAGINATION.ADMIN_PER_PAGE)
})

watch([search, selectedCategory], () => { currentPage.value = 1 })

function confirmDelete(product: Product) {
  productToDelete.value = product
  deleteDialog.value = true
}

async function deleteProduct() {
  if (!productToDelete.value) return
  try {
    await $fetch(`/api/admin/products/${productToDelete.value.id}`, { method: 'DELETE' })
    allProducts.value = allProducts.value.filter(p => p.id !== productToDelete.value!.id)
  } catch {}
  deleteDialog.value = false
  productToDelete.value = null
}
</script>

<template>
  <v-container class="py-8">
    <div class="d-flex align-center justify-space-between mb-6">
      <h1 class="text-h4 font-weight-bold">Products</h1>
      <v-btn color="primary" prepend-icon="mdi-plus" to="/admin/products/new">Add Product</v-btn>
    </div>

    <!-- Filters -->
    <v-card variant="outlined" rounded="lg" class="mb-6">
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" md="5">
            <v-text-field v-model="search" placeholder="Search products..." variant="outlined" density="compact" hide-details prepend-inner-icon="mdi-magnify" clearable />
          </v-col>
          <v-col cols="12" md="4">
            <v-select v-model="selectedCategory" :items="categoryOptions" item-title="name" item-value="slug" placeholder="All Categories" variant="outlined" density="compact" hide-details clearable />
          </v-col>
          <v-col cols="12" md="3" class="text-right">
            <span class="text-body-2 text-grey">{{ filteredList.length }} products</span>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <!-- Table -->
    <v-card v-else variant="outlined" rounded="lg">
      <v-table density="comfortable">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Category</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in paginatedList" :key="product.id">
            <td><v-img :src="product.image" width="50" height="40" class="rounded" cover /></td>
            <td class="text-body-2 font-weight-medium" style="max-width: 300px">{{ product.title }}</td>
            <td><v-chip size="x-small" color="primary" variant="tonal">{{ product.category }}</v-chip></td>
            <td class="text-body-2 font-weight-bold">{{ formatPrice(product.price) }}</td>
            <td>
              <v-chip :color="product.status === 'published' ? 'success' : 'grey'" size="x-small" variant="tonal">
                {{ product.status }}
              </v-chip>
            </td>
            <td>
              <div class="d-flex ga-1">
                <v-btn icon variant="text" size="x-small" :to="`/admin/products/${product.id}`">
                  <v-icon size="18">mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon variant="text" size="x-small" color="error" @click="confirmDelete(product)">
                  <v-icon size="18">mdi-delete</v-icon>
                </v-btn>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- Pagination -->
    <div v-if="totalPagesComputed > 1" class="d-flex justify-center mt-6">
      <v-pagination v-model="currentPage" :length="totalPagesComputed" :total-visible="5" rounded="circle" color="primary" />
    </div>

    <!-- Delete Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card rounded="lg" class="pa-4">
        <v-card-title class="text-h6">Delete Product</v-card-title>
        <v-card-text>Are you sure you want to delete <strong>{{ productToDelete?.title }}</strong>?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" @click="deleteProduct">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped></style>
