import { describe, expect, it, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Profile } from './Profile'
import { renderWithProviders } from '../test/renderWithProviders'
import { setToken, getToken } from '../utils/authStorage'
import { makeToken } from '../test/makeToken'

describe('Profile', () => {
  beforeEach(() => {
    localStorage.clear()
    setToken(makeToken({ _id: '1', email: 'user@example.com' }))
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
