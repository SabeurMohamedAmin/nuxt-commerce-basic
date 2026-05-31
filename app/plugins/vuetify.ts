import { createVuetify } from 'vuetify'
import { THEME_COLORS } from '~/constants'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          colors: { ...THEME_COLORS },
        },
        dark: {
          dark: true,
          colors: {
            primary: '#42A5F5',
            secondary: '#B0BEC5',
            accent: '#FFB74D',
            background: '#121212',
            surface: '#1E1E1E',
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
