import { env } from '@/env'
import { logger, loggerMiddleware } from '@/middlewares/log'
import { routes } from '@/routes'
import { staticPlugin } from '@elysiajs/static'
import { swagger } from '@elysiajs/swagger'
import type { BunFile } from 'bun'
import { Elysia, t } from 'elysia'
import { setup } from './setup'

setup().then(() => {
  logger.info('😃 Server setup complete')
})

const app = new Elysia()
  .use(loggerMiddleware)
  .use(swagger({ scalarCDN: 'https://cdnjs.cloudflare.com/ajax/libs/scalar-api-reference/1.16.2/standalone.min.js' }))
  .use(staticPlugin({ assets: 'html', prefix: '', noCache: true }))
  .use(routes)
  .onError(async ({ code }) => {
    if (code === 'NOT_FOUND') {
      const file = Bun.file('html/index.html')
      const etag = await generateETag(file)
      return new Response(Bun.file('html/index.html'), {
        headers: {
          Etag: etag,
          'Cache-Control': 'public, max-age=86400'
        }
      })
    }
  })
  .listen(env.PORT || 3001, server => {
    // emoji
    console.log(`🚀  Server started at http://localhost:${server.port}`)
  })

export async function generateETag(file: BunFile) {
  const hash = new Bun.CryptoHasher('md5')
  hash.update(await file.arrayBuffer())
  return hash.digest('base64')
}
