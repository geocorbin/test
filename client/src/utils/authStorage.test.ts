import { describe, expect, it, beforeEach } from 'vitest'
import { getToken, setToken, clearToken } from './authStorage'

describe('authStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns null when no token is stored', () => {
    expect(getToken()).toBeNull()
  })

  it('stores and retrieves a token', () => {
    setToken('abc123')
    expect(getToken()).toBe('abc123')
  })

  it('removes the token on clearToken', () => {
    setToken('abc123')
    clearToken()
    expect(getToken()).toBeNull()
  })
})
