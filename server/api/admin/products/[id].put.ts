import { eq } from 'drizzle-orm'
import { useDB } from '~~/server/database'
import { products } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)

  if (!id) {
    throw createError({ statusCode: 400, message: 'Product ID is required' })
  }

  const { title, slug, description, price, image, previewUrl, category, categorySlug, fileName, filePath, status } = body

  const [updated] = await useDB()
    .update(products)
    .set({
      ...(title && { title }),
      ...(slug && { slug }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price }),
      ...(image !== undefined && { image }),
      ...(previewUrl !== undefined && { previewUrl }),
      ...(category && { category }),
      ...(categorySlug && { categorySlug }),
      ...(fileName !== undefined && { fileName }),
      ...(filePath !== undefined && { filePath }),
      ...(status && { status }),
    })
    .where(eq(products.id, id))
    .returning()

  return updated
})
