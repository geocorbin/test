import type { User } from '../types'

export function makeToken(user: User): string {
  const base64url = (obj: object) => btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_')
  return `${base64url({ alg: 'HS256' })}.${base64url({ user })}.signature`
}
