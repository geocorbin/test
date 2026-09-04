import { describe, expect, it, vi, beforeEach } from 'vitest'
import apiClient from './client'
import { signup, login } from './auth'

vi.mock('./client', () => ({
  default: {
    post: vi.fn(),
  },
}))

const mockedClient = vi.mocked(apiClient, { deep: true })

describe('auth api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('signup posts credentials and returns the token', async () => {
    mockedClient.post.mockResolvedValueOnce({ data: { token: 'abc' } })
    const result = await signup({ email: 'a@b.com', password: 'password123' })
    expect(mockedClient.post).toHaveBeenCalledWith('/users/signup', { email: 'a@b.com', password: 'password123' })
    expect(result).toEqual({ token: 'abc' })
  })

  it('login posts credentials and returns the token', async () => {
    mockedClient.post.mockResolvedValueOnce({ data: { token: 'xyz' } })
    const result = await login({ email: 'a@b.com', password: 'password123' })
    expect(mockedClient.post).toHaveBeenCalledWith('/users/login', { email: 'a@b.com', password: 'password123' })
    expect(result).toEqual({ token: 'xyz' })
  })
})
