export default defineNuxtRouteMiddleware(() => {
  // Skip on server — localStorage isn't available there
  if (import.meta.server) return

  const { isAdminAuthenticated } = useAdminAuth()

  if (!isAdminAuthenticated.value) {
    return navigateTo('/admin/login')
  }
})
