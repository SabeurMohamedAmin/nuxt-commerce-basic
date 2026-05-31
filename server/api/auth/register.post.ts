import { eq } from 'drizzle-orm'
import { useDB } from '~~/server/database'
import { users } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, email, password } = body

  if (!name || !email || !password) {
    throw createError({ statusCode: 400, message: 'All fields are required' })
  }

  // Check if email already exists
  const existing = await useDB().select().from(users).where(eq(users.email, email)).get()
  if (existing) {
    throw createError({ statusCode: 409, message: 'Email already registered' })
  }

  const result = await useDB().insert(users).values({
    name,
    email,
    password,
    role: 'customer',
  }).returning()

  const user = result[0]
  const { password: _, ...safeUser } = user
  return safeUser
})
