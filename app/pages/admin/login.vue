<script setup lang="ts">
definePageMeta({ layout: false })

const { adminLogin } = useAdminAuth()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  if (!email.value || !password.value) return
  error.value = ''
  loading.value = true
  await new Promise(r => setTimeout(r, 500))
  const result = adminLogin(email.value, password.value)
  loading.value = false

  if (result === true) {
    navigateTo('/admin')
  } else {
    error.value = result as string
  }
}
</script>

<template>
  <v-app>
    <v-main class="bg-grey-darken-4 d-flex align-center justify-center" style="min-height: 100vh">
      <v-card class="pa-8" max-width="420" width="100%" rounded="xl" flat>
        <div class="text-center mb-6">
          <v-avatar color="primary" size="56" class="mb-3">
            <v-icon color="white" size="28">mdi-shield-lock</v-icon>
          </v-avatar>
          <h1 class="text-h5 font-weight-bold">Admin Panel</h1>
          <p class="text-body-2 text-grey">Sign in to manage your store</p>
        </div>

        <v-form @submit.prevent="handleLogin">
          <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mb-4">
            {{ error }}
          </v-alert>

          <v-text-field
            v-model="email"
            label="Admin Email"
            type="email"
            variant="outlined"
            density="comfortable"
            class="mb-3"
            prepend-inner-icon="mdi-email-outline"
            :rules="[v => !!v || 'Email is required']"
          />
          <v-text-field
            v-model="password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            variant="outlined"
            density="comfortable"
            class="mb-4"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            :rules="[v => !!v || 'Password is required']"
            @click:append-inner="showPassword = !showPassword"
          />

          <v-btn block color="primary" size="large" type="submit" :loading="loading">
            <v-icon start>mdi-login</v-icon>
            Sign In
          </v-btn>
        </v-form>

        <v-divider class="my-6" />

        <div class="text-center">
          <v-btn variant="text" size="small" color="grey" to="/">
            <v-icon start>mdi-arrow-left</v-icon>
            Back to Store
          </v-btn>
        </div>
      </v-card>
    </v-main>
  </v-app>
</template>

<style scoped></style>
