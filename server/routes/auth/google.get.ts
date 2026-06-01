import { eq } from 'drizzle-orm'
import { useDB } from '~~/server/database'
import { users } from '~~/server/database/schema'

export default defineOAuthGoogleEventHandler({
  config: {
    scope: ['openid', 'email', 'profile'],
  },

  async onSuccess(event, { user: googleUser }) {
    if (!googleUser.email) {
      throw createError({ statusCode: 500, message: 'Google account must contain an email!' })
    }

    const db = useDB()

    // Find or create user
    let existingUser = await db.select().from(users).where(eq(users.email, googleUser.email)).get()

    if (!existingUser) {
      const [created] = await db.insert(users).values({
        name: googleUser.name || googleUser.email.split('@')[0],
        email: googleUser.email,
        password: '',
        role: 'customer',
        oauthProvider: 'google',
        oauthId: googleUser.sub,
        avatar: googleUser.picture,
      }).returning()
      existingUser = created
    } else {
      // Link OAuth if not already linked
      if (!existingUser.oauthProvider) {
        await db.update(users).set({
          oauthProvider: 'google',
          oauthId: googleUser.sub,
          avatar: googleUser.picture || existingUser.avatar,
        }).where(eq(users.id, existingUser.id))
      }
    }

    if (!existingUser) {
      throw createError({ statusCode: 500, message: 'Authentication failed. Try again!' })
    }

    const { password: _, ...safeUser } = existingUser
    await setUserSession(event, { user: safeUser })

    return sendRedirect(event, '/account')
  },

  onError(event, error) {
    console.error('[OAuth Google Error]', error)
    return sendRedirect(event, '/login?error=google')
  },
})
