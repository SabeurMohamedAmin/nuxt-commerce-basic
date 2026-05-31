import type { AdminUser } from '~/types'
import { STORAGE_KEYS } from '~/constants'
import { getStoredItem, setStoredItem, removeStoredItem } from '~/utils/storage'

const ADMIN_EMAIL = 'aminsab@outlook.fr'
const ADMIN_PASSWORD = '123456'

const admin = ref<AdminUser | null>(null)
const isAdminAuthenticated = computed(() => !!admin.value)

function hydrateSession() {
  if (import.meta.client && !admin.value) {
    admin.value = getStoredItem<AdminUser>(STORAGE_KEYS.ADMIN_SESSION)
  }
}

function persistSession() {
  if (admin.value) {
    setStoredItem(STORAGE_KEYS.ADMIN_SESSION, admin.value)
  } else {
    removeStoredItem(STORAGE_KEYS.ADMIN_SESSION)
  }
}

export function useAdminAuth() {
  hydrateSession()

  function adminLogin(email: string, password: string): true | string {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      admin.value = {
        id: 1,
        name: 'Admin',
        email: ADMIN_EMAIL,
      }
      persistSession()
      return true
    }
    return 'Invalid admin credentials'
  }

  function adminLogout() {
    admin.value = null
    persistSession()
    navigateTo('/admin/login')
  }

  return {
    admin: readonly(admin),
    isAdminAuthenticated,
    adminLogin,
    adminLogout,
  }
}
