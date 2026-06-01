/**
 * Client middleware: redirects authenticated users away from login/register.
 */
export default defineNuxtRouteMiddleware((to, from) => {
  const { loggedIn } = useUserSession()

  if (loggedIn.value) {
    if (from.path === to.path) {
      return navigateTo('/', { replace: true })
    }
    return navigateTo(from.path, { replace: true })
  }
})
