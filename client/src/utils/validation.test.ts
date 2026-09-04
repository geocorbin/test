import { describe, expect, it } from 'vitest'
import { isValidEmail, isValidPassword } from './validation'

describe('isValidEmail', () => {
  it('accepts well-formed email addresses', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
  })

  it('trims surrounding whitespace before validating', () => {
    expect(isValidEmail('  user@example.com  ')).toBe(true)
  })

  it('rejects strings without an @', () => {
    expect(isValidEmail('userexample.com')).toBe(false)
  })

  it('rejects strings without a domain', () => {
    expect(isValidEmail('user@')).toBe(false)
  })

  it('rejects empty strings', () => {
    expect(isValidEmail('')).toBe(false)
  })
})

describe('isValidPassword', () => {
  it('accepts passwords with 8 or more characters', () => {
    expect(isValidPassword('password123')).toBe(true)
  })

  it('rejects passwords shorter than 8 characters', () => {
    expect(isValidPassword('short')).toBe(false)
  })

  it('accepts exactly 8 characters as the boundary', () => {
    expect(isValidPassword('12345678')).toBe(true)
  })
})
