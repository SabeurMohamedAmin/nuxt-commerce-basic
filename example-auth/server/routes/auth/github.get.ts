import { User } from "#auth-utils";
import { eq } from "drizzle-orm";

// server/routes/auth/github.get.ts

export default defineOAuthGitHubEventHandler({
  // CONFIG: Requests access to the user's email address explicitly
  config: { emailRequired: true },

  async onSuccess(event, { user, tokens }) {
    // 1. VALIDATION: Verify we received an email
    // GitHub allows users to keep emails private or use noreply addresses.
    if (!user.email) {
      throw createError({
        statusCode: 500,
        statusMessage: 'GitHub account must contain an email!',
        message: 'GitHub account must contain an email!'
      });
    }

    const database = useDb();

    // 2. LOOKUP: Check if this user is already in our system
    let existingUser = await database.query.users.findFirst({
      where: eq(schema.users.email, user.email)
    });

    // 3. REGISTRATION: Create user if they don't exist
    if (!existingUser) {
      const result = await database.insert(schema.users).values({
        name: user.name,
        login: user.name, // GitHub 'login' (username) or 'name' can be used here
        email: user.email
      }).returning();

      existingUser = result.at(0);
    }

    // 4. SANITY CHECK: Ensure we have a valid user object now
    if (!existingUser) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Authentication failed',
        message: 'Something went wrong with GitHub authentication. Try again!'
      });
    }

    // 5. SESSION: Prepare user data
    // Strip the password field (even if null) before setting the cookie
    const { password, ...withoutPassword } = existingUser;

    // 6. LOGIN: Create the session
    await setUserSession(event, {
      user: withoutPassword as User
    });

    return sendRedirect(event, '/');
  },

  onError(event, error) {
    console.error('GitHub OAuth error:', error);
    return sendRedirect(event, '/');
  }
});
