<script setup lang="ts">
import { products } from '~/data/products'
import { PAGINATION } from '~/constants'

const { user, isAuthenticated, hydrated, logout } = useAuth()

const activeTab = ref('library')
const librarySearch = ref('')
const libraryPage = ref(1)

const purchasedList = computed(() =>
  products.filter(p => user.value?.purchasedProducts.includes(p.id))
)

const filteredLibrary = computed(() => {
  let result = purchasedList.value
  if (librarySearch.value) {
    const q = librarySearch.value.toLowerCase()
    result = result.filter(p => p.title.toLowerCase().includes(q))
  }
  const start = (libraryPage.value - 1) * PAGINATION.LIBRARY_PER_PAGE
  return result.slice(start, start + PAGINATION.LIBRARY_PER_PAGE)
})

const libraryTotalPages = computed(() =>
  Math.ceil(purchasedList.value.length / PAGINATION.LIBRARY_PER_PAGE)
)
</script>

<template>
  <v-container class="py-8">
    <!-- Not logged in -->
    <template v-if="!hydrated">
      <!-- Waiting for session hydration -->
    </template>
    <template v-else-if="!isAuthenticated">
      <v-card class="mx-auto pa-8" max-width="400" flat variant="outlined" rounded="lg">
        <h1 class="text-h5 font-weight-bold text-center mb-4">Sign In Required</h1>
        <p class="text-body-2 text-grey text-center mb-6">Please sign in to access your account.</p>
        <v-btn block color="primary" to="/login">Sign In</v-btn>
      </v-card>
    </template>

    <!-- Logged in -->
    <template v-else>
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h4 font-weight-bold">My Account</h1>
          <p class="text-body-2 text-grey">Welcome, {{ user?.email }}</p>
        </div>
        <v-btn variant="text" color="error" @click="logout">Sign Out</v-btn>
      </div>

      <!-- Tabs -->
      <v-tabs v-model="activeTab" color="primary" class="mb-6">
        <v-tab value="library">My Library ({{ purchasedList.length }})</v-tab>
        <v-tab value="collections">My Collections</v-tab>
      </v-tabs>

      <!-- Search -->
      <v-text-field
        v-model="librarySearch"
        placeholder="Search your library..."
        variant="outlined"
        density="compact"
        hide-details
        prepend-inner-icon="mdi-magnify"
        class="mb-6"
        style="max-width: 300px"
      />

      <v-window v-model="activeTab">
        <!-- Library -->
        <v-window-item value="library">
          <template v-if="purchasedList.length">
            <v-row>
              <v-col
                v-for="product in filteredLibrary"
                :key="product.id"
                cols="12"
                sm="6"
                md="4"
                lg="3"
              >
                <v-card variant="outlined" rounded="lg" class="h-100">
                  <v-img :src="product.image" :alt="product.title" height="160" cover />
                  <v-card-text class="pb-2">
                    <p class="text-body-2 font-weight-medium library-title">
                      {{ product.title.toUpperCase() }}
                    </p>
                  </v-card-text>
                  <v-card-actions class="px-4 pb-4 pt-0">
                    <v-btn block color="primary" variant="flat" size="small" prepend-icon="mdi-download">
                      Download
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>

            <div v-if="libraryTotalPages > 1" class="d-flex justify-center mt-8">
              <v-pagination
                v-model="libraryPage"
                :length="libraryTotalPages"
                :total-visible="5"
                rounded="circle"
                color="primary"
              />
            </div>
          </template>

          <v-card v-else flat class="text-center py-12">
            <v-icon size="48" color="grey-lighten-1">mdi-package-variant</v-icon>
            <p class="text-body-1 text-grey mt-4">No purchases yet</p>
            <p class="text-body-2 text-grey mb-4">Products you buy will appear here for unlimited downloads</p>
            <v-btn color="primary" variant="outlined" to="/products">Browse Products</v-btn>
          </v-card>
        </v-window-item>

        <!-- Collections -->
        <v-window-item value="collections">
          <v-card flat class="text-center py-12">
            <v-icon size="48" color="grey-lighten-1">mdi-bookmark-outline</v-icon>
            <p class="text-body-1 text-grey mt-4">No collections yet</p>
            <p class="text-body-2 text-grey">Save products to collections for easy access</p>
          </v-card>
        </v-window-item>
      </v-window>
    </template>
  </v-container>
</template>

<style scoped>
.library-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 40px;
}
</style>
