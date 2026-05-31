import { eq } from 'drizzle-orm'
import { useDB } from '~~/server/database'
import { purchases, products } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const userId = Number(getRouterParam(event, 'userId'))

  if (!userId) {
    throw createError({ statusCode: 400, message: 'userId is required' })
  }

  const result = await db
    .select({
      id: products.id,
      title: products.title,
      slug: products.slug,
      price: products.price,
      image: products.image,
      category: products.category,
      categorySlug: products.categorySlug,
      purchasedAt: purchases.purchasedAt,
    })
    .from(purchases)
    .leftJoin(products, eq(purchases.productId, products.id))
    .where(eq(purchases.userId, userId))

  return result
})
