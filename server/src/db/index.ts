import { Database } from 'bun:sqlite'
import { join } from 'node:path'
import { env } from '@/env'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import * as schema from './schema'
export * from './seq'

const sqlite = new Database(join(env.DATA_PATH, 'media.db'))
export const db = drizzle(sqlite, { schema })
