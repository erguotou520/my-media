import { z } from 'zod'

const envVariables = z.object({
  // server
  PORT: z.coerce.number().optional().default(3222),
  LOG_LEVEL: z.enum(['silent', "fatal", "error", "warn", "info", "debug", "trace"]).optional(),
  // jwt
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().optional().default('7d'),
  // database
  SQLITE_DB_PATH: z.string().optional().default('./db/media.db'),
  // media scan paths
  // parse from string to array of strings, separated by ,
  MEDIA_SCAN_PATHS: z.string().transform(paths => paths.split(','))
})

export const env = envVariables.parse(process.env)
