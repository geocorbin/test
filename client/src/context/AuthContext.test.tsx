import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from './AuthContext'
import { getToken } from '../utils/authStorage'
import { makeToken } from '../test/makeToken'

function TestConsumer() {
  const { user, isAuthenticated, setToken, logout } = useAuth()
  return (
    <div>
      <p data-testid="status">{isAuthenticated ? `in:${user?.email}` : 'out'}</p>
      <button onClick={() => setToken(makeToken({ _id: '1', email: 'a@b.com' }))}>Log in</button>
      <button onClick={logout}>Log out</button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts logged out when there is no stored token', () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )
    expect(screen.getByTestId('status')).toHaveTextContent('out')
  })

  it('logs in and persists the token when setToken is called', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }))
    expect(screen.getByTestId('status')).toHaveTextContent('in:a@b.com')
    expect(getToken()).not.toBeNull()
  })

  it('logs out and clears the stored token', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }))
    await userEvent.click(screen.getByRole('button', { name: 'Log out' }))
    expect(screen.getByTestId('status')).toHaveTextContent('out')
    expect(getToken()).toBeNull()
  })
})
