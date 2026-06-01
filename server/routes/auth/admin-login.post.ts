import { checkLoginAttemptsAndAuthenticate } from '~~/server/utils/loginUtil'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)

  if (!email || !password) {
    throw createError({ statusCode: 400, message: 'Email and password are required.' })
  }

  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  const cleanEmail = email.trim().toLowerCase()

  const user = await checkLoginAttemptsAndAuthenticate(ip, cleanEmail, password)

  // Only allow admin role
  if (user.role !== 'admin') {
    throw createError({ statusCode: 401, message: 'Invalid admin credentials.' })
  }

  await setUserSession(event, { user })

  return user
})
