<script setup lang="ts">
  const { loggedIn, clear } = useUserSession();
  const logOut = async()=>{
    await clear();
    navigateTo('/login')
  }
</script>

<template>
  <nav class="navbar">
    <div class="nav-container">
      <!-- Logo / Brand Area -->
      <div class="brand">
        <NuxtLink to="/" class="logo-link">
          <span class="logo-text">Guelma<span class="highlight">History</span></span>
        </NuxtLink>
      </div>

      <!-- Navigation Links -->
      <div class="nav-links">
        <NuxtLink to="/" class="nav-item">Home</NuxtLink>
        <NuxtLink v-if="loggedIn" to="/admin" class="nav-item">Admin</NuxtLink>
        
        <!-- Right Side Actions -->
        <div class="auth-action">
          <NuxtLink v-if="!loggedIn" to="/login" class="btn-login">
            Sign In
          </NuxtLink>
          <NuxtLink v-if="!loggedIn" to="/register" class="btn-login">
            Register
          </NuxtLink>
          
          <div v-else class="user-menu">
            <button @click="logOut" class="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* 1. Base Navbar Styling (Glassmorphism) */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 80%;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  z-index: 1000;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* 2. Container for Flex Layout */
.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 3. Brand / Logo Styling */
.logo-link {
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  letter-spacing: -0.5px;
}

.highlight {
  color: #3b82f6;
}

/* 4. Navigation Links Area */
.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-item {
  text-decoration: none;
  color: #555;
  font-weight: 500;
  font-size: 0.95rem;
  position: relative;
  transition: color 0.3s ease;
}

.nav-item:hover {
  color: #3b82f6;
}

.nav-item.router-link-active {
  color: #3b82f6;
}

/* 5. Active & Hover Underline Animation */
.nav-item::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -4px;
  left: 0;
  background-color: #3b82f6;
  transition: width 0.3s ease;
}

.nav-item:hover::after,
.nav-item.router-link-active::after {
  width: 100%;
}

/* 6. Button Styling (Login/Logout) */
.btn-login, 
.btn-logout {
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  border: none;
  margin-left: 0.25rem;
  margin-right: 0.25rem;
}

/* Login Button - Outline Style */
.btn-login {
  border: 1.5px solid #e5e7eb;
  background: transparent;
  color: #333;
}

.btn-login:hover {
  border-color: #3b82f6;
  background: #3b82f6;
  color: #fff;
}

/* Active state for login/register buttons */
.btn-login.router-link-active {
  border-color: #3b82f6;
  background: #3b82f6;
  color: #fff;
}

.btn-login.router-link-active:hover {
  border-color: #2563eb;
  background: #2563eb;
  color: #fff;
  transform: translateY(-1px);
}

/* Logout Button - Soft Red Style */
.btn-logout {
  background: #fee2e2;
  color: #ef4444;
}

.btn-logout:hover {
  background: #fecaca;
  color: #dc2626;
  transform: translateY(-1px);
}
</style>
