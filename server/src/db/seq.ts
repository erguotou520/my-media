import { eq, inArray } from "drizzle-orm";
import type { SQLiteInsertValue, SQLiteTable, SQLiteUpdateSetSource } from "drizzle-orm/sqlite-core";
import { db } from ".";

// 针对大量插入操作的优化
export async function insertMany<TTable extends SQLiteTable>(table: TTable, data: SQLiteInsertValue<TTable>[]): Promise<void> {
  const queue = createListQueue(data, 50)
  for (const item of queue) {
    await db.insert(table).values(item)
  }
}

// 针对大量更新操作的优化
export async function updateMany<TTable extends SQLiteTable>(table: TTable, primaryKey: keyof SQLiteInsertValue<TTable>, values: {
  key: string | number,
  data: SQLiteUpdateSetSource<TTable>
}[]): Promise<void> {
  for (const item of values) {
    await db.update(table).set(item.data)
      // @ts-ignore
      .where(eq(item[primaryKey], item.key))
  }
}

// 针对大量删除操作的优化
export async function deleteMany<TTable extends SQLiteTable>(table: TTable, primaryKey: keyof SQLiteInsertValue<TTable>, valueList: (string | number)[] ): Promise<void> {
  const queue = createListQueue(valueList, 100)
  for (const item of queue) {
    // @ts-ignore
    await db.delete(table).where(inArray(item[primaryKey], item))
  }
}

function createListQueue<T>(list: T[], size = 50) {
  // 将数组切分为多个队列
  const result: T[][] = [];
  for (let i = 0; i < list.length; i += size) {
    result.push(list.slice(i, Math.min(i + size, list.length)))
  }
  return result
}