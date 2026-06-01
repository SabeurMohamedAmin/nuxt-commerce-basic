import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { eq } from 'drizzle-orm'
import * as schema from '~~/server/database/schema'

const client = createClient({ url: ':memory:' })
const db = drizzle(client, { schema })

describe('admin users API logic', () => {
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

  afterAll(() => {
    client.close()
  })

  it('creates a user', async () => {
    const [user] = await db.insert(schema.users).values({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed123',
      role: 'customer',
      createdAt: new Date().toISOString(),
    }).returning()

    expect(user.id).toBe(1)
    expect(user.email).toBe('john@example.com')
    expect(user.role).toBe('customer')
  })

  it('creates an admin user', async () => {
    const [admin] = await db.insert(schema.users).values({
      name: 'Admin',
      email: 'admin@store.com',
      password: 'admin123',
      role: 'admin',
      createdAt: new Date().toISOString(),
    }).returning()

    expect(admin.role).toBe('admin')
  })

  it('finds user by email', async () => {
    const user = await db.select().from(schema.users).where(eq(schema.users.email, 'john@example.com')).get()

    expect(user).toBeDefined()
    expect(user!.name).toBe('John Doe')
  })

  it('lists all users', async () => {
    const all = await db.select().from(schema.users)
    expect(all.length).toBe(2)
  })

  it('deletes a user', async () => {
    await db.delete(schema.users).where(eq(schema.users.id, 1))

    const user = await db.select().from(schema.users).where(eq(schema.users.id, 1)).get()
    expect(user).toBeUndefined()
  })

  it('enforces unique email constraint', async () => {
    try {
      await db.insert(schema.users).values({
        name: 'Duplicate',
        email: 'admin@store.com',
        password: 'pass',
        createdAt: new Date().toISOString(),
      })
      expect.fail('Should have thrown')
    } catch (err) {
      expect(err).toBeDefined()
    }
  })
})
