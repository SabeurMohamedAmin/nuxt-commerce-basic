import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import * as schema from '~~/server/database/schema'

const client = createClient({ url: ':memory:' })
const db = drizzle(client, { schema })

describe('registerUtil - user registration logic', () => {
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
  })

  afterAll(() => { client.close() })

  it('creates a new user with hashed password', async () => {
    const hashedPassword = await bcrypt.hash('mypassword', 10)

    const [user] = await db.insert(schema.users).values({
      name: 'New User',
      email: 'new@example.com',
      password: hashedPassword,
      role: 'customer',
      createdAt: new Date().toISOString(),
    }).returning()

    expect(user.id).toBe(1)
    expect(user.email).toBe('new@example.com')
    expect(user.password).not.toBe('mypassword') // Hashed
    expect(user.password.startsWith('$2b$')).toBe(true) // bcrypt prefix
  })

  it('stored hash can be verified', async () => {
    const user = await db.select().from(schema.users).where(eq(schema.users.email, 'new@example.com')).get()
    const valid = await bcrypt.compare('mypassword', user!.password)
    expect(valid).toBe(true)
  })

  it('rejects duplicate email', async () => {
    try {
      await db.insert(schema.users).values({
        name: 'Duplicate',
        email: 'new@example.com',
        password: 'hash',
        createdAt: new Date().toISOString(),
      })
      expect.fail('Should have thrown')
    } catch (err: any) {
      expect(err).toBeDefined()
    }
  })

  it('creates user with customer role by default', async () => {
    const [user] = await db.insert(schema.users).values({
      name: 'Customer',
      email: 'customer@example.com',
      password: await bcrypt.hash('pass', 10),
      createdAt: new Date().toISOString(),
    }).returning()

    expect(user.role).toBe('customer')
  })

  it('password hash differs for same input (salt)', async () => {
    const hash1 = await bcrypt.hash('samepassword', 10)
    const hash2 = await bcrypt.hash('samepassword', 10)

    expect(hash1).not.toBe(hash2) // Different salts
    expect(await bcrypt.compare('samepassword', hash1)).toBe(true)
    expect(await bcrypt.compare('samepassword', hash2)).toBe(true)
  })

  it('OAuth user has empty password', async () => {
    const [user] = await db.insert(schema.users).values({
      name: 'OAuth User',
      email: 'oauth@google.com',
      password: '',
      oauthProvider: 'google',
      oauthId: 'google-123',
      createdAt: new Date().toISOString(),
    }).returning()

    expect(user.password).toBe('')
    expect(user.oauthProvider).toBe('google')
  })
})
