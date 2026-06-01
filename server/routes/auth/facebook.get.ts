import { eq } from 'drizzle-orm'
import { useDB } from '~~/server/database'
import { users } from '~~/server/database/schema'

export default defineOAuthFacebookEventHandler({
  async onSuccess(event, { tokens }) {
    // Get user data from Facebook
    const fbUser = await $fetch('https://graph.facebook.com/me', {
      params: {
        access_token: tokens.access_token,
        fields: 'id,name,email',
      },
    })

    // Check email exists
    console.log('Facebook user', fbUser)
    if (!fbUser.email) {
      console.error('[OAuth Facebook] No email returned')
      return sendRedirect(event, '/login?error=facebook_no_email')
    }

    const db = useDB()
    // Check if user exists
    let existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, fbUser.email))
      .get()

    // Create user if not found
    if (!existingUser) {
      const result = await db.insert(users).values({
        name: fbUser.name || fbUser.email.split('@')[0],
        email: fbUser.email,
        password: '',
        role: 'customer',
        oauthProvider: 'facebook',
        oauthId: String(fbUser.id),
      }).returning()

      existingUser = result[0]
    }

    // Link OAuth if user exists but no provider set
    if (existingUser && !existingUser.oauthProvider) {
      await db.update(users).set({
        oauthProvider: 'facebook',
        oauthId: String(fbUser.id),
      }).where(eq(users.id, existingUser.id))
    }

    // Check we have a user
    if (!existingUser) {
      return sendRedirect(event, '/login?error=facebook')
    }

    // Create session (remove password from session data)
    const { password, ...safeUser } = existingUser

    await setUserSession(event, { user: safeUser })

    return sendRedirect(event, '/account')
  },

  onError(event, error) {
    console.error('[OAuth Facebook Error]', error)
    return sendRedirect(event, '/login?error=facebook')
  },
})
