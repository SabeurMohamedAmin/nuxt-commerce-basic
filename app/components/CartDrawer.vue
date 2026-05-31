<script setup lang="ts">
import { formatPrice } from '~/utils/format'

const { cartItems, cartOpen, cartCount, cartTotal, removeFromCart } = useCart()
</script>

<template>
  <v-navigation-drawer v-model="cartOpen" location="right" temporary width="360">
    <v-toolbar flat>
      <v-toolbar-title class="text-body-1 font-weight-bold">
        Shopping Cart ({{ cartCount }})
      </v-toolbar-title>
      <v-btn icon variant="text" @click="cartOpen = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-list v-if="cartItems.length">
      <v-list-item v-for="item in cartItems" :key="item.id" class="py-3">
        <template #prepend>
          <v-img :src="item.image" width="60" height="60" class="rounded mr-3" cover />
        </template>
        <v-list-item-title class="text-body-2">{{ item.title }}</v-list-item-title>
        <v-list-item-subtitle class="text-primary font-weight-bold">
          {{ formatPrice(item.price) }}
        </v-list-item-subtitle>
        <template #append>
          <v-btn icon variant="text" size="x-small" @click="removeFromCart(item.id)">
            <v-icon size="18">mdi-delete-outline</v-icon>
          </v-btn>
        </template>
      </v-list-item>
    </v-list>

    <v-container v-else class="text-center py-12">
      <v-icon size="48" color="grey-lighten-1">mdi-cart-outline</v-icon>
      <p class="text-body-2 text-grey mt-2">Your cart is empty</p>
    </v-container>

    <template #append>
      <div v-if="cartItems.length" class="pa-4 border-t">
        <div class="d-flex justify-space-between mb-3">
          <span class="text-body-1 font-weight-bold">Total</span>
          <span class="text-body-1 font-weight-bold">{{ formatPrice(cartTotal) }}</span>
        </div>
        <v-btn block color="primary" size="large" to="/checkout" @click="cartOpen = false">
          Checkout
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<style scoped></style>
