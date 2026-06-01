import { eq } from 'drizzle-orm'
import bcrypt from 'bcrypt'
import { useDB } from '~~/server/database'
import { users } from '~~/server/database/schema'

const SALT_ROUNDS = 12

/**
 * Checks if an email is already taken. Throws 400 if duplicate.
 */
export async function throwErrorIfUserExists(email: string) {
  const existing = await useDB().select().from(users).where(eq(users.email, email)).get()

  if (existing) {
    throw createError({
      statusCode: 400,
      message: 'Email already exists. Please login!',
    })
  }
}

/**
 * Creates a new user account with hashed password.
 */
export async function registerUser(name: string, email: string, password: string) {
  await throwErrorIfUserExists(email)

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

  const [newUser] = await useDB().insert(users).values({
    name,
    email,
    password: hashedPassword,
    role: 'customer',
  }).returning()

  if (!newUser) {
    throw createError({ statusCode: 500, message: 'Registration failed. Please try again!' })
  }

  return newUser
}
