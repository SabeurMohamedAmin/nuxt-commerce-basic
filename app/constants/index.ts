import type { Category } from '~/types'

// ─── Theme ──────────────────────────────────────────────────────
export const THEME_COLORS = {
  primary: '#1565C0',
  secondary: '#424242',
  accent: '#FF6F00',
  background: '#F5F7FA',
  surface: '#FFFFFF',
} as const

// ─── Product Pricing ────────────────────────────────────────────
export const DEFAULT_PRODUCT_PRICE = 2.49

// ─── Categories ─────────────────────────────────────────────────
export const CATEGORIES: Category[] = [
  { name: 'Divi Themes', slug: 'divi-themes', icon: 'mdi-palette-swatch' },
  { name: 'Elementor Themes', slug: 'elementor-themes', icon: 'mdi-palette' },
  { name: 'Others WordPress Themes', slug: 'others-wordpress-themes', icon: 'mdi-wordpress' },
  { name: 'Nuxt Web App', slug: 'nuxt-web-app', icon: 'mdi-nuxt' },
]

// ─── Storage Keys ───────────────────────────────────────────────
export const STORAGE_KEYS = {
  USER_SESSION: 'user_session',
  ADMIN_SESSION: 'admin_session',
  CART: 'cart_items',
} as const

// ─── Pagination ─────────────────────────────────────────────────
export const PAGINATION = {
  PRODUCTS_PER_PAGE: 16,
  ADMIN_PER_PAGE: 20,
  LIBRARY_PER_PAGE: 16,
} as const

// ─── Navigation ─────────────────────────────────────────────────
export const ADMIN_NAV_ITEMS = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/admin' },
  { title: 'Products', icon: 'mdi-package-variant', to: '/admin/products' },
  { title: 'Orders', icon: 'mdi-cart', to: '/admin/orders' },
  { title: 'Users', icon: 'mdi-account-group', to: '/admin/users' },
] as const

export const FOOTER_LINKS = [
  { label: 'Terms & Conditions', to: '/terms' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'DMCA', to: '/dmca' },
  { label: 'Contact', to: '/contact' },
  { label: 'Refund Policy', to: '/refund' },
  { label: 'Help', to: '/help' },
] as const

export const SORT_OPTIONS = [
  { label: 'Default', value: 'default' },
  { label: 'Name A-Z', value: 'name-asc' },
  { label: 'Name Z-A', value: 'name-desc' },
  { label: 'Price Low-High', value: 'price-asc' },
  { label: 'Price High-Low', value: 'price-desc' },
] as const

export const COUNTRIES = [
  'France',
  'United States',
  'United Kingdom',
  'Germany',
  'Canada',
  'Algeria',
] as const
