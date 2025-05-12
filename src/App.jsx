import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Layout from './components/Layout/Layout'
import Categories from './components/Categories/Categories'
import Services from './components/Services/Services'
import Dashboard from './components/Dashboard/Dashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="categories" element={<Categories />} />
          <Route path="services" element={<Services />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App