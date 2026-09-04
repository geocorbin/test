import { Link, useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useAuth } from '../context/AuthContext'

export function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <Layout narrow>
      <nav className="breadcrumb">
        <Link to="/dashboard">Home</Link> / <span>Your Profile</span>
      </nav>

      <div className="card">
        <h1>Your Profile</h1>
        <div className="form-group">
          <span className="form-label">Username</span>
          <p>{user.email}</p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </Layout>
  )
}
