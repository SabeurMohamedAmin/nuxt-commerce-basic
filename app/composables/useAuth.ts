/**
 * Customer auth composable.
 * Uses nuxt-auth-utils useUserSession() for server-backed sessions.
 */
export function useAuth() {
  const { loggedIn, user, clear, fetch: fetchSession } = useUserSession()

  const isAuthenticated = computed(() => loggedIn.value && !!user.value)
  const hydrated = ref(true) // Always hydrated with server sessions

  async function login(email: string, password: string): Promise<true | string> {
    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail || !password) return 'Email and password are required'

    try {
      await $fetch('/auth/login', {
        method: 'POST',
        body: { email: cleanEmail, password },
      })
      await fetchSession()
      return true
    } catch (err: any) {
      return err?.data?.message || 'Invalid credentials'
    }
  }

  async function logout() {
    await clear()
    navigateTo('/')
  }

  async function register(name: string, email: string, password: string): Promise<true | string> {
    const cleanEmail = email.trim().toLowerCase()
    const cleanName = name.trim()
    if (!cleanName || !cleanEmail || !password) return 'All fields are required'

    try {
      await $fetch('/auth/register', {
        method: 'POST',
        body: { name: cleanName, email: cleanEmail, password },
      })
      await fetchSession()
      return true
    } catch (err: any) {
      return err?.data?.message || 'Registration failed'
    }
  }

  function hasPurchased(_productId: number): boolean {
    // TODO: check against server purchases
    return false
  }

  function addPurchasedProducts(_productIds: number[]) {
    // Handled server-side via orders/purchases API
  }

  return {
    user,
    isAuthenticated,
    hydrated,
    login,
    logout,
    register,
    hasPurchased,
    addPurchasedProducts,
  }
}
