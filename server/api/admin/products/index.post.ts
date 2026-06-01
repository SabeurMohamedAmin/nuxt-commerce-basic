import { useDB } from '~~/server/database'
import { products } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { title, slug, description, price, image, category, categorySlug, previewUrl, fileName, filePath, status } = body

  if (!title || !slug || !categorySlug) {
    throw createError({ statusCode: 400, message: 'title, slug, and categorySlug are required' })
  }

  const [product] = await useDB().insert(products).values({
    title,
    slug,
    description: description || '',
    price: price || 2.49,
    image: image || '',
    previewUrl: previewUrl || null,
    category: category || '',
    categorySlug,
    fileName: fileName || null,
    filePath: filePath || null,
    status: status || 'draft',
  }).returning()

  return product
})
