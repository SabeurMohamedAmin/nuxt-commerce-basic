<template>
  <v-app-bar flat color="white" elevation="1">
    <v-container class="d-flex align-center">
      <!-- Logo -->
      <NuxtLink to="/" class="d-flex align-center text-decoration-none">
        <v-icon color="primary" size="28" class="mr-2">mdi-code-braces</v-icon>
        <span class="text-h6 font-weight-bold text-grey-darken-4">devclub.store</span>
      </NuxtLink>

      <v-spacer />

      <!-- Navigation -->
      <nav class="d-none d-md-flex align-center ga-4">
        <NuxtLink to="/products" class="text-body-2 text-grey-darken-3 text-decoration-none font-weight-medium">
          Products
        </NuxtLink>
        <v-menu>
          <template #activator="{ props }">
            <span v-bind="props" class="text-body-2 text-grey-darken-3 font-weight-medium cursor-pointer">
              Categories
              <v-icon size="16">mdi-chevron-down</v-icon>
            </span>
          </template>
          <v-list density="compact">
            <v-list-item
              v-for="cat in categories"
              :key="cat.slug"
              :to="`/products?category=${cat.slug}`"
            >
              <v-list-item-title>{{ cat.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </nav>

      <v-spacer />

      <!-- Actions -->
      <div class="d-flex align-center ga-1">
        <v-btn icon variant="text" size="small" to="/products">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-btn icon variant="text" size="small" @click="toggleCart">
          <v-badge :content="cartCount" :model-value="cartCount > 0" color="error" floating>
            <v-icon>mdi-cart-outline</v-icon>
          </v-badge>
        </v-btn>

        <template v-if="isAuthenticated">
          <v-btn icon variant="text" size="small" to="/account">
            <v-avatar color="orange" size="32">
              <span class="text-white text-body-2">{{ user?.name?.charAt(0).toUpperCase() }}</span>
            </v-avatar>
          </v-btn>
          <v-btn icon variant="text" size="small" @click="logout">
            <v-icon>mdi-logout</v-icon>
          </v-btn>
        </template>
        <template v-else>
          <v-btn variant="text" size="small" to="/login" class="text-body-2">
            Account
          </v-btn>
        </template>
      </div>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
const { user, isAuthenticated, logout } = useAuth()
const { cartCount, toggleCart } = useCart()

const categories = [
  { name: 'WordPress Themes', slug: 'wordpress-themes' },
  { name: 'Elementor Template Kits', slug: 'elementor-kits' },
  { name: 'Joomla Templates', slug: 'joomla-templates' },
  { name: 'Magento Themes', slug: 'magento-themes' },
  { name: 'Shopify Themes', slug: 'shopify-themes' },
  { name: 'PrestaShop Themes', slug: 'prestashop-themes' },
  { name: 'WordPress Plugins', slug: 'wordpress-plugins' },
  { name: 'HTML Templates', slug: 'html-templates' },
]
</script>
