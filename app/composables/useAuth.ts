import type { User } from '~/types'
import { STORAGE_KEYS } from '~/constants'
import { getStoredItem, setStoredItem, removeStoredItem } from '~/utils/storage'

const user = ref<User | null>(null)
const isAuthenticated = computed(() => !!user.value)
const hydrated = ref(false)

export function useAuth() {
  // Hydrate once on client
  if (import.meta.client && !hydrated.value) {
    hydrated.value = true
    const stored = getStoredItem<User>(STORAGE_KEYS.USER_SESSION)
    if (stored) {
      user.value = stored
    }
  }

  function persistSession() {
    if (user.value) {
      setStoredItem(STORAGE_KEYS.USER_SESSION, user.value)
    } else {
      removeStoredItem(STORAGE_KEYS.USER_SESSION)
    }
  }

  function login(email: string, password: string): true | string {
    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail || !password) return 'Email and password are required'

    user.value = {
      id: 2,
      name: cleanEmail.split('@')[0],
      email: cleanEmail,
      purchasedProducts: [],
    }
    persistSession()
    return true
  }

  function logout() {
    user.value = null
    persistSession()
    navigateTo('/')
  }

  function register(name: string, email: string, password: string): true | string {
    const cleanEmail = email.trim().toLowerCase()
    const cleanName = name.trim()
    if (!cleanName || !cleanEmail || !password) return 'All fields are required'

    user.value = {
      id: 2,
      name: cleanName,
      email: cleanEmail,
      purchasedProducts: [],
    }
    persistSession()
    return true
  }

  function addPurchasedProducts(productIds: number[]) {
    if (!user.value) return

    const existing = new Set(user.value.purchasedProducts)
    productIds.forEach(id => existing.add(id))
    user.value.purchasedProducts = [...existing]
    persistSession()
  }

  function hasPurchased(productId: number): boolean {
    return user.value?.purchasedProducts.includes(productId) ?? false
  }

  return {
    user,
    isAuthenticated,
    hydrated,
    login,
    logout,
    register,
    addPurchasedProducts,
    hasPurchased,
  }
}
