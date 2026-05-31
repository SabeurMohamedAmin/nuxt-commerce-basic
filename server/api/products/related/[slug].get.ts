import { eq, ne, and } from 'drizzle-orm'
import { useDB } from '~~/server/database'
import { products } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) return []

  const product = await useDB().select().from(products).where(eq(products.slug, slug)).get()
  if (!product) return []

  const related = await db
    .select()
    .from(products)
    .where(and(eq(products.categorySlug, product.categorySlug), ne(products.slug, slug)))
    .limit(5)

  return related
})
