<script setup lang="ts">
import type { CartItem } from '~/types'
import { formatPrice } from '~/utils/format'

defineProps<{
  items: readonly CartItem[]
  total: number
}>()
</script>

<template>
  <div class="bg-primary rounded-xl pa-8 text-white">
    <h2 class="text-h6 font-weight-medium mb-2">Order Summary</h2>

    <template v-if="items.length">
      <v-list bg-color="transparent" class="pa-0">
        <v-list-item v-for="item in items" :key="item.id" class="px-0 text-white">
          <template #prepend>
            <v-img :src="item.image" width="50" height="50" class="rounded mr-3" cover />
          </template>
          <v-list-item-title class="text-body-2 text-white">{{ item.title }}</v-list-item-title>
          <v-list-item-subtitle class="text-white-darken-1">
            {{ formatPrice(item.price) }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>

      <v-divider color="white" class="my-4" opacity="0.3" />

      <div class="d-flex justify-space-between">
        <span class="text-h6">Total</span>
        <span class="text-h5 font-weight-bold">{{ formatPrice(total) }}</span>
      </div>
    </template>

    <template v-else>
      <p class="text-body-2 text-white-darken-1">Your cart is empty</p>
      <v-btn color="white" variant="outlined" class="mt-4" to="/products">Browse Products</v-btn>
    </template>
  </div>
</template>

<style scoped></style>
