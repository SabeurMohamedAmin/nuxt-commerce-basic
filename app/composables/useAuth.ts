export interface User {
  id: number
  name: string
  email: string
  purchasedProducts: number[]
}

const user = ref<User | null>(null)
const isAuthenticated = computed(() => !!user.value)

export function useAuth() {
  function login(email: string, _password: string) {
    user.value = {
      id: 1,
      name: email.split('@')[0],
      email,
      purchasedProducts: [],
    }
    return true
  }

  function logout() {
    user.value = null
    navigateTo('/')
  }

  function register(name: string, email: string, _password: string) {
    user.value = {
      id: 1,
      name,
      email,
      purchasedProducts: [],
    }
    return true
  }

  function addPurchasedProducts(productIds: number[]) {
    if (user.value) {
      const existing = new Set(user.value.purchasedProducts)
      productIds.forEach(id => existing.add(id))
      user.value.purchasedProducts = [...existing]
    }
  }

  function hasPurchased(productId: number) {
    return user.value?.purchasedProducts.includes(productId) ?? false
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    register,
    addPurchasedProducts,
    hasPurchased,
  }
}
