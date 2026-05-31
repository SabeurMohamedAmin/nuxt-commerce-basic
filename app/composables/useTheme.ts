import { useTheme as useVuetifyTheme } from 'vuetify'

type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'theme_mode'

export function useAppTheme() {
  const vuetifyTheme = useVuetifyTheme()
  const isDark = computed(() => vuetifyTheme.global.current.value.dark)

  // Hydrate from sessionStorage on first use
  if (import.meta.client) {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY) as ThemeMode | null
      if (stored && (stored === 'dark' || stored === 'light')) {
        vuetifyTheme.change(stored)
      }
    } catch {}
  }

  function toggleTheme() {
    const newTheme: ThemeMode = isDark.value ? 'light' : 'dark'
    vuetifyTheme.change(newTheme)
    if (import.meta.client) {
      try { sessionStorage.setItem(STORAGE_KEY, newTheme) } catch {}
    }
  }

  function setTheme(mode: ThemeMode) {
    vuetifyTheme.global.name.value = mode
    if (import.meta.client) {
      try { sessionStorage.setItem(STORAGE_KEY, mode) } catch {}
    }
  }

  return {
    isDark,
    toggleTheme,
    setTheme,
  }
}
