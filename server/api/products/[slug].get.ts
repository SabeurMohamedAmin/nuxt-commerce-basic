import { eq } from 'drizzle-orm'
import { useDB } from '~~/server/database'
import { products } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, message: 'Slug is required' })
  }

  const product = await useDB().select().from(products).where(eq(products.slug, slug)).get()

  if (!product) {
    throw createError({ statusCode: 404, message: 'Product not found' })
  }

  return product
})
