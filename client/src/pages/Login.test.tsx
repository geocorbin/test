import { describe, expect, it, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Login } from './Login'
import { renderWithProviders } from '../test/renderWithProviders'
import * as authApi from '../api/auth'

vi.mock('../api/auth')

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders the welcome heading and form fields', () => {
    renderWithProviders(<Login />)
    expect(screen.getByRole('heading', { name: 'Welcome Back!' })).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })

  it('logs in with the entered credentials', async () => {
    vi.mocked(authApi.login).mockResolvedValueOnce({ token: 'fake-token' })
    renderWithProviders(<Login />)

    await userEvent.type(screen.getByLabelText('Email'), 'user@example.com')
    await userEvent.type(screen.getByLabelText('Password'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))

    expect(authApi.login).toHaveBeenCalledWith({ email: 'user@example.com', password: 'password123' })
  })

  it('shows an error message when login fails', async () => {
    vi.mocked(authApi.login).mockRejectedValueOnce(new Error('bad credentials'))
    renderWithProviders(<Login />)

    await userEvent.type(screen.getByLabelText('Email'), 'user@example.com')
    await userEvent.type(screen.getByLabelText('Password'), 'wrongpassword')
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))

    expect(await screen.findByText('Incorrect email or password.')).toBeInTheDocument()
  })
})
