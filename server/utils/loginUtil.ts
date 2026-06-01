import { eq, and, gt, count } from 'drizzle-orm'
import bcrypt from 'bcrypt'
import { useDB } from '~~/server/database'
import { users, loginAttempts } from '~~/server/database/schema'

const MAX_FAILED_ATTEMPTS_PER_IP = 10
const MAX_FAILED_ATTEMPTS_PER_USER = 5
const ATTEMPT_WINDOW_MINUTES = 2

type SafeUser = Omit<typeof users.$inferSelect, 'password'>

/**
 * Authenticates a user with brute-force protection.
 */
export async function checkLoginAttemptsAndAuthenticate(
  ip: string,
  email: string,
  password: string
): Promise<SafeUser> {
  const db = useDB()

  // 1. Check IP lockout
  await checkIpLockout(ip)

  // 2. Find user by email
  const user = await db.select().from(users).where(eq(users.email, email)).get()

  if (!user || !user.password) {
    await recordFailedAttempt(null, ip)
    throw createError({ statusCode: 401, message: 'Invalid email or password.' })
  }

  // 3. Check user-specific lockout
  await checkUserLockout(user.id, ip)

  // 4. Verify password
  const valid = await bcrypt.compare(password, user.password)

  if (!valid) {
    await recordFailedAttempt(user.id, ip)
    throw createError({ statusCode: 401, message: 'Invalid email or password.' })
  }

  // 5. Record successful attempt
  await db.insert(loginAttempts).values({
    userId: user.id,
    ip,
    timestamp: Date.now(),
    success: true,
  })

  const { password: _, ...safeUser } = user
  return safeUser
}

async function getFailedAttemptsCount(
  field: 'ip' | 'userId',
  value: string | number
): Promise<number> {
  const db = useDB()
  const windowStart = Date.now() - ATTEMPT_WINDOW_MINUTES * 60 * 1000

  const filterColumn = field === 'ip' ? loginAttempts.ip : loginAttempts.userId

  const result = await db
    .select({ value: count() })
    .from(loginAttempts)
    .where(
      and(
        eq(filterColumn, value as any),
        eq(loginAttempts.success, false),
        gt(loginAttempts.timestamp, windowStart)
      )
    )

  return result[0]?.value || 0
}

async function recordFailedAttempt(userId: number | null, ip: string) {
  await useDB().insert(loginAttempts).values({
    userId,
    ip,
    timestamp: Date.now(),
    success: false,
  })
}

async function checkIpLockout(ip: string) {
  const failedCount = await getFailedAttemptsCount('ip', ip)
  if (failedCount >= MAX_FAILED_ATTEMPTS_PER_IP) {
    await recordFailedAttempt(null, ip)
    throw createError({ statusCode: 429, message: 'Too many attempts from this IP. Try later.' })
  }
}

async function checkUserLockout(userId: number, ip: string) {
  const failedCount = await getFailedAttemptsCount('userId', userId)
  if (failedCount >= MAX_FAILED_ATTEMPTS_PER_USER) {
    await recordFailedAttempt(userId, ip)
    throw createError({ statusCode: 429, message: 'Too many attempts for this account. Try later.' })
  }
}
