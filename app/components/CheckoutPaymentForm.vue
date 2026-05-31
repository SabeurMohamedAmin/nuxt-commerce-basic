<script setup lang="ts">
import { COUNTRIES } from '~/constants'

defineProps<{ disabled: boolean }>()
const emit = defineEmits<{ pay: [] }>()

const { user } = useAuth()

const form = reactive({
  email: user.value?.email ?? '',
  cardNumber: '',
  expiry: '',
  cvc: '',
  cardholderName: '',
  country: 'France',
  saveInfo: false,
})
</script>

<template>
  <v-card flat variant="outlined" rounded="lg" class="pa-6">
    <h2 class="text-h6 font-weight-bold mb-6">Payment Details</h2>

    <v-text-field
      v-model="form.email"
      label="Email"
      type="email"
      variant="outlined"
      density="comfortable"
      class="mb-4"
    />

    <p class="text-body-2 font-weight-medium mb-2">Card Information</p>
    <v-text-field
      v-model="form.cardNumber"
      placeholder="1234 1234 1234 1234"
      variant="outlined"
      density="compact"
      class="mb-2"
    >
      <template #append-inner>
        <v-icon size="20" color="blue-darken-3">mdi-credit-card</v-icon>
      </template>
    </v-text-field>

    <v-row dense class="mb-4">
      <v-col cols="6">
        <v-text-field v-model="form.expiry" placeholder="MM / YY" variant="outlined" density="compact" />
      </v-col>
      <v-col cols="6">
        <v-text-field v-model="form.cvc" placeholder="CVC" variant="outlined" density="compact" />
      </v-col>
    </v-row>

    <v-text-field
      v-model="form.cardholderName"
      label="Cardholder Name"
      placeholder="Full name"
      variant="outlined"
      density="comfortable"
      class="mb-4"
    />

    <v-select
      v-model="form.country"
      :items="COUNTRIES"
      label="Country or region"
      variant="outlined"
      density="comfortable"
      class="mb-6"
    />

    <v-checkbox
      v-model="form.saveInfo"
      label="Save my information for faster checkout"
      density="compact"
      class="mb-6"
    />

    <v-btn block color="primary" size="x-large" :disabled="disabled" @click="emit('pay')">
      Pay
    </v-btn>

    <p class="text-caption text-grey text-center mt-4">Powered by Stripe • Secure payment</p>
  </v-card>
</template>

<style scoped></style>
