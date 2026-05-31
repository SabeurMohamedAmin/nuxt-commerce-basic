import { useDB } from '~~/server/database'
import { users, purchases } from '~~/server/database/schema'
import { eq, count } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const allUsers = await useDB().select({
    id: users.id,
    name: users.name,
    email: users.email,
    role: users.role,
    createdAt: users.createdAt,
  }).from(users)

  // Get purchase counts
  const purchaseCounts = await db
    .select({ userId: purchases.userId, count: count() })
    .from(purchases)
    .groupBy(purchases.userId)

  const countMap = new Map(purchaseCounts.map(p => [p.userId, p.count]))

  return allUsers.map(u => ({
    ...u,
    purchases: countMap.get(u.id) || 0,
  }))
})
