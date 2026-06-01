/**
 * Admin auth composable.
 * Uses nuxt-auth-utils useUserSession() for server-backed sessions.
 */
export function useAdminAuth() {
  const { loggedIn, user, clear, fetch: fetchSession } = useUserSession()

  const isAdminAuthenticated = computed(() =>
    loggedIn.value && user.value?.role === 'admin'
  )

  const admin = computed(() =>
    isAdminAuthenticated.value ? user.value : null
  )

  async function adminLogin(email: string, password: string): Promise<true | string> {
    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail || !password) return 'Email and password are required'

    try {
      await $fetch('/auth/admin-login', {
        method: 'POST',
        body: { email: cleanEmail, password },
      })
      await fetchSession()
      return true
    } catch (err: any) {
      return err?.data?.message || 'Invalid admin credentials'
    }
  }

  async function adminLogout() {
    await clear()
    navigateTo('/admin/login')
  }

  return {
    admin,
    isAdminAuthenticated,
    adminLogin,
    adminLogout,
  }
}
