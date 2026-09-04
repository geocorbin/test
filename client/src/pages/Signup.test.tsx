import { describe, expect, it, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Signup } from './Signup'
import { renderWithProviders } from '../test/renderWithProviders'
import * as authApi from '../api/auth'

vi.mock('../api/auth')

describe('Signup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('validates email format before submitting', async () => {
    renderWithProviders(<Signup />)
    await userEvent.type(screen.getByLabelText('Username'), 'not-an-email')
    await userEvent.type(screen.getByLabelText('Password'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: 'Create Account' }))

    expect(screen.getByText('Please enter a valid email address as your username.')).toBeInTheDocument()
    expect(authApi.signup).not.toHaveBeenCalled()
  })

  it('validates minimum password length before submitting', async () => {
    renderWithProviders(<Signup />)
    await userEvent.type(screen.getByLabelText('Username'), 'user@example.com')
    await userEvent.type(screen.getByLabelText('Password'), 'short')
    await userEvent.click(screen.getByRole('button', { name: 'Create Account' }))

    expect(screen.getByText('Password must be at least 8 characters.')).toBeInTheDocument()
    expect(authApi.signup).not.toHaveBeenCalled()
  })

  it('signs up successfully with valid input', async () => {
    vi.mocked(authApi.signup).mockResolvedValueOnce({ token: 'fake-token' })
    renderWithProviders(<Signup />)

    await userEvent.type(screen.getByLabelText('Username'), 'user@example.com')
    await userEvent.type(screen.getByLabelText('Password'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: 'Create Account' }))

    expect(authApi.signup).toHaveBeenCalledWith({ email: 'user@example.com', password: 'password123' })
  })
})
