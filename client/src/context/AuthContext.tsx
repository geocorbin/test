import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types'
import { decodeToken } from '../utils/jwt'
import { clearToken, getToken, setToken as saveToken } from '../utils/authStorage'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  setToken: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState(getToken())
  const user = token ? (decodeToken(token)?.user ?? null) : null

  function setToken(newToken: string) {
    saveToken(newToken)
    setTokenState(newToken)
  }

  function logout() {
    clearToken()
    setTokenState(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
