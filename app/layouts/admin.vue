<script setup lang="ts">
import { ADMIN_NAV_ITEMS } from '~/constants'

const { admin, adminLogout } = useAdminAuth()
</script>

<template>
  <v-app>
    <v-navigation-drawer permanent color="grey-darken-4" width="260">
      <div class="pa-4">
        <NuxtLink to="/admin" class="d-flex align-center text-decoration-none mb-6">
          <v-icon color="primary" size="28" class="mr-2">mdi-code-braces</v-icon>
          <span class="text-h6 font-weight-bold text-white">Admin Panel</span>
        </NuxtLink>
      </div>

      <v-list nav density="comfortable" color="primary">
        <v-list-item
          v-for="item in ADMIN_NAV_ITEMS"
          :key="item.to"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          class="text-grey-lighten-2"
        />
      </v-list>

      <template #append>
        <div class="pa-4">
          <div class="d-flex align-center ga-2 mb-4 px-2">
            <v-avatar color="primary" size="32">
              <v-icon size="18" color="white">mdi-shield-account</v-icon>
            </v-avatar>
            <span class="text-body-2 text-grey-lighten-1">{{ admin?.email }}</span>
          </div>
          <v-divider color="grey-darken-2" class="mb-4" />
          <v-btn block variant="outlined" color="grey-lighten-1" prepend-icon="mdi-logout" class="mb-2" @click="adminLogout">
            Sign Out
          </v-btn>
          <v-btn block variant="text" color="grey-lighten-1" prepend-icon="mdi-arrow-left" to="/">
            Back to Store
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>

<style scoped></style>
