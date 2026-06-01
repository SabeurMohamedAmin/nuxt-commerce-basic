import { User } from "#auth-utils";
import { eq } from "drizzle-orm";

/**
 * server/routes/auth/google.get.ts
 * 
 * OAuth callback route for Google sign-in.
 * 
 * STRATEGY:
 * 1. Authenticate via OpenID Connect (OIDC).
 * 2. Retrieve the immutable user ID and profile info.
 * 3. Sync with our database (Find or Create).
 * 4. Create a session and redirect home.
 */
export default defineOAuthGoogleEventHandler({
  config: {
    /**
     * SCOPES (Permissions):
     * - 'openid':  REQUIRED. Triggers OIDC to get an ID Token.
     * - 'email':   Access to the user's primary email address.
     * - 'profile': Access to basic info: name, picture, and locale.
     */
    scope: ['openid', 'email', 'profile']
  },

  async onSuccess(event, { user, tokens }) {
    // 1. VALIDATION: Ensure we have an email
    // Google almost always provides this with the 'email' scope, but it's good safety.
    if (!user.email) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Google account must contain an email!',
        message: 'Google account must contain an email!'
      })
    }

    const database = useDb();

    // 2. LOOKUP: Check if this user exists in our DB
    let existingUser = await database.query.users.findFirst({
      where: eq(schema.users.email, user.email)
    })

    // 3. REGISTRATION: Create user if they don't exist
    if (!existingUser) {
      const result = await database.insert(schema.users).values({
        name: user.name,
        // Using name as default login handle
        login: user.name, 
        email: user.email
      }).returning();

      existingUser = result.at(0);
    }

    // 4. SANITY CHECK: If retrieval/creation failed
    if (!existingUser) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Authentication failed',
        message: 'Something went wrong with Google authentication. Try again!'
      });
    }

    // 5. SESSION PREP: Remove sensitive data
    // Even though Google auth doesn't set a DB password, we strip the field to be safe.
    const { password, ...withoutPassword } = existingUser;

    /**
     * NOTE on 'user' object:
     * The `user` param above comes from the decoded Google ID Token.
     * It contains 'sub' (Subject), which is the unique, immutable Google User ID.
     * However, we use our own DB user object for the session.
     */
    await setUserSession(event, {
      user: withoutPassword as User
    });

    return sendRedirect(event, '/');
  },

  onError(event, error) {
    console.error('Google OAuth error:', error)
    return sendRedirect(event, '/');
  }
});
