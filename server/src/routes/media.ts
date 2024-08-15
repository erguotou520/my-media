import { env } from '@/env'
import { findMediaByPath } from '@/services/media'
import Elysia, { t } from 'elysia'

export const mediaRoute = new Elysia({ prefix: '/media' })
  .get('/list/dirs', async () => {
    return {
      data: env.MEDIA_SCAN_PATHS
    }
  })
  .get('/list/path',
    async ({ query, headers }) => {
      return findMediaByPath(headers['x-base-dir'], query.path)
    },
    {
      headers: t.Object({
        'x-base-dir': t.Union(env.MEDIA_SCAN_PATHS.map(v => t.Literal(v)), { description: '要查询的根目录', })
      }),
      query: t.Object({
        path: t.Optional(t.String({ description: '要查询的目录路径'})),
      })
    }
  )
