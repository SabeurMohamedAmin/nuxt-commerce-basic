import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from './schema'

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null

export function useDB() {
  if (!_db) {
    const client = createClient({
      url: process.env.DATABASE_URL || 'file:./data/store.db',
    })
    _db = drizzle(client, { schema })
  }
  return _db
}
