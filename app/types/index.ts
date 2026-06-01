// ─── Product Types ───────────────────────────────────────────────
export interface Product {
  id: number
  title: string
  slug: string
  price: number
  image: string
  previewUrl?: string | null
  category: string
  categorySlug: string
}

export interface Category {
  name: string
  slug: string
  icon: string
}

// ─── Cart Types ─────────────────────────────────────────────────
export interface CartItem {
  id: number
  title: string
  price: number
  image: string
}

// ─── Auth Types ─────────────────────────────────────────────────
export interface User {
  id: number
  name: string
  email: string
  avatar?: string | null
  purchasedProducts: number[]
}

export interface AdminUser {
  id: number
  name: string
  email: string
}

// ─── Order Types ────────────────────────────────────────────────
export type OrderStatus = 'completed' | 'pending' | 'refunded'

export interface Order {
  id: number
  customerEmail: string
  productTitle: string
  amount: number
  date: string
  status: OrderStatus
}

// ─── Admin User Management ──────────────────────────────────────
export type UserRole = 'customer' | 'admin'

export interface ManagedUser {
  id: number
  name: string
  email: string
  role: UserRole
  purchases: number
  joined: string
}
