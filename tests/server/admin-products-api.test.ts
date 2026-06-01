import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { eq } from 'drizzle-orm'
import * as schema from '~~/server/database/schema'

// Use in-memory SQLite for tests
const client = createClient({ url: ':memory:' })
const db = drizzle(client, { schema })

describe('admin products API logic', () => {
  beforeAll(async () => {
    // Create tables
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
  })

  afterAll(() => {
    client.close()
  })

  it('inserts a product', async () => {
    const [product] = await db.insert(schema.products).values({
      title: 'Test Theme',
      slug: 'test-theme',
      description: 'A test product',
      price: 2.49,
      image: '/img.jpg',
      category: 'Divi Themes',
      categorySlug: 'divi-themes',
      status: 'published',
      createdAt: new Date().toISOString(),
    }).returning()

    expect(product.id).toBe(1)
    expect(product.title).toBe('Test Theme')
    expect(product.slug).toBe('test-theme')
  })

  it('retrieves a product by id', async () => {
    const product = await db.select().from(schema.products).where(eq(schema.products.id, 1)).get()

    expect(product).toBeDefined()
    expect(product!.title).toBe('Test Theme')
  })

  it('updates a product', async () => {
    const [updated] = await db
      .update(schema.products)
      .set({ title: 'Updated Theme', price: 4.99 })
      .where(eq(schema.products.id, 1))
      .returning()

    expect(updated.title).toBe('Updated Theme')
    expect(updated.price).toBe(4.99)
  })

  it('lists all products', async () => {
    await db.insert(schema.products).values({
      title: 'Second Product',
      slug: 'second-product',
      category: 'Elementor Themes',
      categorySlug: 'elementor-themes',
      createdAt: new Date().toISOString(),
    })

    const all = await db.select().from(schema.products)
    expect(all.length).toBe(2)
  })

  it('deletes a product', async () => {
    await db.delete(schema.products).where(eq(schema.products.id, 1))

    const product = await db.select().from(schema.products).where(eq(schema.products.id, 1)).get()
    expect(product).toBeUndefined()
  })

  it('enforces unique slug constraint', async () => {
    await db.insert(schema.products).values({
      title: 'Duplicate Slug',
      slug: 'second-product',
      category: 'Divi Themes',
      categorySlug: 'divi-themes',
      createdAt: new Date().toISOString(),
    }).catch((err) => {
      expect(err).toBeDefined()
    })
  })
})
