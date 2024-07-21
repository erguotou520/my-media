// import { createInsertSchema, createSelectSchema } from 'drizzle-typebox'
import { type Static, t } from 'elysia'

export const LoginSchema = t.Object({
  username: t.String(),
  password: t.String()
})

export type LoginForm = Static<typeof LoginSchema>

export type UserClaims = { id: string; nickname: string }
