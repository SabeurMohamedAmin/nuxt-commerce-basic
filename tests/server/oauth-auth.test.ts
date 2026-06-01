import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { eq, and } from 'drizzle-orm'
import * as schema from '~~/server/database/schema'

const client = createClient({ url: ':memory:' })
const db = drizzle(client, { schema })

describe('OAuth user flow (findOrCreateOAuthUser logic)', () => {
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

  it('creates a new user from OAuth data', async () => {
    const [user] = await db.insert(schema.users).values({
      name: 'John Google',
      email: 'john@gmail.com',
      password: '',
      role: 'customer',
      oauthProvider: 'google',
      oauthId: 'google-123',
      avatar: 'https://avatar.google.com/john.jpg',
      createdAt: new Date().toISOString(),
    }).returning()

    expect(user.id).toBe(1)
    expect(user.oauthProvider).toBe('google')
    expect(user.oauthId).toBe('google-123')
    expect(user.avatar).toContain('google.com')
  })

  it('finds existing user by OAuth provider + ID', async () => {
    const user = await db
      .select()
      .from(schema.users)
      .where(and(eq(schema.users.oauthProvider, 'google'), eq(schema.users.oauthId, 'google-123')))
      .get()

    expect(user).toBeDefined()
    expect(user!.email).toBe('john@gmail.com')
  })

  it('links OAuth to existing email user', async () => {
    // Create a user with email only (no OAuth)
    await db.insert(schema.users).values({
      name: 'Jane',
      email: 'jane@example.com',
      password: 'hashedpass',
      role: 'customer',
      createdAt: new Date().toISOString(),
    })

    // Simulate linking Facebook OAuth to existing email
    await db
      .update(schema.users)
      .set({ oauthProvider: 'facebook', oauthId: 'fb-456' })
      .where(eq(schema.users.email, 'jane@example.com'))

    const user = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, 'jane@example.com'))
      .get()

    expect(user!.oauthProvider).toBe('facebook')
    expect(user!.oauthId).toBe('fb-456')
    expect(user!.password).toBe('hashedpass') // Password preserved
  })

  it('creates Microsoft OAuth user', async () => {
    const [user] = await db.insert(schema.users).values({
      name: 'Mike MS',
      email: 'mike@outlook.com',
      password: '',
      oauthProvider: 'microsoft',
      oauthId: 'ms-789',
      createdAt: new Date().toISOString(),
    }).returning()

    expect(user.oauthProvider).toBe('microsoft')
    expect(user.email).toBe('mike@outlook.com')
  })

  it('OAuth users have empty password', async () => {
    const user = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.oauthProvider, 'google'))
      .get()

    expect(user!.password).toBe('')
  })

  it('lists all users regardless of auth method', async () => {
    const all = await db.select().from(schema.users)
    expect(all.length).toBe(3)
  })
})
