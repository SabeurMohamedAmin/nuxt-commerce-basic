import { eq } from "drizzle-orm";

/**
 * WebAuthn Authentication Event Handler
 * 
 * This handler manages the server-side ceremony for logging in a user via Passkeys/WebAuthn.
 * It interacts with the Drizzle ORM database and the Nuxt storage layer.
 */
export default defineWebAuthnAuthenticateEventHandler({

  // --------------------------------------------------------------------------
  // Step 1: Allow Credentials
  // --------------------------------------------------------------------------
  // This method is called when the authentication ceremony starts (e.g., user types email).
  // Its job is to tell the browser *which* specific keys are allowed for this user.
  async allowCredentials(event, userName){

    const database = useDb();

    // Retrieve the user and their registered credentials based on the input email (userName).
    const user = await database.query.users.findFirst({
      where: eq(schema.users.email, userName),
      with:{
        credentials: true
      }
    });

    /*
     * UX OPTIMIZATION:
     * If we find the user, we return their specific credential IDs.
     * 
     * Why? 
     * 1. Security: Limits login attempts to known devices for this account.
     * 2. UX: The browser will instantly recognize the correct passkey provider 
     *    and prompt for that specific one, rather than asking the user to select 
     *    from a potentially long list of all passkeys they own.
     */
    return user?.credentials || [];
  },

  // --------------------------------------------------------------------------
  // Step 2: Get Credential
  // --------------------------------------------------------------------------
  // This runs after the user successfully authenticates with their device (TouchID, Hello, etc.).
  // The browser sends back a credential ID, and we need to verify it exists in our DB.
  async getCredential(event, credentialId){

  // 1. Look for the credential in our database to verify ownership.
    const database = useDb();

    // We fetch the credential AND the associated user data because we'll need the user 
    // info later for the session.
    const credential = await database.query.credentials.findFirst({
      where: eq(schema.credentials.id, credentialId),
      with:{ user: true }
    });

    // If credential is not found, there is no account to log in to.
    // This acts as a guard clause against spoofed or stale IDs.
    if(!credential){
      throw createError({
        statusCode: 404,
        statusMessage: 'Credentials not found.'
      })
    };

    return credential;
  },

  /*
   * --------------------------------------------------------------------------
   * Step 3: Challenge Management (Replay Attack Protection)
   * --------------------------------------------------------------------------
   * WebAuthn uses a "challenge" (a random string) sent to the client and signed 
   * by the private key. We must store this server-side to verify the signature later.
   */
  
  /*
   * IMPORTANT Webauthn uses challenges to prevent replay attacks.
   * By default, this module does not make use if this feature.
   * If you want to use challenges (which is highly recommended),
   * the storeChallenge and getChallenge functions are provided
   */
  async storeChallenge(event, challenge, attemptId) {
    // Store the challenge in a KV store or DB
    // We use unstorage here (via useStorage) for ephemeral storage.
    // 'attemptId' creates a unique key for this specific login flow.
    await useStorage().setItem(`attempt:${attemptId}`, challenge)
  },

  async getChallenge(event, attemptId) {
    // Retrieve the challenge we stored earlier to verify the signature.
    const challenge = await useStorage().getItem<string>(`attempt:${attemptId}`)

    // SECURITY CRITICAL: 
    // Make sure to always remove the attempt because they are single use only!
    // If we didn't remove it, an attacker who intercepted the challenge could 
    // potentially replay the login sequence.
    await useStorage().removeItem(`attempt:${attemptId}`)

    if (!challenge)
      throw createError({ statusCode: 400, message: 'Challenge expired' })

    return challenge
  },

  // --------------------------------------------------------------------------
  // Step 4: On Success
  // --------------------------------------------------------------------------
  // The 'final boss' of the auth flow. If we reach here, the crypto verification 
  // passed, the challenge was valid, and the user is who they say they are.
  async onSuccess(event, {credential}){
    // the credential authentication has been successful.
    // set the user session.

    // Destructure to separate the sensitive password hash ('stash') from the rest of the user data.
    // Even though we logged in via WebAuthn, we ensure the password hash never touches the session.
    const {password: stash , ...userWithoutPassword} = credential.user;

    // Create the actual session cookie/token for the user.
    await setUserSession(event, {
      user: userWithoutPassword,
    })
  }
});