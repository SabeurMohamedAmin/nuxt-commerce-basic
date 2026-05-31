import { desc } from 'drizzle-orm'
import { useDB } from '~~/server/database'
import { products } from '~~/server/database/schema'

export default defineEventHandler(async () => {
  const allProducts = await useDB()
    .select()
    .from(products)
    .orderBy(desc(products.id))

  return allProducts
})
