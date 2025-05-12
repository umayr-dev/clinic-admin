import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './components/Login'
import Layout from './components/Layout/Layout'
import Categories from './components/Categories/Categories'
import Services from './components/Services/Services'
import Dashboard from './components/Dashboard/Dashboard'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="categories" element={<Categories />} />
            <Route path="services" element={<Services />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App