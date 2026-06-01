import { User } from "#auth-utils";
import { eq } from "drizzle-orm";

/**
 * server/routes/auth/microsoft.get.ts
 * 
 * OAuth callback route for Microsoft (Azure AD).
 * 
 * STRATEGY:
 * 1. Authenticate using minimal permissions.
 * 2. Verify email presence (crucial for our DB).
 * 3. Find existing user OR create a new one.
 * 4. Establish session and redirect home.
 */
export default defineOAuthMicrosoftEventHandler({
  config: {
    /**
     * SCOPE: ['User.Read']
     * Grants access ONLY to the signed-in user's profile (ID, name, email).
     * We avoid 'User.Read.All' to prevent admin consent issues.
     */
    scope: ['User.Read']
  },

  async onSuccess(event, { user, tokens }) {
    // 1. VALIDATION: Ensure we actually got an email back
    // Microsoft accounts can sometimes lack this field depending on privacy settings.
    if (!user.mail) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Microsoft account must contain an email!',
        message: 'Microsoft account must contain an email!'
      });
    };

    const database = useDb();

    // 2. LOOKUP: Check if this user has logged in before
    let existingUser = await database.query.users.findFirst({
      where: eq(schema.users.email, user.mail)
    });

    // 3. REGISTRATION: Create user if they don't exist
    if (!existingUser) {
      const result = await database.insert(schema.users).values({
        // Constructing a full name from parts
        name: `${user.surname} ${user.givenName}`,
        login: user.displayName,
        email: user.mail
      }).returning();

      existingUser = result.at(0);
    }

    // 4. SANITY CHECK: If we still don't have a user, something broke upstream
    if (!existingUser) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Authentication failed',
        message: 'Something went wrong with Microsoft authentication. Try again!'
      })
    }

    // 5. SESSION: Strip sensitive data
    // We remove 'password' even if it's null/empty for OAuth users, just to be safe.
    const { password, ...withoutPassword } = existingUser;

    // 6. LOGIN: Create the session cookie
    await setUserSession(event, {
      user: withoutPassword as User
    })

    return sendRedirect(event, '/');
  },

  onError(event, error) {
    console.error('Microsoft OAuth error:', error);
    return sendRedirect(event, '/');
  }
});
