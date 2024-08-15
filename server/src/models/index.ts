import { medias } from '@/db/schema'
import { createInsertSchema, createSelectSchema } from 'drizzle-typebox'
import { type Static, t } from 'elysia'

export const LoginSchema = t.Object({
  username: t.String(),
  password: t.String()
})

export const CommonPaginationSchema = t.Object({
  skip: t.Number(),
  limit: t.Number()
})

export type CommonPaginationType = Static<typeof CommonPaginationSchema>

export type LoginForm = Static<typeof LoginSchema>

export type UserClaims = { id: string; nickname: string }

export const CreateMediaSchema = createInsertSchema(medias)
export type CreateMediaModel = Static<typeof CreateMediaSchema>

export const SelectMediaModel = createSelectSchema(medias)
export type SelectMediaModelType = Static<typeof SelectMediaModel>