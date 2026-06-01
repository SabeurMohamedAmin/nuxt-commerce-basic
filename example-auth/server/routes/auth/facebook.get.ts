import { User } from "#auth-utils";
import { eq } from "drizzle-orm";

export default defineOAuthFacebookEventHandler({
  async onSuccess(event, { tokens }) {
    
    // 1. FETCH: Manually get user data from Facebook Graph API
    // We must explicitly ask for 'email' in the 'fields' param.
    const user: User = await $fetch('https://graph.facebook.com/me', {
      params: {
        access_token: tokens.access_token,
        fields: 'id,name,email'
      }
    });

    // 2. VALIDATION: Check for email presence
    // Facebook allows phone-only signups, so email is not guaranteed.
    if (!user.email) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Facebook account must contain an email!',
        message: 'Facebook account must contain an email!'
      });
    };

    const database = useDb();

    // 3. LOOKUP: Check if the user exists in our DB
    let existingUser = await database.query.users.findFirst({
      where: eq(schema.users.email, user.email)
    });

    // 4. REGISTRATION: Create new user if missing
    if (!existingUser) {
      const result = await database.insert(schema.users).values({
        name: user.name,
        login: user.name,
        email: user.email
      }).returning();

      existingUser = result.at(0);
    }

    // 5. SANITY CHECK: Ensure we have a valid user record
    if (!existingUser) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Authentication failed',
        message: 'Something went wrong with Facebook authentication. Try again!'
      });
    }

    // 6. SESSION: Strip sensitive data before saving
    const { password, ...withoutPassword } = existingUser;

    // 7. LOGIN: Create session cookie
    await setUserSession(event, {
      user: withoutPassword as User
    });

    return sendRedirect(event, '/');
  },

  onError(event, error) {
    console.error('Facebook OAuth error:', error);
    return sendRedirect(event, '/');
  }
})
