import { eq } from 'drizzle-orm'
import { useDB } from '~~/server/database'
import { products } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (!id) {
    throw createError({ statusCode: 400, message: 'Product ID is required' })
  }

  const product = await useDB()
    .select()
    .from(products)
    .where(eq(products.id, id))
    .get()

  if (!product) {
    throw createError({ statusCode: 404, message: 'Product not found' })
  }

  return product
})
