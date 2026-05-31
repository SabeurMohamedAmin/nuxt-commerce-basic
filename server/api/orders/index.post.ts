import { useDB } from '~~/server/database'
import { orders, purchases } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { userId, items } = body as { userId: number; items: Array<{ productId: number; amount: number }> }

  if (!userId || !items?.length) {
    throw createError({ statusCode: 400, message: 'userId and items are required' })
  }

  const createdOrders = []

  for (const item of items) {
    // Create order
    const [order] = await useDB().insert(orders).values({
      userId,
      productId: item.productId,
      amount: item.amount,
      status: 'completed',
    }).returning()

    // Add to user's library
    await useDB().insert(purchases).values({
      userId,
      productId: item.productId,
    }).onConflictDoNothing()

    createdOrders.push(order)
  }

  return createdOrders
})
