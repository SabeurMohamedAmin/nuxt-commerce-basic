export default defineEventHandler(async (event) => {
  // 1. INPUT: Parse the request body
  const { name, email, password } = await readBody(event);

  // 2. VALIDATION: Ensure all fields are present
  if (!name || !email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required field or fields to register',
      message: 'Missing required field or fields to register'
    });
  };

  // 3. CHECKS: Ensure user doesn't already exist (throws 400 if they do)
  await throwErrorIfUserExists(email);

  // 4. ACTION: Create the user in the database
  const user = await registerUser(name, email, password);

  // 5. SECURITY: Strip the password from the user object
  // We alias 'password' to 'stash' just to separate it from the rest
  const { password: stash, ...userWithoutPassword } = user;

  // 6. SESSION: Log the user in immediately (using the sanitized object)
  await setUserSession(event, {
    user: userWithoutPassword
  });

  // 7. RESPONSE: Return the user data (without sensitive info)
  return userWithoutPassword;
});
