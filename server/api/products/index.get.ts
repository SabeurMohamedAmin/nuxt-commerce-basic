import { eq, like } from 'drizzle-orm'
import { useDB } from '~~/server/database'
import { products } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { search, category, page = '1', limit = '16' } = query as Record<string, string>

  let qb = useDB().select().from(products).where(eq(products.status, 'published')).$dynamic()

  if (category) {
    qb = useDB().select().from(products).where(eq(products.categorySlug, category)).$dynamic()
  }

  const allProducts = await qb

  let result = allProducts

  // Search filter (in-memory for simplicity with SQLite)
  if (search) {
    const q = search.toLowerCase()
    result = result.filter(p => p.title.toLowerCase().includes(q))
  }

  const total = result.length
  const offset = (Number(page) - 1) * Number(limit)
  const paginated = result.slice(offset, offset + Number(limit))

  return {
    products: paginated,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
  }
})
