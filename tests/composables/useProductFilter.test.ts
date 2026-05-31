import { describe, it, expect } from 'vitest'
import { useProductFilter } from '~/composables/useProductFilter'
import type { Product } from '~/types'

const mockProducts: Product[] = [
  { id: 1, title: 'Alpha Theme', slug: 'alpha-theme', price: 2.49, image: '', category: 'Divi Themes', categorySlug: 'divi-themes' },
  { id: 2, title: 'Beta Plugin', slug: 'beta-plugin', price: 4.99, image: '', category: 'Elementor Themes', categorySlug: 'elementor-themes' },
  { id: 3, title: 'Gamma Template', slug: 'gamma-template', price: 1.99, image: '', category: 'Divi Themes', categorySlug: 'divi-themes' },
  { id: 4, title: 'Delta App', slug: 'delta-app', price: 9.99, image: '', category: 'Nuxt Web App', categorySlug: 'nuxt-web-app' },
  { id: 5, title: 'Epsilon Store', slug: 'epsilon-store', price: 2.49, image: '', category: 'Divi Themes', categorySlug: 'divi-themes' },
]

describe('useProductFilter', () => {
  it('returns all products by default', () => {
    const { filteredProducts } = useProductFilter({ products: mockProducts })
    expect(filteredProducts.value).toHaveLength(5)
  })

  it('filters by search query', () => {
    const { filteredProducts, search } = useProductFilter({ products: mockProducts })

    search.value = 'alpha'

    expect(filteredProducts.value).toHaveLength(1)
    expect(filteredProducts.value[0].title).toBe('Alpha Theme')
  })

  it('search is case-insensitive', () => {
    const { filteredProducts, search } = useProductFilter({ products: mockProducts })

    search.value = 'BETA'

    expect(filteredProducts.value).toHaveLength(1)
  })

  it('filters by category', () => {
    const { filteredProducts, selectedCategory } = useProductFilter({ products: mockProducts })

    selectedCategory.value = 'divi-themes'

    expect(filteredProducts.value).toHaveLength(3)
  })

  it('sorts by name ascending', () => {
    const { filteredProducts, sortBy } = useProductFilter({ products: mockProducts })

    sortBy.value = 'name-asc'

    expect(filteredProducts.value[0].title).toBe('Alpha Theme')
    expect(filteredProducts.value[4].title).toBe('Gamma Template')
  })

  it('sorts by name descending', () => {
    const { filteredProducts, sortBy } = useProductFilter({ products: mockProducts })

    sortBy.value = 'name-desc'

    expect(filteredProducts.value[0].title).toBe('Gamma Template')
  })

  it('sorts by price ascending', () => {
    const { filteredProducts, sortBy } = useProductFilter({ products: mockProducts })

    sortBy.value = 'price-asc'

    expect(filteredProducts.value[0].price).toBe(1.99)
    expect(filteredProducts.value[4].price).toBe(9.99)
  })

  it('sorts by price descending', () => {
    const { filteredProducts, sortBy } = useProductFilter({ products: mockProducts })

    sortBy.value = 'price-desc'

    expect(filteredProducts.value[0].price).toBe(9.99)
  })

  it('paginates results', () => {
    const { paginatedProducts, totalPages } = useProductFilter({
      products: mockProducts,
      perPage: 2,
    })

    expect(paginatedProducts.value).toHaveLength(2)
    expect(totalPages.value).toBe(3)
  })

  it('second page shows correct items', () => {
    const { paginatedProducts, currentPage } = useProductFilter({
      products: mockProducts,
      perPage: 2,
    })

    currentPage.value = 2

    expect(paginatedProducts.value).toHaveLength(2)
    expect(paginatedProducts.value[0].id).toBe(3)
  })

  it('combines search and category filters', () => {
    const { filteredProducts, search, selectedCategory } = useProductFilter({ products: mockProducts })

    search.value = 'theme'
    selectedCategory.value = 'divi-themes'

    expect(filteredProducts.value).toHaveLength(1)
    expect(filteredProducts.value[0].title).toBe('Alpha Theme')
  })
})
