import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Header() {
  const { isAuthenticated } = useAuth()

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="logo">
          🥄poonful
        </Link>
        <Link to={isAuthenticated ? '/profile' : '/login'} className="header-link">
          {isAuthenticated ? 'Profile' : 'Login'}
        </Link>
      </div>
    </header>
  )
}
