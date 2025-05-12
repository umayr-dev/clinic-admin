import './DeleteModal.css'

const DeleteModal = ({ isOpen, onClose, onConfirm, reason, setReason }) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Delete Order</h3>
        <p>Please provide a reason for deletion:</p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason..."
          required
        />
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button 
            className="confirm-btn" 
            onClick={onConfirm}
            disabled={!reason.trim()}
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal