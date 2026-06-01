import { eq } from "drizzle-orm";


/**
 * WebAuthn registration handler
 * -Supports two main flows:
 * 1) First-time registration with a passkey (no existing user, no session)
 * 2) Adding a passkey to an existing, logged-in account
 * - Enforces that you cannot attach a passkey to a *different* email
 * than the one in the current session.
 * 
 * 
 **/ 

export default defineWebAuthnRegisterEventHandler({
  /**
   * 
   * 
   * Runs before the WebAuthn ceremony is finalized.
   * Responsible for:
   * - Checking session/email consistency
   * - Enforcing "must be logged in to add passkey to existing account"
   * - Normalizing and validating user data (email + name)
   **/
  validateUser: async (user, event) => {
    
    // If the user is already logged in, check if the email matches the session.
    // This supports adding a passkey to an existing account while preventing
    // attaching a passkey to some other user's email.
    const session = await getUserSession(event);
    
    if (session.user?.email && session.user.email !== user.userName) {
      // Logged-in user but provided email does not match session email:
      // Do not allow registering a passkey for another account.
      throw createError({
        statusCode: 400,
        message: "Email not matching curent session",
        statusMessage:
          "Provide the same email as is on your account to add a passkey.",
      });
    }

    // Look up an existing user in the DB by email.
    // If found, this represents the "existing account" path.
    const existingUser = await useDb().query.users.findFirst({
      where: eq(schema.users.email, user.userName),
    });

    // If there *is* an existing user in the DB but there is *no* active session,
    // force the user to log in before adding a passkey to that account.
    // This prevents silently attaching a passkey to someone else's account
    // when not authenticated.
    if (!session?.user && existingUser) {
      throw createError({
        statusCode: 400,
        statusMessage: "Please login to add a passkey to your account.",
      });
    }

    // Prepare the object to validate (either existing DB user or incoming user input):
    // - If existingUser exists, use that as the source of truth and normalize userName.
    // - Otherwise, rely on the incoming `user` object.
    const userData = existingUser
      ? {
          ...existingUser,
          // Ensure userName property exists and matches email for consistency
          // with the incoming WebAuthn user object.
          userName: existingUser.email,
        }
      : user;

    // --- REPLACEMENT FOR ZOD ---
    // Manual validation instead of using a schema library like Zod.

    // 1. Check if userName exists and is a string
    if (!userData.userName || typeof userData.userName !== "string") {
      throw createError({ statusCode: 400, statusMessage: "Invalid Username" });
    }
    
    // 2. Simple Email Regex Validation
    // Ensures userName has a basic email format before writing to the DB
    // or using it as an identifier.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.userName)) {
      throw createError({ statusCode: 400, statusMessage: "Invalid Email Format" });
    }

    // 3. Check Name
    // - Ensure `name` exists and is a string.
    // - If missing (e.g. simple registration), derive a default from the email
    //   (the part before '@') to keep `name` non-null in the DB.
    if (!userData.name || typeof userData.name !== "string") {
      // If name is missing (e.g. simple registration), default it or throw error
      // Here we default it to the part before '@' if missing, or throw
      userData.name = userData.name || userData.userName.split("@")[0];
    }
    // ---------------------------

    // At this point:
    // - userData.userName is a valid email string
    // - userData.name is a non-empty string
    // - For existing users, userData also contains the DB row fields (id, etc.)
    return userData;
  },

  // Runs after the WebAuthn registration succeeds on the client.
  // Responsible for:
  // - Upserting the user in the `users` table
  // - Storing the new WebAuthn credential in `credentials`
  // - Updating the user session
  async onSuccess(event, { user, credential }) {
    const db = useDb();

    // Insert the newly registered user into the database.
    // If the user already exists (same id), this becomes an upsert via
    // .onConflictDoUpdate below.
    const dbUser = await db
      .insert(schema.users)
      .values({
        // For new users, user.id can be undefined; DB auto-increment handles it.
        // For existing users, user.id should already be set from validateUser.
        id: user.id,
        email: user.userName,
        login: user.userName,
        name: user.name,
      })
      .onConflictDoUpdate({
        // Use `id` as the conflict target: if a row with the same id exists,
        // update only selected fields instead of inserting a duplicate.
        target: schema.users.id,
        set: {
          name: user.name,
          email: user.userName,
        },
      })
      // Return the final DB user row after insert/upsert.
      .returning()
      .get();

    // Insert the credential into the database.
    // This ties the WebAuthn credential to the user via userId and stores
    // all the data necessary to verify future authentications.
    await db.insert(schema.credentials).values({
      userId: dbUser.id,
      id: credential.id,
      publicKey: credential.publicKey,
      counter: credential.counter,
      backedUp: credential.backedUp,
      transports: credential.transports,
    });

    // Set the user session.
    // Strip `password` from the user object before storing it in the session
    // to avoid leaking password hashes into session data.
    const { password: stash, ...userWithoutPassword } = dbUser;
    await setUserSession(event, {
      user: userWithoutPassword,
    });
  },
});
