import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  runtimeConfig: {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    oauth: {
      google: {
        clientId: process.env.OAUTH_GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET || '',
      },
      facebook: {
        clientId: process.env.OAUTH_FACEBOOK_CLIENT_ID || '',
        clientSecret: process.env.OAUTH_FACEBOOK_CLIENT_SECRET || '',
        scope: ['email', 'public_profile'],
      },
      microsoft: {
        clientId: process.env.OAUTH_MICROSOFT_CLIENT_ID || '',
        clientSecret: process.env.OAUTH_MICROSOFT_CLIENT_SECRET || '',
        tenant: process.env.OAUTH_MICROSOFT_TENANT || 'common',
      },
    },
    public: {
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY || '',
      baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    },
  },

  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/i18n',
    'nuxt-auth-utils',
    'nuxt-swiper',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        config.plugins!.push(vuetify({ autoImport: true }))
      })
    },
  ],

  css: [
    'vuetify/styles',
  ],

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  build: {
    transpile: ['vuetify'],
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [
        { rel: 'icon', type: 'image/png', href: '/images/logo/image.png' },
      ],
      meta: [
        { name: 'description', content: 'Digital products marketplace - WordPress themes, plugins, and templates. Buy once, download anytime.' },
      ],
    },
  },

  i18n: {
    locales: [
      { code: 'en', name: 'English' },
      { code: 'fr', name: 'Français' },
    ],
    defaultLocale: 'en',
    strategy: 'no_prefix',
  },
})
