import { useState } from 'react'
import './DeleteModal.css'

const API_URL = 'https://clinic-backend-zeta.vercel.app'

const DeleteModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  reason, 
  setReason, 
  loading,
  selectedOrder // Add this prop
}) => {
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!reason.trim() || !selectedOrder) return

    try {
      await onConfirm()
    } catch (error) {
      console.error('Deletion process error:', error)
      setError(error.message)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Buyurtmani o'chirish</h3>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="deleteReason">O'chirish sababini kiriting:</label>
            <textarea
              id="deleteReason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Masalan: Mijoz so'rovi bo'yicha..."
              required
              minLength={3}
              className="reason-input"
              disabled={loading}
            />
          </div>
          
          <div className="modal-actions">
            <button 
              type="button"
              className="cancel-btn" 
              onClick={onClose}
              disabled={loading}
            >
              Bekor qilish
            </button>
            <button 
              type="submit"
              className="confirm-btn" 
              disabled={!reason.trim() || loading}
            >
              {loading ? "O'chirilmoqda..." : "O'chirish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DeleteModal