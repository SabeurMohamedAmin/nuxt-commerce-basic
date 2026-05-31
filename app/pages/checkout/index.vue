<script setup lang="ts">
import { formatPrice } from '~/utils/format'

const { cartItems, cartTotal } = useCart()
const { user } = useAuth()
const { checkout, loading, error } = useStripeCheckout()

async function handlePayment() {
  await checkout(cartItems.value, user.value?.email)
}

definePageMeta({ layout: false })
</script>

<template>
  <div>
    <!-- Header -->
    <div class="bg-primary">
      <v-container class="py-6">
        <div class="d-flex align-center ga-3">
          <v-btn icon variant="text" color="white" to="/products">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <img src="/images/logo/image.png" alt="devclub.store" height="28">
          <span class="text-h6 text-white font-weight-bold">devclub.store</span>
        </div>
      </v-container>
    </div>

    <v-container class="py-8">
      <v-row>
        <!-- Order Summary -->
        <v-col cols="12" md="5" order="2" order-md="1">
          <div class="bg-primary rounded-xl pa-8 text-white">
            <h2 class="text-h6 font-weight-medium mb-4">Order Summary</h2>

            <template v-if="cartItems.length">
              <v-list bg-color="transparent" class="pa-0">
                <v-list-item v-for="item in cartItems" :key="item.id" class="px-0 text-white">
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
                <span class="text-h5 font-weight-bold">{{ formatPrice(cartTotal) }}</span>
              </div>
            </template>

            <template v-else>
              <p class="text-body-2 text-white-darken-1">Your cart is empty</p>
              <v-btn color="white" variant="outlined" class="mt-4" to="/products">
                Browse Products
              </v-btn>
            </template>
          </div>
        </v-col>

        <!-- Payment -->
        <v-col cols="12" md="7" order="1" order-md="2">
          <v-card flat variant="outlined" rounded="lg" class="pa-6">
            <h2 class="text-h6 font-weight-bold mb-4">Secure Checkout</h2>

            <p class="text-body-2 text-grey mb-6">
              You'll be redirected to Stripe's secure payment page to complete your purchase.
            </p>

            <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
              {{ error }}
            </v-alert>

            <div class="d-flex align-center ga-2 mb-6">
              <v-icon color="success" size="20">mdi-shield-check</v-icon>
              <span class="text-body-2 text-grey">256-bit SSL encrypted payment</span>
            </div>

            <div class="d-flex align-center ga-2 mb-6">
              <v-icon color="primary" size="20">mdi-credit-card-outline</v-icon>
              <span class="text-body-2 text-grey">Visa, Mastercard, Amex, and more accepted</span>
            </div>

            <div class="d-flex align-center ga-2 mb-8">
              <v-icon color="primary" size="20">mdi-download</v-icon>
              <span class="text-body-2 text-grey">Instant access after payment — unlimited downloads</span>
            </div>

            <v-btn
              block
              color="primary"
              size="x-large"
              :disabled="!cartItems.length"
              :loading="loading"
              @click="handlePayment"
            >
              <v-icon start>mdi-lock</v-icon>
              Pay {{ formatPrice(cartTotal) }} with Stripe
            </v-btn>

            <p class="text-caption text-grey text-center mt-4">
              Powered by Stripe • Secure payment
            </p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped></style>
