<script setup lang="ts"></script>

<template>
  <v-container class="py-12">
    <v-card class="mx-auto pa-8 text-center" max-width="500" flat variant="outlined" rounded="xl">
      <v-icon size="64" color="grey" class="mb-4">mdi-cart-remove</v-icon>
      <h1 class="text-h5 font-weight-bold mb-2">Payment Cancelled</h1>
      <p class="text-body-1 text-grey mb-6">
        Your payment was cancelled. No charges were made. Your cart items are still saved.
      </p>

      <div class="d-flex flex-column ga-3">
        <v-btn color="primary" size="large" to="/checkout" block>
          <v-icon start>mdi-arrow-left</v-icon>
          Return to Checkout
        </v-btn>
        <v-btn variant="outlined" to="/products" block>
          Continue Shopping
        </v-btn>
      </div>
    </v-card>
  </v-container>
</template>

<style scoped></style>
