<script setup lang="ts">
const route = useRoute()
const { addPurchasedProducts } = useAuth()
const { clearCart } = useCart()

const verified = ref(false)
const verifyError = ref('')
const orderDetails = ref<{ email: string; amount: number; productIds: number[] } | null>(null)

onMounted(async () => {
  const sessionId = route.query.session_id as string

  if (!sessionId) {
    verifyError.value = 'No session found'
    return
  }

  try {
    const data = await $fetch('/api/checkout/verify', {
      params: { session_id: sessionId },
    })

    orderDetails.value = data
    addPurchasedProducts(data.productIds)
    clearCart()
    verified.value = true
  } catch {
    verifyError.value = 'Could not verify payment. Please contact support.'
  }
})
</script>

<template>
  <v-container class="py-12">
    <!-- Success -->
    <v-card v-if="verified" class="mx-auto pa-8 text-center" max-width="500" flat variant="outlined" rounded="xl">
      <v-icon size="64" color="success" class="mb-4">mdi-check-circle</v-icon>
      <h1 class="text-h5 font-weight-bold mb-2">Payment Successful!</h1>
      <p class="text-body-1 text-grey mb-6">
        Your purchase is complete. You can now download your products from your library.
      </p>

      <v-card v-if="orderDetails" variant="tonal" color="success" class="pa-4 mb-6 text-left" rounded="lg">
        <p class="text-body-2"><strong>Email:</strong> {{ orderDetails.email }}</p>
        <p class="text-body-2"><strong>Amount paid:</strong> ${{ orderDetails.amount.toFixed(2) }}</p>
        <p class="text-body-2"><strong>Products:</strong> {{ orderDetails.productIds.length }} item(s)</p>
      </v-card>

      <div class="d-flex flex-column ga-3">
        <v-btn color="primary" size="large" to="/account" block>
          <v-icon start>mdi-download</v-icon>
          Go to My Library
        </v-btn>
        <v-btn variant="outlined" to="/products" block>
          Continue Shopping
        </v-btn>
      </div>
    </v-card>

    <!-- Error -->
    <v-card v-else-if="verifyError" class="mx-auto pa-8 text-center" max-width="500" flat variant="outlined" rounded="xl">
      <v-icon size="64" color="warning" class="mb-4">mdi-alert-circle</v-icon>
      <h1 class="text-h5 font-weight-bold mb-2">Verification Issue</h1>
      <p class="text-body-1 text-grey mb-6">{{ verifyError }}</p>
      <v-btn color="primary" to="/account">Go to My Account</v-btn>
    </v-card>

    <!-- Loading -->
    <div v-else class="text-center py-12">
      <v-progress-circular indeterminate color="primary" size="48" />
      <p class="text-body-1 text-grey mt-4">Verifying your payment...</p>
    </div>
  </v-container>
</template>

<style scoped></style>
