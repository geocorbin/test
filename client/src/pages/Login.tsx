import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { login } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export function Login() {
  const navigate = useNavigate()
  const { setToken } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      const { token } = await login({ email: email.trim(), password })
      setToken(token)
      navigate('/dashboard')
    } catch {
      setError('Incorrect email or password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout narrow>
      <form className="card" onSubmit={handleSubmit}>
        <h1>Welcome Back!</h1>
        <p className="text-muted">Log in to your account to continue</p>

        <div className="form-group">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="form-error">{error}</p>}
        </div>

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in…' : 'Login'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/signup')}>
          Create an Account
        </button>
        <Link to="/recipes" className="center-link">
          Explore Recipes without Logging in
        </Link>
      </form>
    </Layout>
  )
}
