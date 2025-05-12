import { Outlet, NavLink } from 'react-router-dom'
import './Layout.css'

const Layout = () => {
  return (
    <div className="layout">
      <nav className="sidebar">
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/categories">Categories</NavLink>
        <NavLink to="/services">Services</NavLink>
      </nav>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout