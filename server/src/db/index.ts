import { Database } from 'bun:sqlite'
import { env } from '@/env'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import * as schema from './schema'
export * from './seq'

const sqlite = new Database(env.SQLITE_DB_PATH)
export const db = drizzle(sqlite, { schema })
