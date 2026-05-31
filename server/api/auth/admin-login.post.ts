import { eq, and } from 'drizzle-orm'
import { useDB } from '~~/server/database'
import { users } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({ statusCode: 400, message: 'Email and password are required' })
  }

  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.email, email), eq(users.role, 'admin')))
    .get()

  if (!user || user.password !== password) {
    throw createError({ statusCode: 401, message: 'Invalid admin credentials' })
  }

  const { password: _, ...safeUser } = user
  return safeUser
})
