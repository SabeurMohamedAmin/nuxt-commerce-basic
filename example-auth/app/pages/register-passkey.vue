<script setup lang="ts">

  definePageMeta({
    middleware:['guest']
  });
  
  const {fetch} = useUserSession();
  const {register} = useWebAuthn({ 
    registerEndpoint: "/auth/webauthn/register"
  });
  const isLoading = ref(false);
  // State management
  const form = ref({
    name: '',
    email: ''
  });

  const handleRegisterPasskey = async ()=>{
    isLoading.value = true
    try {
      await register({
        userName: form.value.email,
        name: form.value.name
      });
      fetch()
    } catch (error) {
      
    }
    finally{
      isLoading.value = false;
    }
  }

</script>

<template>
  <div class="auth-card">
    <div class="card-header">
      <h2>Register Account</h2>
      <p class="subtitle">to register Using Passkey.</p>
    </div>

    <form @submit.prevent="handleRegisterPasskey" class="auth-form">
      
      <!-- Full Name -->
      <div class="input-group">
        <label for="fullname">Full Name</label>
        <input 
          required
          id="fullname" 
          type="text" 
          v-model="form.name" 
          placeholder="John Doe" 
        />
      </div>

      <!-- Email -->
      <div class="input-group">
        <label for="reg-email">Email</label>
        <input 
          id="reg-email" 
          v-model="form.email" 
          type="email" 
          placeholder="name@mail.com" 
          required
        />
      </div>

      <!-- Validation Message -->
      <button type="submit" class="btn-primary" :disabled="isLoading">
        <span v-if="isLoading" class="loader"></span>
        <span v-else>Register</span>
      </button>
    </form>

    <div class="divider">
      <span>or</span>
    </div>
    <div class="footer-text">
      Already have an account? 
      <nuxt-link to="/login">
        Log in
      </nuxt-link>
    </div>
  </div>
</template>

<style scoped>
/* Reusing the same variable system for consistency */
:root {
  --primary-color: #2563eb;
  --primary-hover: #bababa;
  --bg-card: #ffffff;
  --text-main: #1e293b;
  --text-muted: #64748b;
  --border-color: #b7bcc1;
  --input-bg: #f8fafc;
  --error-color: #ef4444;
  --radius: 12px;
}

.auth-card {
  background: var(--bg-card);
  padding: 2.5rem;
  border-radius: var(--radius);
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
  border: 2px solid var(--border-color);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.card-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.card-header h2 {
  color: var(--text-main);
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.subtitle {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin: 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-row {
  display: flex;
  gap: 1rem;
}

.input-row .input-group {
  flex: 1;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.input-group label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-main);
}

.input-group input {
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background-color: var(--input-bg);
  font-size: 0.95rem;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box; /* Important for inputs in flex rows */
}

.input-group input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  background-color: #fff;
  outline: none;
}

.input-group input.input-error {
  border-color: var(--error-color);
  background-color: #fff5f5;
}

.error-message {
  color: var(--error-color);
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #fef2f2;
  padding: 0.5rem;
  border-radius: 6px;
}

.btn-primary {
  background-color: var(--primary-color);
  color: #505050;
  padding: 0.875rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 4px solid #6f6f6f81;
}

.btn-primary:hover {
  background-color: #dededea4;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
/* Divider for visual separation */
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: #6b7280;
  font-size: 13px;
  margin: 10px auto;
  width: 80%;
}
.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e5e7eb;
}
.divider span {
  padding: 0 10px;
}

.oauth-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.btn-oauth {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-weight: 500;
  color: var(--text-main);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-oauth:hover {
  background-color: #f8fafc;
  border-color: #cbd5e1;
}

.footer-text {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.footer-text a {
  color: var(--primary-color);
  font-weight: 600;
  text-decoration: none;
}

.footer-text a:hover {
  text-decoration: underline;
}

/* Loader Animation */
.loader {
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 480px) {
  .auth-card {
    padding: 1.5rem;
    box-shadow: none;
    border: none;
  }
  .oauth-actions {
    grid-template-columns: 1fr;
  }
  /* Stack password inputs on very small screens */
  .input-row {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
