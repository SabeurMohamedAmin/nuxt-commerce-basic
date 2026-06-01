<script setup lang="ts">
definePageMeta({ middleware: 'guest' })

const { login } = useAuth()
const route = useRoute()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

// Check for OAuth error from redirect
if (route.query.error) {
  const errorMessages: Record<string, string> = {
    facebook: 'Facebook login failed. Please try again.',
    facebook_no_email: 'No email address is linked to your Facebook account. Please sign in with email and password, or use a different sign-in method.',
    google: 'Google login failed. Please try again.',
    microsoft: 'Microsoft login failed. Please try again.',
  }
  error.value = errorMessages[route.query.error as string] || 'Login failed. Please try again.'
}

async function handleLogin() {
  if (!email.value || !password.value) return
  error.value = ''
  loading.value = true
  const result = await login(email.value, password.value)
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
        <h1 class="text-h5 font-weight-bold">Sign In</h1>
        <p class="text-body-2 text-grey">Access your account and downloads</p>
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
          Continue with Google
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
          Continue with Facebook
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
          Continue with Microsoft
        </v-btn>
      </div>

      <!-- Divider -->
      <div class="d-flex align-center ga-3 mb-6">
        <v-divider />
        <span class="text-body-2 text-grey">or</span>
        <v-divider />
      </div>

      <!-- Email/Password Form -->
      <v-form @submit.prevent="handleLogin">
        <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mb-4">
          {{ error }}
        </v-alert>

        <v-text-field
          v-model="email"
          label="Email"
          type="email"
          variant="outlined"
          density="comfortable"
          class="mb-3"
        />
        <v-text-field
          v-model="password"
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          variant="outlined"
          density="comfortable"
          class="mb-4"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showPassword = !showPassword"
        />

        <v-btn block color="primary" size="large" type="submit" :loading="loading">
          Sign In
        </v-btn>
      </v-form>

      <v-divider class="my-6" />

      <p class="text-body-2 text-center text-grey">
        Don't have an account?
        <NuxtLink to="/register" class="text-primary text-decoration-none font-weight-medium">Sign Up</NuxtLink>
      </p>
    </v-card>
  </v-container>
</template>

<style scoped></style>
