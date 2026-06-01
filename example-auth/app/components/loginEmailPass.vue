<script setup lang="ts">
// State
const form = ref({
  email: '',
  password: ''
})

const isLoading = ref(false)
const showPassword = ref(false)

// Emits to parent (smart component pattern)
const emit = defineEmits(['submit-email', 'handle-passkey'])

const handleEmailLogin = async () => {
  if (!form.value.email || !form.value.password) return
  
  isLoading.value = true
  // Simulate network delay or await actual action
  await new Promise(resolve => setTimeout(resolve, 800))
  
  emit('submit-email', { ...form.value })
  isLoading.value = false
}

</script>

<template>
  <div class="login-card">
    <div class="card-header">
      <h2>Login Section</h2>
      <p class="subtitle">Please enter your details to sign in.</p>
    </div>

    <!-- Email/Password Form -->
    <form @submit.prevent="handleEmailLogin" class="login-form">
      <div class="input-group">
        <label for="email">Email</label>
        <input 
          id="email" 
          v-model="form.email" 
          type="email" 
          placeholder="name@example.com" 
          required
        />
      </div>

      <div class="input-group">
        <label for="password">Password</label>
        <div class="password-wrapper">
          <input 
            id="password" 
            v-model="form.password" 
            :type="showPassword ? 'text' : 'password'" 
            placeholder="••••••••" 
            required
          />
          <button 
            type="button" 
            class="toggle-pass"
            @click="showPassword = !showPassword"
          >
            {{ showPassword ? 'Hide' : 'Show' }}
          </button>
        </div>
        <a href="#" class="forgot-link">Forgot password?</a>
      </div>

      <button type="submit" class="btn-primary" :disabled="isLoading">
        <span v-if="isLoading" class="loader"></span>
        <span v-else>Sign In</span>
      </button>
    </form>

    <!-- Divider -->
    <div class="divider">
      <span>or continue with</span>
    </div>

    <!-- OAuth Buttons -->
    <log-btn class="oauth-actions" @call-passkey="$emit('handle-passkey')"/>
  </div>
</template>

<style scoped>
/* CSS Variables for easy theming */
:root {
  --primary-color: #2563eb;
  --primary-hover: #1d4ed8;
  --bg-card: #ffffff;
  --text-main: #1e293b;
  --text-muted: #64748b;
  --border-color: #ccd2d9;
  --input-bg: #f8fafc;
  --radius: 12px;
}

.login-card {
  background: var(--bg-card);
  padding: 1.2rem;
  border-radius: var(--radius);
  width: 100%;
  max-width: 420px;
  margin: 5px auto;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
  border: 1px solid var(--border-color);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.card-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.card-header h2 {
  color: var(--text-main);
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.subtitle {
  color: var(--text-muted);
  font-size: 0.90rem;
  margin: 0;
}

/* Form Styling */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-main);
}

.input-group input {
  padding: 0.70rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background-color: var(--input-bg);
  font-size: 0.95rem;
  transition: all 0.2s ease;
  outline: none;
}

.input-group input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  background-color: #cbcbcb;
}

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper input {
  width: 100%;
  padding-right: 3.5rem; /* Space for show/hide button */
}

.toggle-pass {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.20rem;
}

.toggle-pass:hover {
  color: var(--text-main);
}

.forgot-link {
  font-size: 0.85rem;
  color: var(--primary-color);
  text-decoration: none;
  align-self: flex-end;
  margin-top: -0.25rem;
}

.forgot-link:hover {
  text-decoration: underline;
}

/* Primary Button */
.btn-primary {
  background-color: var(--primary-color);
  padding: 0.85rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #a4a4a4af;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.7rem 0;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--border-color);
}

.divider span {
  padding: 0 1rem;
}

/* OAuth Buttons */
.oauth-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

/* Simple Loader */
.loader {
  width: 20px;
  height: 20px;
  border: 2px solid #505050;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Mobile Responsiveness */
@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem;
    box-shadow: none;
    border: none;
  }
  
  .oauth-actions {
    grid-template-columns: 1fr;
  }
}
</style>
