export default defineNuxtConfig({
  // Sets the compatibility date for Nuxt features (ensures forward-compatibility with future updates)
  compatibilityDate: '2025-07-15',
  
  // Enables Nuxt DevTools for better debugging and inspection in development
  devtools: { enabled: true },
  
  // Runtime configuration available at runtime (e.g., for server-side use)
  runtimeConfig: {
    // OAuth provider configurations (loaded from env vars like OAUTH_GITHUB_CLIENT_ID)
    oauth: {
      // provider in lowercase (github, google, etc.)
      github: {
        clientId: '',      // GitHub OAuth Client ID (set via env)
        clientSecret: '',  // GitHub OAuth Client Secret (set via env)
      },
      facebook: {
        clientId: '',      // Facebook OAuth Client ID
        clientSecret: ''   // Facebook OAuth Client Secret
      },
      microsoft: {
        clientId: '',      // Microsoft OAuth Client ID
        clientSecret: ''   // Microsoft OAuth Client Secret
      },
      google: {
        clientId: '',      // Google OAuth Client ID
        clientSecret: ''   // Google OAuth Client Secret
      },
      x: {
        clientId: '',      // X (Twitter) OAuth Client ID
        clientSecret: ''   // X (Twitter) OAuth Client Secret
      }
    }
  },
  
  // Auth module configuration (specific to nuxt-auth-utils)
  auth:{
    // Enables WebAuthn (Passkeys) for biometric/secure authentication
    webAuthn: true
  },
  
  // Nuxt modules to include (nuxt-auth-utils for auth, @nuxt/eslint for linting)
  modules: ['nuxt-auth-utils', '@nuxt/eslint']
})