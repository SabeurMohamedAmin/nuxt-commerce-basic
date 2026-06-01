import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import bcrypt from 'bcrypt'
import { eq, and, gt, count } from 'drizzle-orm'
import * as schema from '~~/server/database/schema'

const client = createClient({ url: ':memory:' })
const db = drizzle(client, { schema })

describe('loginUtil - brute-force protection logic', () => {
  beforeAll(async () => {
    await client.execute(`CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL DEFAULT '',
      role TEXT NOT NULL DEFAULT 'customer',
      oauth_provider TEXT,
      oauth_id TEXT,
      avatar TEXT,
      created_at TEXT NOT NULL DEFAULT ''
    )`)
    await client.execute(`CREATE TABLE login_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      ip TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      success INTEGER NOT NULL
    )`)

    // Seed a test user with hashed password
    const hashedPassword = await bcrypt.hash('correct-password', 10)
    await db.insert(schema.users).values({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'customer',
      createdAt: new Date().toISOString(),
    })
  })

  afterAll(() => { client.close() })

  beforeEach(async () => {
    // Clear login attempts between tests
    await client.execute('DELETE FROM login_attempts')
  })

  it('records a failed login attempt', async () => {
    await db.insert(schema.loginAttempts).values({
      userId: 1,
      ip: '192.168.1.1',
      timestamp: Date.now(),
      success: false,
    })

    const attempts = await db.select().from(schema.loginAttempts)
    expect(attempts.length).toBe(1)
    expect(attempts[0].success).toBe(false)
  })

  it('records a successful login attempt', async () => {
    await db.insert(schema.loginAttempts).values({
      userId: 1,
      ip: '192.168.1.1',
      timestamp: Date.now(),
      success: true,
    })

    const attempts = await db.select().from(schema.loginAttempts)
    expect(attempts[0].success).toBe(true)
  })

  it('counts failed attempts per IP within time window', async () => {
    const now = Date.now()

    // Insert 3 failed attempts from same IP
    for (let i = 0; i < 3; i++) {
      await db.insert(schema.loginAttempts).values({
        userId: null,
        ip: '10.0.0.1',
        timestamp: now - i * 1000,
        success: false,
      })
    }

    const windowStart = now - 2 * 60 * 1000 // 2 minutes ago
    const result = await db
      .select({ value: count() })
      .from(schema.loginAttempts)
      .where(
        and(
          eq(schema.loginAttempts.ip, '10.0.0.1'),
          eq(schema.loginAttempts.success, false),
          gt(schema.loginAttempts.timestamp, windowStart)
        )
      )

    expect(result[0].value).toBe(3)
  })

  it('counts failed attempts per user within time window', async () => {
    const now = Date.now()

    for (let i = 0; i < 4; i++) {
      await db.insert(schema.loginAttempts).values({
        userId: 1,
        ip: `192.168.1.${i}`,
        timestamp: now - i * 1000,
        success: false,
      })
    }

    const windowStart = now - 2 * 60 * 1000
    const result = await db
      .select({ value: count() })
      .from(schema.loginAttempts)
      .where(
        and(
          eq(schema.loginAttempts.userId, 1),
          eq(schema.loginAttempts.success, false),
          gt(schema.loginAttempts.timestamp, windowStart)
        )
      )

    expect(result[0].value).toBe(4)
  })

  it('old attempts outside window are not counted', async () => {
    const now = Date.now()
    const threeMinutesAgo = now - 3 * 60 * 1000

    // Insert old attempt (outside 2-min window)
    await db.insert(schema.loginAttempts).values({
      userId: 1,
      ip: '10.0.0.5',
      timestamp: threeMinutesAgo,
      success: false,
    })

    const windowStart = now - 2 * 60 * 1000
    const result = await db
      .select({ value: count() })
      .from(schema.loginAttempts)
      .where(
        and(
          eq(schema.loginAttempts.ip, '10.0.0.5'),
          eq(schema.loginAttempts.success, false),
          gt(schema.loginAttempts.timestamp, windowStart)
        )
      )

    expect(result[0].value).toBe(0)
  })

  it('bcrypt correctly verifies a valid password', async () => {
    const user = await db.select().from(schema.users).where(eq(schema.users.email, 'test@example.com')).get()
    const valid = await bcrypt.compare('correct-password', user!.password)
    expect(valid).toBe(true)
  })

  it('bcrypt rejects an invalid password', async () => {
    const user = await db.select().from(schema.users).where(eq(schema.users.email, 'test@example.com')).get()
    const valid = await bcrypt.compare('wrong-password', user!.password)
    expect(valid).toBe(false)
  })
})
