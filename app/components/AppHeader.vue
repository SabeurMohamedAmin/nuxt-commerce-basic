<script setup lang="ts">
import { CATEGORIES } from '~/constants'

const { user, isAuthenticated, logout } = useAuth()
const { cartCount, toggleCart } = useCart()
const { isDark, toggleTheme } = useAppTheme()

const mobileDrawer = ref(false)

const userInitial = computed(() =>
  user.value?.name?.charAt(0).toUpperCase() ?? ''
)
</script>

<template>
  <v-app-bar flat :color="isDark ? 'grey-darken-4' : 'white'" elevation="1">
    <v-container class="d-flex align-center">
      <!-- Hamburger (mobile) -->
      <v-btn icon variant="text" size="small" class="d-md-none mr-2" @click="mobileDrawer = true">
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <!-- Logo -->
      <NuxtLink to="/" class="d-flex align-center text-decoration-none">
        <img src="/images/logo/image.png" alt="devclub.store" height="32" class="mr-2">
        <span class="text-h6 font-weight-bold d-none d-sm-inline">devclub.store</span>
      </NuxtLink>

      <v-spacer />

      <!-- Desktop Navigation -->
      <nav class="d-none d-md-flex align-center ga-4">
        <NuxtLink to="/products" class="text-body-2 text-decoration-none font-weight-medium">
          All Products
        </NuxtLink>
        <v-menu>
          <template #activator="{ props }">
            <span v-bind="props" class="text-body-2 font-weight-medium cursor-pointer">
              Categories
              <v-icon size="16">mdi-chevron-down</v-icon>
            </span>
          </template>
          <v-list density="compact">
            <v-list-item
              v-for="cat in CATEGORIES"
              :key="cat.slug"
              :to="`/products?category=${cat.slug}`"
            >
              <template #prepend>
                <v-icon size="18" class="mr-2">{{ cat.icon }}</v-icon>
              </template>
              <v-list-item-title>{{ cat.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </nav>

      <v-spacer />

      <!-- Actions -->
      <div class="d-flex align-center ga-1">
        <v-btn icon variant="text" size="small" @click="toggleTheme">
          <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
        </v-btn>

        <v-btn icon variant="text" size="small" to="/products" class="d-none d-sm-flex">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-btn icon variant="text" size="small" @click="toggleCart">
          <v-badge :content="cartCount" :model-value="cartCount > 0" color="error" floating>
            <v-icon>mdi-cart-outline</v-icon>
          </v-badge>
        </v-btn>

        <ClientOnly>
          <template v-if="isAuthenticated">
            <v-btn icon variant="text" size="small" to="/account">
              <v-avatar color="orange" size="32">
                <span class="text-white text-body-2">{{ userInitial }}</span>
              </v-avatar>
            </v-btn>
            <v-btn icon variant="text" size="small" class="d-none d-sm-flex" @click="logout">
              <v-icon>mdi-logout</v-icon>
            </v-btn>
          </template>
          <template v-else>
            <v-btn variant="text" size="small" to="/login" class="text-body-2 d-none d-sm-flex">
              Account
            </v-btn>
          </template>
        </ClientOnly>
      </div>
    </v-container>
  </v-app-bar>

  <!-- Mobile Side Drawer -->
  <ClientOnly>
    <v-navigation-drawer v-model="mobileDrawer" temporary location="left" width="280">
      <v-toolbar flat>
        <NuxtLink to="/" class="d-flex align-center text-decoration-none pa-4" @click="mobileDrawer = false">
          <img src="/images/logo/image.png" alt="devclub.store" height="28" class="mr-2">
          <span class="text-body-1 font-weight-bold">devclub.store</span>
        </NuxtLink>
      </v-toolbar>

      <v-list nav density="comfortable">
        <v-list-item to="/products" prepend-icon="mdi-view-grid" title="All Products" @click="mobileDrawer = false" />

        <v-list-subheader>Categories</v-list-subheader>
        <v-list-item
          v-for="cat in CATEGORIES"
          :key="cat.slug"
          :to="`/products?category=${cat.slug}`"
          :prepend-icon="cat.icon"
          :title="cat.name"
          @click="mobileDrawer = false"
        />
      </v-list>

      <v-divider class="my-2" />

      <v-list nav density="comfortable">
        <template v-if="isAuthenticated">
          <v-list-item to="/account" prepend-icon="mdi-account" title="My Account" @click="mobileDrawer = false" />
          <v-list-item prepend-icon="mdi-logout" title="Sign Out" @click="logout; mobileDrawer = false" />
        </template>
        <template v-else>
          <v-list-item to="/login" prepend-icon="mdi-login" title="Sign In" @click="mobileDrawer = false" />
          <v-list-item to="/register" prepend-icon="mdi-account-plus" title="Create Account" @click="mobileDrawer = false" />
        </template>
      </v-list>
    </v-navigation-drawer>
  </ClientOnly>
</template>

<style scoped></style>
