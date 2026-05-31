import { eq, desc } from 'drizzle-orm'
import { useDB } from '~~/server/database'
import { orders, users, products } from '~~/server/database/schema'

export default defineEventHandler(async () => {
  const result = await db
    .select({
      id: orders.id,
      amount: orders.amount,
      status: orders.status,
      createdAt: orders.createdAt,
      customerEmail: users.email,
      productTitle: products.title,
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .leftJoin(products, eq(orders.productId, products.id))
    .orderBy(desc(orders.id))

  return result
})
