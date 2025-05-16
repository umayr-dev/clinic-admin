import { useState, useEffect } from 'react'
import './Categories.css'

// Update API_URL to include full path
const API_URL = 'https://clinic-backend-zeta.vercel.app'

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState({
    name: '',
    printerName: '',
    printerIp: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/category`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:5173' // Add your frontend origin
        }
      })
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      
      // Transform the data to match API response format
      const formattedData = data.map(item => ({
        _id: item._id,
        name: item.name,
        printerName: item.printer_name,
        printerIp: item.printer_ip
      }))
      
      console.log('Formatted categories:', formattedData)
      setCategories(formattedData)
    } catch (err) {
      setError(err.message)
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Create category
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      // Transform data to match API's expected format
      const categoryData = {
        name: category.name,
        printer_name: category.printerName,
        printer_ip: category.printerIp
      }

      console.log('Sending category data:', categoryData)

      const response = await fetch(`${API_URL}/category`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:5173' // Add your frontend origin
        },
        body: JSON.stringify(categoryData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create category')
      }
      
      const newCategory = await response.json()
      console.log('Created category:', newCategory)
      
      // Format new category to match component structure
      const formattedCategory = {
        _id: newCategory._id,
        name: newCategory.name,
        printerName: newCategory.printer_name,
        printerIp: newCategory.printer_ip
      }

      setCategories(prev => [...prev, formattedCategory])
      setCategory({ name: '', printerName: '', printerIp: '' })
    } catch (err) {
      setError(err.message)
      console.error('Create error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Delete category
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this category?')
    if (!confirmDelete) return

    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/category/${id}`, { // Updated endpoint
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:5173' // Add your frontend origin
        }
      })

      if (response.ok) {
        // Use the same ID format as received from backend
        setCategories(prev => prev.filter(category => category._id !== id))
      } else {
        const errorText = await response.text()
        console.error('Delete response:', errorText)
        throw new Error('Failed to delete category')
      }
    } catch (err) {
      setError('Failed to delete category. Please try again.')
      console.error('Delete error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <div className="categories">
      <h2>Kategoriyalar</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="category-form">
        <input
          type="text"
          name="name"
          placeholder="Kategoriya nomi"
          value={category.name}
          onChange={(e) => setCategory(prev => ({
            ...prev,
            name: e.target.value
          }))}
          required
        />
        <input
          type="text"
          name="printerName"
          placeholder="Printer nomi"
          value={category.printerName}
          onChange={(e) => setCategory(prev => ({
            ...prev,
            printerName: e.target.value
          }))}
          required
        />
        <input
          type="text"
          name="Printer IP"
          placeholder="Printer IP"
          value={category.printerIp}
          onChange={(e) => setCategory(prev => ({
            ...prev,
            printerIp: e.target.value
          }))}
          pattern="^(\d{1,3}\.){3}\d{1,3}$"
          title="Please enter a valid IP address (e.g., 192.168.1.1)"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Qoshilmoqdaa...' : 'Kategoriya qoshish'}
        </button>
      </form>

      <div className="categories-list">
        {loading && <div className="loading">Yuklanmoqdaa...</div>}
        <table>
          <thead>
            <tr>
              <th>Kategoriya nomi</th>
              <th>Printer nomi</th>
              <th>Printer IP</th>
              <th>Xarakatlar</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat._id}>
                <td>{cat.name}</td>
                <td>{cat.printerName}</td>
                <td>{cat.printerIp}</td>
                <td>
                  <button 
                    className="delete-btn"
                    onClick={() => {
                      console.log('Category to delete:', cat) // Debug log
                      handleDelete(cat._id)
                    }}
                    disabled={loading}
                  >
                    {loading ? 'O`chirilmoqdaa...' : 'O`chirish'}
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

export default Categories