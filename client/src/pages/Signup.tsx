import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { signup } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import { isValidEmail, isValidPassword } from '../utils/validation'

export function Signup() {
  const navigate = useNavigate()
  const { setToken } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const nextEmailError = isValidEmail(email) ? '' : 'Please enter a valid email address as your username.'
    const nextPasswordError = isValidPassword(password) ? '' : 'Password must be at least 8 characters.'
    setEmailError(nextEmailError)
    setPasswordError(nextPasswordError)
    setFormError('')
    if (nextEmailError || nextPasswordError) return

    setIsSubmitting(true)
    try {
      const { token } = await signup({ email: email.trim(), password })
      setToken(token)
      navigate('/dashboard')
    } catch {
      setFormError('That email may already have an account. Please try logging in.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout narrow>
      <form className="card" onSubmit={handleSubmit}>
        <h1>Create an Account</h1>

        <div className="form-group">
          <label htmlFor="signup-email">Username</label>
          <input
            id="signup-email"
            type="email"
            placeholder="jsync@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p className="form-error">{emailError}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <p className="form-error">{passwordError}</p>}
        </div>

        {formError && <p className="form-error">{formError}</p>}

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Creating…' : 'Create Account'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/login')}>
          Cancel
        </button>
      </form>
    </Layout>
  )
}
