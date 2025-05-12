import { useState, useEffect } from 'react'
import * as XLSX from 'xlsx';
import './Dashboard.css'

const Dashboard = () => {
  const [period, setPeriod] = useState('daily')
  const [stats, setStats] = useState({
    daily: { revenue: 1200, services: 45 },
    weekly: { revenue: 8400, services: 320 },
    monthly: { revenue: 35000, services: 1250 },
    yearly: { revenue: 420000, services: 15000 }
  })

  const handleDownload = () => {
    // Create data for excel
    const data = [
      ['Period', 'Total Revenue', 'Total Services'],
      [period.toUpperCase(), stats[period].revenue, stats[period].services]
    ];

    // Create workbook and worksheet
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Statistics");

    // Save file
    XLSX.writeFile(wb, `statistics_${period}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      
      <div className="stats-controls">
        <button 
          className={period === 'daily' ? 'active' : ''} 
          onClick={() => setPeriod('daily')}
        >
          Daily
        </button>
        <button 
          className={period === 'weekly' ? 'active' : ''} 
          onClick={() => setPeriod('weekly')}
        >
          Weekly
        </button>
        <button 
          className={period === 'monthly' ? 'active' : ''} 
          onClick={() => setPeriod('monthly')}
        >
          Monthly
        </button>
        <button 
          className={period === 'yearly' ? 'active' : ''} 
          onClick={() => setPeriod('yearly')}
        >
          Yearly
        </button>
      </div>

      <div className="stats-display">
        <div className="stats-card">
          <h3>Total Revenue</h3>
          <p>${stats[period].revenue.toLocaleString()}</p>
        </div>
        <div className="stats-card">
          <h3>Total Services</h3>
          <p>{stats[period].services.toLocaleString()}</p>
        </div>
      </div>

      <button className="download-btn" onClick={handleDownload}>
        Download {period.charAt(0).toUpperCase() + period.slice(1)} Statistics (Excel)
      </button>
    </div>
  )
}

export default Dashboard