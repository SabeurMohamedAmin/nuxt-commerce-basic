import { eq } from 'drizzle-orm'
import { useDB } from '~~/server/database'
import { users } from '~~/server/database/schema'

export default defineOAuthMicrosoftEventHandler({
  config: {
    scope: ['User.Read'],
  },

  async onSuccess(event, { user: msUser }) {
    const email = msUser.mail || msUser.userPrincipalName

    if (!email) {
      throw createError({ statusCode: 500, message: 'Microsoft account must contain an email!' })
    }

    const db = useDB()

    let existingUser = await db.select().from(users).where(eq(users.email, email)).get()

    if (!existingUser) {
      const [created] = await db.insert(users).values({
        name: msUser.displayName || `${msUser.surname || ''} ${msUser.givenName || ''}`.trim(),
        email,
        password: '',
        role: 'customer',
        oauthProvider: 'microsoft',
        oauthId: msUser.id,
      }).returning()
      existingUser = created
    } else if (!existingUser.oauthProvider) {
      await db.update(users).set({
        oauthProvider: 'microsoft',
        oauthId: msUser.id,
      }).where(eq(users.id, existingUser.id))
    }

    if (!existingUser) {
      throw createError({ statusCode: 500, message: 'Authentication failed. Try again!' })
    }

    const { password: _, ...safeUser } = existingUser
    await setUserSession(event, { user: safeUser })

    return sendRedirect(event, '/account')
  },

  onError(event, error) {
    console.error('[OAuth Microsoft Error]', error)
    return sendRedirect(event, '/login?error=microsoft')
  },
})
