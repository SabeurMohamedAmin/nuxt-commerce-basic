import { describe, it, expect } from 'vitest'
import {
  CATEGORIES,
  THEME_COLORS,
  DEFAULT_PRODUCT_PRICE,
  STORAGE_KEYS,
  PAGINATION,
  ADMIN_NAV_ITEMS,
  FOOTER_LINKS,
  SORT_OPTIONS,
  COUNTRIES,
} from '~/constants'

describe('CATEGORIES', () => {
  it('is a non-empty array', () => {
    expect(CATEGORIES.length).toBeGreaterThan(0)
  })

  it('each category has name, slug, and icon', () => {
    for (const cat of CATEGORIES) {
      expect(cat.name).toBeTruthy()
      expect(cat.slug).toBeTruthy()
      expect(cat.icon).toBeTruthy()
    }
  })

  it('all slugs are unique', () => {
    const slugs = CATEGORIES.map(c => c.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })
})

describe('THEME_COLORS', () => {
  it('has primary color', () => {
    expect(THEME_COLORS.primary).toMatch(/^#[0-9A-Fa-f]{6}$/)
  })

  it('has all required color keys', () => {
    expect(THEME_COLORS).toHaveProperty('primary')
    expect(THEME_COLORS).toHaveProperty('secondary')
    expect(THEME_COLORS).toHaveProperty('background')
    expect(THEME_COLORS).toHaveProperty('surface')
  })
})

describe('DEFAULT_PRODUCT_PRICE', () => {
  it('is a positive number', () => {
    expect(DEFAULT_PRODUCT_PRICE).toBeGreaterThan(0)
  })
})

describe('STORAGE_KEYS', () => {
  it('has all required keys', () => {
    expect(STORAGE_KEYS).toHaveProperty('USER_SESSION')
    expect(STORAGE_KEYS).toHaveProperty('ADMIN_SESSION')
    expect(STORAGE_KEYS).toHaveProperty('CART')
  })

  it('all values are non-empty strings', () => {
    Object.values(STORAGE_KEYS).forEach(val => {
      expect(typeof val).toBe('string')
      expect(val.length).toBeGreaterThan(0)
    })
  })
})

describe('PAGINATION', () => {
  it('has positive page sizes', () => {
    expect(PAGINATION.PRODUCTS_PER_PAGE).toBeGreaterThan(0)
    expect(PAGINATION.ADMIN_PER_PAGE).toBeGreaterThan(0)
    expect(PAGINATION.LIBRARY_PER_PAGE).toBeGreaterThan(0)
  })
})

describe('ADMIN_NAV_ITEMS', () => {
  it('each item has title, icon, and to', () => {
    for (const item of ADMIN_NAV_ITEMS) {
      expect(item.title).toBeTruthy()
      expect(item.icon).toBeTruthy()
      expect(item.to).toMatch(/^\/admin/)
    }
  })
})

describe('FOOTER_LINKS', () => {
  it('each link has label and to', () => {
    for (const link of FOOTER_LINKS) {
      expect(link.label).toBeTruthy()
      expect(link.to).toMatch(/^\//)
    }
  })
})

describe('SORT_OPTIONS', () => {
  it('has a default option', () => {
    const defaultOpt = SORT_OPTIONS.find(o => o.value === 'default')
    expect(defaultOpt).toBeDefined()
  })

  it('all options have label and value', () => {
    for (const opt of SORT_OPTIONS) {
      expect(opt.label).toBeTruthy()
      expect(opt.value).toBeTruthy()
    }
  })
})

describe('COUNTRIES', () => {
  it('is a non-empty array of strings', () => {
    expect(COUNTRIES.length).toBeGreaterThan(0)
    for (const country of COUNTRIES) {
      expect(typeof country).toBe('string')
    }
  })
})
