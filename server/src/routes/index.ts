import { env } from '@/env'
import { verify } from '@/lib/auth'
import type { UserClaims } from '@/models'
import { bearer } from '@elysiajs/bearer'
import Elysia from 'elysia'
import { loginRoute } from './login'
import { mediaRoute } from './media'

export const routes = new Elysia()
  .get('/health', () => 'ok', { detail: { summary: '健康检查' } })
  .group('/api/auth', auth => auth.use(loginRoute))
  .group('/api', api =>
    api
      .use(bearer())
      .onBeforeHandle(async ({ bearer, set }) => {
        if (!bearer || !(await verify(bearer, env.JWT_SECRET))) {
          set.status = 401
          set.headers['WWW-Authenticate'] = `Bearer realm='sign', error="invalid_request"`
          return 'Unauthorized'
        }
      })
      .use(mediaRoute)
      .get('/me', async ({ bearer }) => (await verify(bearer!, env.JWT_SECRET)) as UserClaims, {
        detail: { summary: '获取当前用户信息' }
      })
  )
