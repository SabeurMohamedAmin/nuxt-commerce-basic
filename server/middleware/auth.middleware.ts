/**
 * Server middleware that protects /admin and /api/admin routes.
 * Requires a valid user session with admin role.
 */
export default defineEventHandler(async (event) => {
  const path = event.path

  // Only protect admin routes
  if (!path.startsWith('/api/admin') && !path.startsWith('/admin')) {
    return
  }

  // Skip the admin login route itself
  if (path === '/api/auth/admin-login' || path === '/admin/login') {
    return
  }

  // Require authenticated session
  const session = await getUserSession(event)

  if (!session?.user) {
    throw createError({ statusCode: 401, message: 'Authentication required.' })
  }

  if (session.user.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Admin access required.' })
  }
})
