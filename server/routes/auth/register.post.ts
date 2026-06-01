import { registerUser } from '~~/server/utils/registerUtil'

export default defineEventHandler(async (event) => {
  const { name, email, password } = await readBody(event)

  if (!name || !email || !password) {
    throw createError({ statusCode: 400, message: 'All fields are required.' })
  }

  if (password.length < 6) {
    throw createError({ statusCode: 400, message: 'Password must be at least 6 characters.' })
  }

  const cleanEmail = email.trim().toLowerCase()
  const cleanName = name.trim()

  const user = await registerUser(cleanName, cleanEmail, password)

  const { password: _, ...safeUser } = user

  await setUserSession(event, { user: safeUser })

  return safeUser
})
