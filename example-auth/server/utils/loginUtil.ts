import { eq, and, gt, count } from "drizzle-orm";

// Import your DB hook (from server/db/db.ts or similar)
const database = useDb();

/**
 * =========================================
 * BRUTE-FORCE PROTECTION CONSTANTS
 * =========================================
 * Define thresholds for IP/user lockouts to prevent brute-force attacks.
 */
const MAX_FAILED_ATTEMPTS_PER_IP = 10;      // Max failed attempts from one IP
const MAX_FAILED_ATTEMPTS_PER_USER = 5;     // Max failed attempts for one user
const ATTEMPT_WINDOW_MINUTES = 2;           // Time window (minutes) to count attempts

// User type excluding sensitive fields like password
type User = Omit<typeof schema.users.$inferSelect, "password">;

// Helper type for loginAttempts table columns
type FailedAttemptsColumn = (typeof schema.loginAttempts)["_"]["columns"][keyof (typeof schema.loginAttempts)["_"]["columns"]];

/**
 * Authenticates a user with brute-force protection.
 * 
 * Steps:
 * 1. Check if IP is locked out.
 * 2. Fetch user by email.
 * 3. Check if user account is locked.
 * 4. Verify password.
 * 5. Log attempt (success/fail).
 * 
 * @param ip - Client IP address.
 * @param email - User's email.
 * @param password - Raw password input.
 * @returns User object without password.
 * @throws 401 for invalid creds; 429 for lockouts.
 */
export async function checkLoginAttemptsAndAuthenticate(ip: string, email: string, password: string): Promise<User> {
  // 1. Check IP lockout first to block spammers early
  await checkUserLockoutByIpAndThrow(ip);

  // 2. Query user by email
  const user = await database.query.users.findFirst({
    where: eq(schema.users.email, email),
  });

  // 3. If user not found or no password, log fail (IP-only) and throw
  if (!user || !user.password) {
    await recordLoginAttempt(null, ip); // Null userId for non-existent users
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid email or password.',
      message: 'Invalid email or password.',
    });
  }

  // 4. Check user-specific lockout
  await checkUserLockoutByUserAndThrow(user.id, ip);

  // 5. Verify password (assume verifyPassword is imported; e.g., bcrypt.compare)
  const isPasswordValid = await verifyPassword(user.password, password);

  if (!isPasswordValid) {
    await recordLoginAttempt(user.id, ip);
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid email or password.',
      message: 'Invalid email or password.',
    });
  }

  // 6. Success: Log successful attempt
  await database.insert(schema.loginAttempts).values({
    userId: user.id,
    ip,
    timestamp: Date.now(),
    success: 1,
  });

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Counts failed login attempts in the time window.
 * 
 * @param filterField - Column to filter (e.g., ip or userId).
 * @param filterValue - Value to match (IP string or user ID).
 * @returns Number of failed attempts.
 */
async function getFailedAttemptsCount(
  filterField: FailedAttemptsColumn,
  filterValue: string | number
): Promise<number> {
  const windowStart = Date.now() - (ATTEMPT_WINDOW_MINUTES * 60 * 1000);

  const result = await database
    .select({ value: count() })
    .from(schema.loginAttempts)
    .where(
      and(
        eq(filterField, filterValue),
        eq(schema.loginAttempts.success, 0),
        gt(schema.loginAttempts.timestamp, windowStart)
      )
    );

  return result[0]?.value || 0;
}

/**
 * Records a failed login attempt.
 * 
 * @param userId - User ID (null if unknown user).
 * @param ip - Client IP.
 */
async function recordLoginAttempt(userId: number | null, ip: string) {
  await database.insert(schema.loginAttempts).values({
    userId,
    ip,
    timestamp: Date.now(),
    success: 0,
  });
}

/**
 * Checks IP for lockout and throws if exceeded.
 * 
 * @param ip - Client IP.
 * @throws 429 if locked.
 */
async function checkUserLockoutByIpAndThrow(ip: string): Promise<void> {
  const failedCount = await getFailedAttemptsCount(schema.loginAttempts.ip, ip);

  if (failedCount >= MAX_FAILED_ATTEMPTS_PER_IP) {
    await recordLoginAttempt(null, ip); // Extend lockout
    throw createError({
      statusCode: 429,
      statusMessage: 'Too many attempts from this IP. Try later.',
      message: 'Too many attempts from this IP. Try later.',
    });
  }
}

/**
 * Checks user for lockout and throws if exceeded.
 * 
 * @param userId - User ID.
 * @param ip - Client IP (for logging).
 * @throws 429 if locked.
 */
async function checkUserLockoutByUserAndThrow(userId: number, ip: string): Promise<void> {
  const failedCount = await getFailedAttemptsCount(schema.loginAttempts.userId, userId);

  if (failedCount >= MAX_FAILED_ATTEMPTS_PER_USER) {
    await recordLoginAttempt(userId, ip); // Extend lockout
    throw createError({
      statusCode: 429,
      statusMessage: 'Too many attempts for this account. Try later.',
      message: 'Too many attempts for this account. Try later.',
    });
  }
}