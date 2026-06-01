/**
 * Client middleware: redirects non-admin users to admin login.
 */
export default defineNuxtRouteMiddleware(() => {
  const { loggedIn, user } = useUserSession()

  if (!loggedIn.value || !user.value) {
    return navigateTo('/admin/login', { replace: true })
  }

  if (user.value.role !== 'admin') {
    return navigateTo('/', { replace: true })
  }
})
