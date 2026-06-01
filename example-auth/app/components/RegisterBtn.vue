<script setup lang="ts">
  const { loggedIn, clear, openInPopup } = useUserSession();
  const emit = defineEmits(['submit-register-passkey']);

  const handleLoginOauth = async(link:string)=>{
    openInPopup(link);    
  }

  watchEffect(async()=>{
    if(loggedIn.value){
      navigateTo('/', { replace: true})
    }
  })
</script>

<template>
  <div class="auth-container">
  <!-- Passkey Button (New) -->
  <button 
    type="button" class="social-btn passkey full-width-grid" 
    @click.prevent="emit('submit-register-passkey', $event)"
  >
    <div class="shimmer-effect"></div>
    <svg class="icon" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <!-- REPLACE THE OLD PATH LINE WITH THE NEW ONE BELOW -->
      <path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28zM3.5 9.72c-.1 0-.2-.03-.29-.09-.23-.16-.28-.47-.12-.7.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25.16.22.11.54-.12.7-.23.16-.54.11-.7-.12-.9-1.26-2.04-2.25-3.39-2.94-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.96-.08.14-.23.21-.39.21zm6.25 12.07c-.13 0-.26-.05-.35-.15-.87-.87-1.34-1.43-2.01-2.64-.69-1.23-1.05-2.73-1.05-4.34 0-2.97 2.54-5.39 5.66-5.39s5.66 2.42 5.66 5.39c0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-2.42-2.09-4.39-4.66-4.39-2.57 0-4.66 1.97-4.66 4.39 0 1.44.32 2.77.93 3.85.64 1.15 1.08 1.64 1.85 2.42.19.2.19.51 0 .71-.11.1-.24.15-.37.15zm7.17-1.85c-1.19 0-2.24-.3-3.1-.89-1.49-1.01-2.38-2.65-2.38-4.39 0-.28.22-.5.5-.5s.5.22.5.5c0 1.41.72 2.74 1.94 3.56.71.48 1.54.71 2.54.71.24 0 .64-.03 1.04-.1.27-.05.53.13.58.41.05.27-.13.53-.41.58-.57.11-1.07.12-1.21.12zM14.91 22c-.04 0-.09-.01-.13-.02-1.59-.44-2.63-1.03-3.72-2.1-1.4-1.39-2.17-3.24-2.17-5.22 0-1.62 1.38-2.94 3.08-2.94 1.7 0 3.08 1.32 3.08 2.94 0 1.07.93 1.94 2.08 1.94s2.08-.87 2.08-1.94c0-3.77-3.25-6.83-7.25-6.83-2.84 0-5.44 1.58-6.61 4.03-.39.81-.59 1.76-.59 2.8 0 .78.07 2.01.67 3.61.1.26-.03.55-.29.64-.26.1-.55-.03-.64-.29-.49-1.31-.73-2.61-.73-3.96 0-1.2.23-2.29.68-3.24 1.33-2.79 4.28-4.6 7.51-4.6 4.55 0 8.25 3.51 8.25 7.83 0 1.62-1.41 2.94-3.08 2.94s-3.08-1.32-3.08-2.94c0-1.07-.93-1.94-2.08-1.94s-2.08.87-2.08 1.94c0 1.71.66 3.31 1.87 4.51.95.94 1.86 1.46 3.27 1.85.27.07.42.35.35.61-.05.23-.26.38-.47.38z"/>
    </svg>
    <span>Register with a passkey</span>
  </button>


    <div class="divider full-width-grid"><span>or</span></div>

    <!-- Existing OAuth Links -->
    <nuxt-link @click.prevent="handleLoginOauth('/auth/github')" class="social-btn github">
      <svg class="icon" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
      <span>Register with GitHub</span>
    </nuxt-link>

    <nuxt-link @click.prevent="handleLoginOauth('/auth/facebook')" class="social-btn facebook">
      <svg class="icon" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
      <span>Register with Facebook</span>
    </nuxt-link>

    <nuxt-link @click.prevent="handleLoginOauth('/auth/google')" class="social-btn google">
      <svg class="icon" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
      </svg>
      <span>Register with Google</span>
    </nuxt-link>

    <nuxt-link @click.prevent="handleLoginOauth('/auth/microsoft')" class="social-btn microsoft">
      <svg class="icon" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
      </svg>
      <span>Register with Microsoft</span>
    </nuxt-link>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 320px;
  width: 100%;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}
.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 10px 16px;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  border-radius: 8px; /* Increased slightly for modern look */
  transition: all 0.2s ease;
  border: 1px solid transparent;
  box-sizing: border-box;
  cursor: pointer;
  position: relative;
  overflow: hidden; /* For shimmer effect */
}
/* --- Passkey Theme (Hero Button) --- */
.passkey {
  background-color: #ffffff;
  color: #111827;
  border: 1px solid #e5e7eb;
  font-weight: 600;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.passkey:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

/* Shimmer Animation for Passkey */
.shimmer-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to right,
    transparent 0%,
    rgba(255, 255, 255, 0.6) 50%,
    transparent 100%
  );
  transform: skewX(-20deg) translateX(-150%);
  animation: shimmer 3s infinite;
  pointer-events: none;
}

@keyframes shimmer {
  0% { transform: skewX(-20deg) translateX(-150%); }
  20% { transform: skewX(-20deg) translateX(150%); } /* Fast pass */
  100% { transform: skewX(-20deg) translateX(150%); } /* Long pause */
}

/* --- GitHub Theme --- */
.github {
  background-color: #24292e;
  color: #ffffff;
}
.github:hover {
  background-color: #2f363d;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.icon {
  flex-shrink: 0;
}


.passkey:active {
  transform: translateY(0);
  background-color: #f3f4f6;
}

/* Divider for visual separation */
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: #6b7280;
  font-size: 13px;
  margin: 4px 0;
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
.full-width-grid{
  grid-column: span 2;
}
/* GitHub Theme */
.github {
  background-color: #24292e;
  color: #ffffff;
}
.github:hover {
  background-color: #2f363d;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

/* Facebook Theme */
.facebook {
  background-color: #1877f2;
  color: #ffffff;
}
.facebook:hover {
  background-color: #166fe5;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(24, 119, 242, 0.2);
}

/* Google Theme */
.google {
  background-color: #ffffff; /* Changed to standard white for Google */
  color: #757575;
  border: 1px solid #dadce0;
}
.google:hover {
  background-color: #f8f9fa;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border-color: #dadce0;
}

/* Microsoft Theme */
.microsoft {
  background-color: #2f2f2f;
  color: #ffffff;
}
.microsoft:hover {
  background-color: #1a1a1a;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

/* Responsive tweak */
@media (max-width: 350px) {
  .social-btn {
    font-size: 14px;
    padding: 8px 12px;
  }
}
</style>
