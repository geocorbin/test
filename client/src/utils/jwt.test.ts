import { describe, expect, it } from 'vitest'
import { decodeToken } from './jwt'
import { makeToken } from '../test/makeToken'

describe('decodeToken', () => {
  it('decodes the user payload of a well-formed token', () => {
    const token = makeToken({ _id: '1', email: 'a@b.com' })
    expect(decodeToken(token)?.user).toEqual({ _id: '1', email: 'a@b.com' })
  })

  it('returns null for a malformed token', () => {
    expect(decodeToken('not-a-token')).toBeNull()
  })
})
