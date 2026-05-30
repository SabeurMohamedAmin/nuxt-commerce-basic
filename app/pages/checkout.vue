<template>
  <div>
    <!-- Checkout Header -->
    <div class="bg-primary">
      <v-container class="py-6">
        <div class="d-flex align-center ga-3">
          <v-btn icon variant="text" color="white" to="/products">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-icon color="white" size="28">mdi-code-braces</v-icon>
          <span class="text-h6 text-white font-weight-bold">devclub.store</span>
        </div>
      </v-container>
    </div>

    <v-container class="py-8">
      <v-row>
        <!-- Order Summary (left on desktop) -->
        <v-col cols="12" md="5" order="2" order-md="1">
          <div class="bg-primary rounded-xl pa-8 text-white">
            <h2 class="text-h6 font-weight-medium mb-2">Order Summary</h2>

            <template v-if="cartItems.length">
              <v-list bg-color="transparent" class="pa-0">
                <v-list-item
                  v-for="item in cartItems"
                  :key="item.id"
                  class="px-0 text-white"
                >
                  <template #prepend>
                    <v-img :src="item.image" width="50" height="50" class="rounded mr-3" cover />
                  </template>
                  <v-list-item-title class="text-body-2 text-white">{{ item.title }}</v-list-item-title>
                  <v-list-item-subtitle class="text-white-darken-1">${{ item.price.toFixed(2) }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>

              <v-divider color="white" class="my-4" opacity="0.3" />

              <div class="d-flex justify-space-between">
                <span class="text-h6">Total</span>
                <span class="text-h5 font-weight-bold">${{ cartTotal.toFixed(2) }}</span>
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

        <!-- Payment Form (right on desktop) -->
        <v-col cols="12" md="7" order="1" order-md="2">
          <v-card flat variant="outlined" rounded="lg" class="pa-6">
            <h2 class="text-h6 font-weight-bold mb-6">Payment Details</h2>

            <!-- Email -->
            <v-text-field
              v-model="email"
              label="Email"
              type="email"
              variant="outlined"
              density="comfortable"
              class="mb-4"
            />

            <!-- Card Info -->
            <p class="text-body-2 font-weight-medium mb-2">Card Information</p>
            <v-text-field
              v-model="cardNumber"
              placeholder="1234 1234 1234 1234"
              variant="outlined"
              density="compact"
              class="mb-2"
            >
              <template #append-inner>
                <div class="d-flex ga-1">
                  <v-icon size="20" color="blue-darken-3">mdi-credit-card</v-icon>
                </div>
              </template>
            </v-text-field>

            <v-row dense class="mb-4">
              <v-col cols="6">
                <v-text-field
                  v-model="expiry"
                  placeholder="MM / YY"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="cvc"
                  placeholder="CVC"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
            </v-row>

            <!-- Cardholder Name -->
            <v-text-field
              v-model="cardholderName"
              label="Cardholder Name"
              placeholder="Full name"
              variant="outlined"
              density="comfortable"
              class="mb-4"
            />

            <!-- Country -->
            <v-select
              v-model="country"
              :items="countries"
              label="Country or region"
              variant="outlined"
              density="comfortable"
              class="mb-6"
            />

            <!-- Save info checkbox -->
            <v-checkbox
              v-model="saveInfo"
              label="Save my information for faster checkout"
              density="compact"
              class="mb-6"
            />

            <!-- Pay Button -->
            <v-btn
              block
              color="primary"
              size="x-large"
              :disabled="!cartItems.length"
              @click="handlePayment"
            >
              Pay ${{ cartTotal.toFixed(2) }}
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

<script setup lang="ts">
const { cartItems, cartTotal, clearCart } = useCart()
const { user, addPurchasedProducts } = useAuth()

const email = ref(user.value?.email || '')
const cardNumber = ref('')
const expiry = ref('')
const cvc = ref('')
const cardholderName = ref('')
const country = ref('France')
const saveInfo = ref(false)

const countries = ['France', 'United States', 'United Kingdom', 'Germany', 'Canada', 'Algeria']

function handlePayment() {
  // Add purchased products to user's library
  const purchasedIds = cartItems.value.map(item => item.id)
  addPurchasedProducts(purchasedIds)
  clearCart()
  navigateTo('/account')
}

definePageMeta({
  layout: false,
})
</script>
