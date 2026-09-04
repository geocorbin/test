import { describe, expect, it, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Profile } from './Profile'
import { renderWithProviders } from '../test/renderWithProviders'
import { setToken, getToken } from '../utils/authStorage'

function makeToken(): string {
  const base64url = (obj: object) => btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_')
  const exp = Math.floor(Date.now() / 1000) + 3600
  return `${base64url({ alg: 'HS256' })}.${base64url({ user: { _id: '1', email: 'user@example.com' }, exp })}.sig`
}

describe('Profile', () => {
  beforeEach(() => {
    localStorage.clear()
    setToken(makeToken())
  })

  it("displays the logged-in user's email", () => {
    renderWithProviders(<Profile />)
    expect(screen.getByText('user@example.com')).toBeInTheDocument()
  })

  it('logs out and clears the token when Log Out is clicked', async () => {
    renderWithProviders(<Profile />)
    await userEvent.click(screen.getByRole('button', { name: 'Log Out' }))
    expect(getToken()).toBeNull()
  })
})
