import { describe, it, expect } from 'vitest'
import { products } from '~/data/products'

describe('products data', () => {
  it('contains products', () => {
    expect(products.length).toBeGreaterThan(0)
  })

  it('each product has required fields', () => {
    for (const product of products) {
      expect(product).toHaveProperty('id')
      expect(product).toHaveProperty('title')
      expect(product).toHaveProperty('slug')
      expect(product).toHaveProperty('price')
      expect(product).toHaveProperty('image')
      expect(product).toHaveProperty('category')
      expect(product).toHaveProperty('categorySlug')
    }
  })

  it('all products have unique IDs', () => {
    const ids = products.map(p => p.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('all products have unique slugs', () => {
    const slugs = products.map(p => p.slug)
    const uniqueSlugs = new Set(slugs)
    expect(uniqueSlugs.size).toBe(slugs.length)
  })

  it('all products have a positive price', () => {
    for (const product of products) {
      expect(product.price).toBeGreaterThan(0)
    }
  })

  it('all slugs are URL-safe', () => {
    const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/
    for (const product of products) {
      expect(product.slug).toMatch(slugRegex)
    }
  })

  it('all products have a non-empty category', () => {
    for (const product of products) {
      expect(product.category.length).toBeGreaterThan(0)
      expect(product.categorySlug.length).toBeGreaterThan(0)
    }
  })
})
