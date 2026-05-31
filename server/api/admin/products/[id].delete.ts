import { eq } from 'drizzle-orm'
import { useDB } from '~~/server/database'
import { products } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (!id) {
    throw createError({ statusCode: 400, message: 'Product ID is required' })
  }

  await useDB().delete(products).where(eq(products.id, id))

  return { success: true }
})
