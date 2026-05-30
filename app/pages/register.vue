<template>
  <v-container class="py-12">
    <v-card class="mx-auto pa-8" max-width="420" flat variant="outlined" rounded="lg">
      <div class="text-center mb-6">
        <v-icon color="primary" size="40" class="mb-2">mdi-code-braces</v-icon>
        <h1 class="text-h5 font-weight-bold">Create Account</h1>
        <p class="text-body-2 text-grey">Join and access premium digital products</p>
      </div>

      <v-form @submit.prevent="handleRegister">
        <v-text-field
          v-model="name"
          label="Full Name"
          variant="outlined"
          density="comfortable"
          class="mb-3"
        />
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
          class="mb-3"
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
        <NuxtLink to="/login" class="text-primary text-decoration-none font-weight-medium">
          Sign In
        </NuxtLink>
      </p>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
const { register } = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const loading = ref(false)

async function handleRegister() {
  if (!name.value || !email.value || !password.value) return
  loading.value = true
  await new Promise(r => setTimeout(r, 500))
  register(name.value, email.value, password.value)
  loading.value = false
  navigateTo('/account')
}
</script>
