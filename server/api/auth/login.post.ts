import { eq } from 'drizzle-orm'
import { useDB } from '~~/server/database'
import { users } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({ statusCode: 400, message: 'Email and password are required' })
  }

  const user = await useDB().select().from(users).where(eq(users.email, email)).get()

  if (!user || user.password !== password) {
    throw createError({ statusCode: 401, message: 'Invalid credentials' })
  }

  // Don't allow admin login through customer endpoint
  if (user.role === 'admin') {
    throw createError({ statusCode: 401, message: 'Invalid credentials' })
  }

  const { password: _, ...safeUser } = user
  return safeUser
})
