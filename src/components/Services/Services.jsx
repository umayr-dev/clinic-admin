import { useState } from 'react'

const Services = () => {
  const [services, setServices] = useState([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [categoryId, setCategoryId] = useState('')
  
  // This would typically come from your API/backend
  const categories = [] // You'll need to populate this with your categories

  const handleSubmit = (e) => {
    e.preventDefault()
    const newService = {
      id: Date.now(),
      name,
      price: Number(price),
      categoryId: Number(categoryId)
    }
    setServices([...services, newService])
    setName('')
    setPrice('')
    setCategoryId('')
  }

  return (
    <div className="services">
      <h2>Services</h2>
      
      <form onSubmit={handleSubmit} className="service-form">
        <select 
          value={categoryId} 
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Service Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <button type="submit">Add Service</button>
      </form>

      <div className="services-list">
        {services.map(service => (
          <div key={service.id} className="service-item">
            <span>{service.name} - ${service.price}</span>
            <button onClick={() => setServices(services.filter(s => s.id !== service.id))}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Services