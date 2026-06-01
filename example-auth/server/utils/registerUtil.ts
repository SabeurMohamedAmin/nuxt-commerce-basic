import { eq } from "drizzle-orm";
const database = useDb();

/**
 * 🛑 GUARD: Checks if an email is already taken.
 * 
 * Use this before any operation that requires a unique email.
 * It throws a 400 error immediately if a duplicate is found, stopping execution.
 * 
 * @param {string} email - The email address to validate.
 */
export async function throwErrorIfUserExists(email: string) {
  const existingUser = await database.query.users.findFirst({
    where: eq(schema.users.email, email)
  });

  if (existingUser) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email already exists',
      message: 'The email already exists in our database. Please login!'
    });
  }
};

/**
 * 🚀 ACTION: Creates a new user account.
 * 
 * Orchestrates the registration flow:
 * 1. Checks for duplicates (calls the guard function).
 * 2. Hashes the password.
 * 3. Inserts into DB and verifies the result.
 * 
 * @returns {Promise<Object>} The newly created user.
 */
export async function registerUser(name: string, email: string, password: string) {
  // 1. FAIL FAST: Check if user exists before doing expensive work (hashing)
  await throwErrorIfUserExists(email);

  // 2. PREPARE: Hash the password (never store plain text!)
  const hashedPassword = await hashPassword(password);

  // 3. EXECUTE: Insert and ask Drizzle to return the new row
  const result = await database.insert(schema.users).values({
    name,
    email,
    login: email,
    password: hashedPassword,
  }).returning();

  // 4. VERIFY: Ensure the database actually returned the new record
  const newUser = result.at(0);

  if (!newUser) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Registration failed',
      message: 'Failed to register user. Please try again!'
    });
  }

  return newUser;
}
