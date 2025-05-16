import { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import './Dashboard.css'

const API_URL = 'https://clinic-backend-zeta.vercel.app'

const Dashboard = () => {
  const [period, setPeriod] = useState('Kunlik')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch orders with service details
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${API_URL}/Order`)
        if (!res.ok) throw new Error('Failed to fetch orders')
        const data = await res.json()
        console.log('Fetched orders:', data) // Debug log
        setOrders(data)
      } catch (err) {
        console.error('Error fetching orders:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Filter orders based on period
  const getFilteredOrders = () => {
    const now = new Date()
    
    return orders.filter(order => {
      const orderDate = new Date(order.date)
      
      switch(period) {
        case 'Kunlik':
          return orderDate.toDateString() === now.toDateString()
        case 'Haftalik':
          const weekAgo = new Date(now.setDate(now.getDate() - 7))
          return orderDate >= weekAgo
        case 'Oylik':
          return orderDate.getMonth() === now.getMonth() && 
                 orderDate.getFullYear() === now.getFullYear()
        case 'Yillik':
          return orderDate.getFullYear() === now.getFullYear()
        default:
          return true
      }
    })
  }

  // Calculate summary and detailed statistics
  const calculateStats = () => {
    const filteredOrders = getFilteredOrders()
    const statsData = []
    const categorySummary = {}
    let totalRevenue = 0
    let totalServices = 0

    // Process each order
    filteredOrders.forEach(order => {
      if (order.services && Array.isArray(order.services)) {
        order.services.forEach(service => {
          // Add to detailed stats for Excel
          const categoryName = service.category_id?.name || 'Unknown'
          
          statsData.push({
            category: categoryName,
            service: service.name,
            price: Number(service.price),
            date: new Date(order.date).toLocaleDateString()
          })

          // Add to summary stats for UI
          if (!categorySummary[categoryName]) {
            categorySummary[categoryName] = {
              serviceCount: 0,
              revenue: 0
            }
          }
          
          categorySummary[categoryName].serviceCount += 1
          categorySummary[categoryName].revenue += Number(service.price)
          
          totalRevenue += Number(service.price)
          totalServices += 1
        })
      }
    })

    console.log('Service data example:', orders[0]?.services[0]) // Debug log
    console.log('Category summary:', categorySummary) // Debug log

    return { statsData, categorySummary, totalRevenue, totalServices }
  }

  const { statsData, categorySummary, totalRevenue, totalServices } = calculateStats()

  const handleDownload = () => {
    // Prepare detailed Excel data
    const headers = ['Kategoriya', 'Xizmat', 'Narxi', 'Sanasi']
    const data = [
      headers,
      ...statsData.map(item => [
        item.category,
        item.service,
        item.price,
        item.date
      ]),
      [], // Empty row
      ['Jami:', '', totalRevenue, ''] // Total row
    ]

    const ws = XLSX.utils.aoa_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Statistics')
    XLSX.writeFile(wb, `statistics_${period}_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  return (
    <div className="dashboard">
      <h2>Statistika</h2>

      <div className="stats-controls">
        {['Kunlik', 'Haftalik', 'Oylik', 'Yillik'].map(p => (
          <button
            key={p}
            className={period === p ? 'active' : ''}
            onClick={() => setPeriod(p)}
          >
            {p}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Statistika tayyorlanmoqdaa...</p>
      ) : (
        <>
          <div className="summary-stats">
            <div className="total-card">
              <h3>Jami Revenue</h3>
              <p>{totalRevenue.toLocaleString()} so'm</p>
            </div>
            <div className="total-card">
              <h3>Jami Xizmatlar</h3>
              <p>{totalServices}</p>
            </div>
          </div>

          {/* <div className="stats-table">
            <table>
              <thead>
                <tr>
                  <th>Kategoriya</th>
                  <th>Xizmatlar soni</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(categorySummary).map(([category, stats]) => (
                  <tr key={category}>
                    <td></td>
                    <td>{stats.serviceCount}</td>
                    <td>{stats.revenue.toLocaleString()} so'm</td>
                  </tr>
                ))}
                <tr className="total-row">
                  <td>Jami:</td>
                  <td>{totalServices}</td>
                  <td>{totalRevenue.toLocaleString()} so'm</td>
                </tr>
              </tbody>
            </table>
          </div> */}

          <button className="download-btn" onClick={handleDownload}>
            {period} statistikani yuklash (Excel)
          </button>
        </>
      )}
    </div>
  )
}

export default Dashboard
