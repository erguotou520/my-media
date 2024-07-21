import { env } from '@/env'
import Elysia from 'elysia'
import pino from 'pino'

export const logger = pino({
  level: env.LOG_LEVEL || 'info'
})

export const loggerMiddleware = new Elysia()
  .onRequest(ctx => {
    ctx.store = { ...ctx.store, startTime: performance.now() }
  })
  .onAfterResponse(({ as: 'global' }), ctx => {
    const { startTime } = ctx.store as { startTime: number }
    const duration = performance.now() - startTime
    logger.debug({
      method: ctx.request.method,
      url: ctx.request.url,
      status: ctx.set.status || 200,
      duration: `${Math.round(duration * 1000)/1000}ms`
    })
  })
