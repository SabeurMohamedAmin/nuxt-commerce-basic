export default defineEventHandler(async (event) => {
  // 1. INPUT: Read credentials from the request body
  const { email, password } = await readBody(event);

  // 2. VALIDATION: Fail fast if data is incomplete
  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required field or fields to login.',
      message: 'Missing required field or fields to login.'
    });
  }

  // 3. IDENTIFICATION: Get the IP address for security checks
  // We use 'xForwardedFor' to get the real IP if behind a proxy/load balancer
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown';

  // 4. AUTHENTICATION: Verify credentials & check for brute-force attacks
  // This helper function handles:
  // - Checking if the IP is banned/rate-limited
  // - Verifying the password hash
  // - Incrementing failed attempts if password is wrong
  const user = await checkLoginAttemptsAndAuthenticate(ip, email, password);

  // 5. SESSION: Create the session cookie
  // Note: Ensure 'user' returned above is already sanitized (no password)
  await setUserSession(event, { user: user });

  // 6. RESPONSE: Return the user profile
  return user;
});
