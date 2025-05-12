import { useState } from 'react'
import DeleteModal from './DeleteModal'
import './Orders.css'

const Orders = () => {
  const [orders, setOrders] = useState([
    { id: 1, service: 'Check-up', price: 100, total: 100, date: '2025-05-12' },
    { id: 2, service: 'Consultation', price: 150, total: 150, date: '2025-05-12' }
  ])
  const [deletedOrders, setDeletedOrders] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [deleteReason, setDeleteReason] = useState('')

  const handleDelete = (order) => {
    setSelectedOrder(order)
    setModalOpen(true)
  }

  const confirmDelete = () => {
    if (selectedOrder && deleteReason) {
      const deletedOrder = {
        ...selectedOrder,
        deleteReason,
        deleteDate: new Date().toISOString()
      }
      setDeletedOrders([deletedOrder, ...deletedOrders])
      setOrders(orders.filter(order => order.id !== selectedOrder.id))
      setModalOpen(false)
      setDeleteReason('')
      setSelectedOrder(null)
    }
  }

  return (
    <div className="orders">
      <h2>Active Orders</h2>
      <div className="orders-list">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Service</th>
              <th>Price</th>
              <th>Total</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.service}</td>
                <td>${order.price}</td>
                <td>${order.total}</td>
                <td>{order.date}</td>
                <td>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(order)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Deleted Orders</h2>
      <div className="deleted-orders-list">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Service</th>
              <th>Price</th>
              <th>Total</th>
              <th>Delete Date</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {deletedOrders.map(order => (
              <tr key={order.id} className="deleted-row">
                <td>{order.id}</td>
                <td>{order.service}</td>
                <td>${order.price}</td>
                <td>${order.total}</td>
                <td>{new Date(order.deleteDate).toLocaleDateString()}</td>
                <td>{order.deleteReason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDelete}
        reason={deleteReason}
        setReason={setDeleteReason}
      />
    </div>
  )
}

export default Orders