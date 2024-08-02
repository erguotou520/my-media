import crypto from 'node:crypto'

export function generateRandomUUID() {
  return crypto.randomUUID()
}