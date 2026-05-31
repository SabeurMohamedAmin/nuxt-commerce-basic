import { count, sum } from 'drizzle-orm'
import { useDB } from '~~/server/database'
import { products, orders, users } from '~~/server/database/schema'

export default defineEventHandler(async () => {
  const [productCount] = await useDB().select({ value: count() }).from(products)
  const [orderCount] = await useDB().select({ value: count() }).from(orders)
  const [userCount] = await useDB().select({ value: count() }).from(users)
  const [revenue] = await useDB().select({ value: sum(orders.amount) }).from(orders)

  return {
    totalProducts: productCount.value,
    totalOrders: orderCount.value,
    totalUsers: userCount.value,
    totalRevenue: Number(revenue.value) || 0,
  }
})
