import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Layout.css'

const Layout = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="nav-links">
          <NavLink to="/" end>Umumiy</NavLink>
          <NavLink to="/categories">Kategoriyalar</NavLink>
          <NavLink to="/services">Xizmatlar</NavLink>
          <NavLink to="/orders">Buyurtmalar</NavLink>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Chiqish
        </button>
      </nav>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout