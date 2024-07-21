import { type JWTPayload, SignJWT, jwtVerify } from 'jose'

export function sign(
  payload: JWTPayload,
  secret: string,
  options: {
    alg?: string
    crit?: string[]
    nbf?: number | string
    exp?: number | string
  } = {}
) {
  const jwt = new SignJWT({
    ...payload
  }).setProtectedHeader({
    alg: options.alg || 'HS256',
    crit: options.crit
  })
  if (options.nbf) {
    jwt.setNotBefore(options.nbf)
  }
  if (options.exp) {
    jwt.setExpirationTime(options.exp)
  }
  return jwt.sign(new TextEncoder().encode(secret))
}

export async function verify(token: string, secret: string) {
  const result = await jwtVerify(token, new TextEncoder().encode(secret), {})
  return result.payload
}
