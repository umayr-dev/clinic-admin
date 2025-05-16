import { useState, useEffect } from 'react'
import './Services.css'

const API_URL = 'https://clinic-backend-zeta.vercel.app'

const Services = () => {
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [service, setService] = useState({
    name: '',
    price: '',
    categoryId: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const servicesRes = await fetch(`${API_URL}/Service`)
        if (!servicesRes.ok) throw new Error('Failed to fetch services')
        const servicesData = await servicesRes.json()

        console.log('Fetched services:', servicesData)

        const extractedCategories = Array.from(
          new Map(
            servicesData.map(s => [s.category_id._id, s.category_id])
          ).values()
        )

        setCategories(extractedCategories)

        const formattedServices = servicesData.map(service => ({
          id: service._id,
          name: service.name,
          price: service.price,
          categoryId: service.category_id._id,
          category_name: service.category_id.name
        }))

        setServices(formattedServices)
      } catch (err) {
        setError(err.message)
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Create service
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)

      if (!service.categoryId) {
        throw new Error('Please select a category')
      }

      const selectedCategory = categories.find(cat => cat._id === service.categoryId)

      const serviceData = {
        name: service.name,
        price: Number(service.price),
        category_id: service.categoryId
      }

      const response = await fetch(`${API_URL}/Service`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData)
      })

      const responseData = await response.json()
      if (!response.ok) {
        throw new Error(JSON.stringify(responseData))
      }

      const formattedService = {
        id: responseData._id,
        name: responseData.name,
        price: responseData.price,
        categoryId: selectedCategory._id,
        category_name: selectedCategory.name
      }

      setServices(prev => [...prev, formattedService])
      setService({ name: '', price: '', categoryId: '' })
    } catch (err) {
      setError(err.message)
      console.error('Create error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Delete service
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this service?')
    if (!confirmDelete) return

    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/Service/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error('Failed to delete service: ' + errorData)
      }

      setServices(prev => prev.filter(s => s.id !== id))
    } catch (err) {
      setError(err.message)
      console.error('Delete error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="services">
      <h2>Xizmatlar</h2>

      {error && (
        <div className="error-message" onClick={() => setError(null)}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="service-form">
        <select
          value={service.categoryId}
          onChange={(e) => setService(prev => ({
            ...prev,
            categoryId: e.target.value
          }))}
          required
        >
          <option value="">Kategoriya tanlang</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Xizmat nomi"
          value={service.name}
          onChange={(e) => setService(prev => ({
            ...prev,
            name: e.target.value
          }))}
          required
        />
        <input
          type="number"
          placeholder="Narx"
          value={service.price}
          onChange={(e) => setService(prev => ({
            ...prev,
            price: e.target.value
          }))}
          min="0"
          step="any"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Qoshilmoqdaa...' : 'Xizmat qoshish'}
        </button>
      </form>

      <div className="services-list">
        {loading && <div className="loading">Loading...</div>}
        <table>
          <thead>
            <tr>
              <th>Xizmat nomi</th>
              <th>Kategoriya</th>
              <th>Narx</th>
              <th>Xarakat</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service.id}>
                <td>{service.name}</td>
                <td>{service.category_name}</td>
                <td>${service.price}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(service.id)}
                    disabled={loading}
                  >
                    {loading ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Services
