import { eq } from 'drizzle-orm'
import { useDB } from '~~/server/database'
import { orders } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const { status } = body

  if (!id || !status) {
    throw createError({ statusCode: 400, message: 'id and status are required' })
  }

  const [updated] = await db
    .update(orders)
    .set({ status })
    .where(eq(orders.id, id))
    .returning()

  return updated
})
