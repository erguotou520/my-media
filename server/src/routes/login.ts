import { db } from '@/db'
import { users } from '@/db/schema'
import { env } from '@/env'
import { sign } from '@/lib/auth'
import { LoginSchema } from '@/models'
import { eq } from 'drizzle-orm'
import Elysia, { t } from 'elysia'

export const loginRoute = new Elysia()
.post(
  '/login',
    async ({ body, set }) => {
      const existed = await db.select().from(users).where(eq(users.username, body.username))
      if (!existed.length) {
        set.status = 400
        return 'User not found'
      }
      const existedUser = existed[0]
      const verified = await Bun.password.verify(body.password, existedUser.hashedPassword)
      if (!verified) {
        set.status = 400
        return 'Password is incorrect'
      }
      return {
        token: await sign({ id: existedUser.id, nickname: existedUser.nickname! }, env.JWT_SECRET, {
          exp: '7d'
        })
      }
    },
    {
      body: LoginSchema
    }
  )
