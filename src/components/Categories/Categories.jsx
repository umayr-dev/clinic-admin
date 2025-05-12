import { useState } from 'react'
import './Categories.css'

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [printerName, setPrinterName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const newCategory = {
      id: Date.now(),
      name,
      printerName
    }
    setCategories([...categories, newCategory])
    setName('')
    setPrinterName('')
  }

  const handleDelete = (id) => {
    setCategories(categories.filter(cat => cat.id !== id))
  }

  return (
    <div className="categories">
      <h2>Categories</h2>
      
      <form onSubmit={handleSubmit} className="category-form">
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Printer Name"
          value={printerName}
          onChange={(e) => setPrinterName(e.target.value)}
        />
        <button type="submit">Add Category</button>
      </form>

      <div className="categories-list">
        {categories.map(category => (
          <div key={category.id} className="category-item">
            <span>{category.name} - {category.printerName}</span>
            <button onClick={() => handleDelete(category.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Categories