<script setup lang="ts">
definePageMeta({ middleware: 'guest' })

const { register } = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

async function handleRegister() {
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }
  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }

  error.value = ''
  loading.value = true
  const result = await register(name.value, email.value, password.value)
  loading.value = false

  if (result === true) {
    navigateTo('/account')
  } else {
    error.value = result
  }
}
</script>

<template>
  <v-container class="py-12">
    <v-card class="mx-auto pa-8" max-width="420" flat variant="outlined" rounded="lg">
      <div class="text-center mb-6">
        <img src="/images/logo/image.png" alt="devclub.store" height="40" class="mb-2">
        <h1 class="text-h5 font-weight-bold">Create Account</h1>
        <p class="text-body-2 text-grey">Join and access premium digital products</p>
      </div>

      <!-- OAuth Buttons -->
      <div class="d-flex flex-column ga-2 mb-6">
        <v-btn
          variant="outlined"
          block
          size="large"
          href="/auth/google"
          prepend-icon="mdi-google"
          class="text-none"
        >
          Sign up with Google
        </v-btn>
        <v-btn
          variant="outlined"
          block
          size="large"
          href="/auth/facebook"
          prepend-icon="mdi-facebook"
          class="text-none"
          color="blue-darken-3"
        >
          Sign up with Facebook
        </v-btn>
        <v-btn
          variant="outlined"
          block
          size="large"
          href="/auth/microsoft"
          prepend-icon="mdi-microsoft"
          class="text-none"
          color="blue-darken-1"
        >
          Sign up with Microsoft
        </v-btn>
      </div>

      <!-- Divider -->
      <div class="d-flex align-center ga-3 mb-6">
        <v-divider />
        <span class="text-body-2 text-grey">or</span>
        <v-divider />
      </div>

      <!-- Email/Password Form -->
      <v-form @submit.prevent="handleRegister">
        <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mb-4">
          {{ error }}
        </v-alert>

        <v-text-field v-model="name" label="Full Name" variant="outlined" density="comfortable" class="mb-3" />
        <v-text-field v-model="email" label="Email" type="email" variant="outlined" density="comfortable" class="mb-3" />
        <v-text-field
          v-model="password"
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          variant="outlined"
          density="comfortable"
          class="mb-3"
          hint="Minimum 6 characters"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showPassword = !showPassword"
        />
        <v-text-field
          v-model="confirmPassword"
          label="Confirm Password"
          :type="showPassword ? 'text' : 'password'"
          variant="outlined"
          density="comfortable"
          class="mb-4"
        />

        <v-btn block color="primary" size="large" type="submit" :loading="loading">
          Create Account
        </v-btn>
      </v-form>

      <v-divider class="my-6" />

      <p class="text-body-2 text-center text-grey">
        Already have an account?
        <NuxtLink to="/login" class="text-primary text-decoration-none font-weight-medium">Sign In</NuxtLink>
      </p>
    </v-card>
  </v-container>
</template>

<style scoped></style>
