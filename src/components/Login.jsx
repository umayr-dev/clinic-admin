import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

const Login = () => {
  const [clinic, setClinic] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you can add your authentication logic
    if (clinic === 'clinic' && password === 'clinic') {
      navigate('/')
    } else {
      alert('Invalid credentials')
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
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Clinic"
            value={clinic}
            onChange={(e) => setClinic(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">LOGIN</button>
        </form>
      </div>
    </div>
  )
}

export default Login