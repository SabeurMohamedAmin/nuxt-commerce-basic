import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

// ─── Users ──────────────────────────────────────────────────────
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull().default(''),
  role: text('role', { enum: ['customer', 'admin'] }).notNull().default('customer'),
  oauthProvider: text('oauth_provider'),
  oauthId: text('oauth_id'),
  avatar: text('avatar'),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
})

// ─── Products ───────────────────────────────────────────────────
export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull().default(''),
  price: real('price').notNull().default(2.49),
  image: text('image').notNull().default(''),
  previewUrl: text('preview_url'),
  category: text('category').notNull(),
  categorySlug: text('category_slug').notNull(),
  fileName: text('file_name'),
  filePath: text('file_path'),
  status: text('status', { enum: ['draft', 'published'] }).notNull().default('published'),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
})

// ─── Orders ─────────────────────────────────────────────────────
export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  productId: integer('product_id').notNull().references(() => products.id),
  amount: real('amount').notNull(),
  status: text('status', { enum: ['completed', 'pending', 'refunded'] }).notNull().default('completed'),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
})

// ─── Login Attempts (brute-force protection) ────────────────────
export const loginAttempts = sqliteTable('login_attempts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  ip: text('ip').notNull(),
  timestamp: integer('timestamp').notNull(),
  success: integer('success', { mode: 'boolean' }).notNull(),
})

// ─── User Purchases (library) ───────────────────────────────────
export const purchases = sqliteTable('purchases', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  productId: integer('product_id').notNull().references(() => products.id),
  purchasedAt: text('purchased_at').notNull().$defaultFn(() => new Date().toISOString()),
})
