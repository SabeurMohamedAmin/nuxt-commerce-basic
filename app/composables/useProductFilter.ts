import type { Product } from '~/types'
import { PAGINATION } from '~/constants'

interface FilterOptions {
  products: Product[]
  perPage?: number
}

export function useProductFilter(options: FilterOptions) {
  const { products, perPage = PAGINATION.PRODUCTS_PER_PAGE } = options

  const search = ref('')
  const selectedCategory = ref('')
  const sortBy = ref('default')
  const currentPage = ref(1)

  const filteredProducts = computed(() => {
    let result = [...products]

    // Search filter
    if (search.value) {
      const query = search.value.toLowerCase()
      result = result.filter(p => p.title.toLowerCase().includes(query))
    }

    // Category filter
    if (selectedCategory.value) {
      result = result.filter(p => p.categorySlug === selectedCategory.value)
    }

    // Sorting
    switch (sortBy.value) {
      case 'name-asc':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'name-desc':
        result.sort((a, b) => b.title.localeCompare(a.title))
        break
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
    }

    return result
  })

  const totalPages = computed(() => Math.ceil(filteredProducts.value.length / perPage))

  const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * perPage
    return filteredProducts.value.slice(start, start + perPage)
  })

  // Reset page when filters change
  watch([search, selectedCategory, sortBy], () => {
    currentPage.value = 1
  })

  return {
    search,
    selectedCategory,
    sortBy,
    currentPage,
    filteredProducts,
    paginatedProducts,
    totalPages,
  }
}
