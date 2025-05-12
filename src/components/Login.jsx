import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './login.css'

const Login = () => {
  const [clinic, setClinic] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    if (clinic === 'clinic' && password === 'clinic') {
      login()
      navigate('/', { replace: true })
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Clinic"
            value={clinic}
            onChange={(e) => setClinic(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">LOGIN</button>
        </form>
      </div>
    </div>
  )
}

export default Login