import { describe, expect, it } from 'vitest'
import { decodeToken, isTokenExpired } from './jwt'

function makeToken(payload: object): string {
  const base64url = (obj: object) => btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_')
  return `${base64url({ alg: 'HS256' })}.${base64url(payload)}.signature`
}

describe('decodeToken', () => {
  it('decodes the user payload of a well-formed token', () => {
    const token = makeToken({ user: { _id: '1', email: 'a@b.com' }, exp: 9999999999 })
    expect(decodeToken(token)?.user).toEqual({ _id: '1', email: 'a@b.com' })
  })

  it('returns null for a malformed token', () => {
    expect(decodeToken('not-a-token')).toBeNull()
  })
})

describe('isTokenExpired', () => {
  it('returns false for a token with a future expiry', () => {
    const token = makeToken({ user: { _id: '1', email: 'a@b.com' }, exp: Math.floor(Date.now() / 1000) + 3600 })
    expect(isTokenExpired(token)).toBe(false)
  })

  it('returns true for a token with a past expiry', () => {
    const token = makeToken({ user: { _id: '1', email: 'a@b.com' }, exp: Math.floor(Date.now() / 1000) - 3600 })
    expect(isTokenExpired(token)).toBe(true)
  })

  it('returns true for a malformed token', () => {
    expect(isTokenExpired('garbage')).toBe(true)
  })
})
