import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          colors: {
            primary: '#1565C0',
            secondary: '#424242',
            accent: '#FF6F00',
            background: '#F5F7FA',
            surface: '#FFFFFF',
          },
        },
      },
    },
    icons: {
      defaultSet: 'mdi',
    },
  })

  app.vueApp.use(vuetify)
})
