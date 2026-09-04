import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { AuthProvider } from '../context/AuthContext'
import { setToken } from '../utils/authStorage'
import { makeToken } from '../test/makeToken'

function renderProtected(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<p>Login Page</p>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<p>Dashboard Page</p>} />
          </Route>
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('redirects to /login when not authenticated', () => {
    renderProtected('/dashboard')
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('renders the nested route when authenticated', () => {
    setToken(makeToken({ _id: '1', email: 'a@b.com' }))
    renderProtected('/dashboard')
    expect(screen.getByText('Dashboard Page')).toBeInTheDocument()
  })
})
