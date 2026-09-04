import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types'
import { decodeToken, isTokenExpired } from '../utils/jwt'
import { clearToken, getToken, setToken as saveToken } from '../utils/authStorage'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  setToken: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function userFromToken(token: string | null): User | null {
  if (!token || isTokenExpired(token)) return null
  return decodeToken(token)?.user ?? null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => {
    const stored = getToken()
    return stored && !isTokenExpired(stored) ? stored : null
  })

  useEffect(() => {
    if (token) saveToken(token)
    else clearToken()
  }, [token])

  const user = userFromToken(token)

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        setToken: setTokenState,
        logout: () => setTokenState(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
