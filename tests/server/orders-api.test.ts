import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { eq } from 'drizzle-orm'
import * as schema from '~~/server/database/schema'

const client = createClient({ url: ':memory:' })
const db = drizzle(client, { schema })

describe('orders API logic', () => {
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
    await client.execute(`CREATE TABLE products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL DEFAULT '',
      price REAL NOT NULL DEFAULT 2.49,
      image TEXT NOT NULL DEFAULT '',
      preview_url TEXT,
      category TEXT NOT NULL,
      category_slug TEXT NOT NULL,
      file_name TEXT,
      file_path TEXT,
      status TEXT NOT NULL DEFAULT 'published',
      created_at TEXT NOT NULL DEFAULT ''
    )`)
    await client.execute(`CREATE TABLE orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'completed',
      created_at TEXT NOT NULL DEFAULT ''
    )`)
    await client.execute(`CREATE TABLE purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      purchased_at TEXT NOT NULL DEFAULT ''
    )`)

    // Seed test data
    await db.insert(schema.users).values({ name: 'Buyer', email: 'buyer@test.com', password: 'pass', createdAt: new Date().toISOString() })
    await db.insert(schema.products).values({ title: 'Theme A', slug: 'theme-a', category: 'Divi', categorySlug: 'divi-themes', createdAt: new Date().toISOString() })
  })

  afterAll(() => {
    client.close()
  })

  it('creates an order', async () => {
    const [order] = await db.insert(schema.orders).values({
      userId: 1,
      productId: 1,
      amount: 2.49,
      status: 'completed',
      createdAt: new Date().toISOString(),
    }).returning()

    expect(order.id).toBe(1)
    expect(order.amount).toBe(2.49)
    expect(order.status).toBe('completed')
  })

  it('creates a purchase record', async () => {
    const [purchase] = await db.insert(schema.purchases).values({
      userId: 1,
      productId: 1,
      purchasedAt: new Date().toISOString(),
    }).returning()

    expect(purchase.userId).toBe(1)
    expect(purchase.productId).toBe(1)
  })

  it('updates order status', async () => {
    const [updated] = await db
      .update(schema.orders)
      .set({ status: 'refunded' })
      .where(eq(schema.orders.id, 1))
      .returning()

    expect(updated.status).toBe('refunded')
  })

  it('lists orders with user and product info', async () => {
    const result = await db
      .select({
        id: schema.orders.id,
        amount: schema.orders.amount,
        status: schema.orders.status,
        customerEmail: schema.users.email,
        productTitle: schema.products.title,
      })
      .from(schema.orders)
      .leftJoin(schema.users, eq(schema.orders.userId, schema.users.id))
      .leftJoin(schema.products, eq(schema.orders.productId, schema.products.id))

    expect(result.length).toBe(1)
    expect(result[0].customerEmail).toBe('buyer@test.com')
    expect(result[0].productTitle).toBe('Theme A')
  })
})
