import { useState, useEffect } from "react";
import DeleteModal from "./DeleteModal";
import "./Orders.css";

const API_URL = "https://clinic-backend-zeta.vercel.app";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [deletedOrders, setDeletedOrders] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/Order`);
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        console.log("Orders:", data);
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Add useEffect for fetching deleted orders
  useEffect(() => {
    const fetchDeletedOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/deleted-orders`, {
          headers: {
            "Accept": "application/json"
          }
        });
        
        if (!res.ok) throw new Error("Failed to fetch deleted orders");
        const data = await res.json();
        console.log("Deleted orders:", data);
        setDeletedOrders(data);
      } catch (err) {
        console.error("Error fetching deleted orders:", err);
      }
    };

    fetchDeletedOrders();
  }, []);

  const handleDelete = (order) => {
    setSelectedOrder(order)
    setModalOpen(true)
  }

  // Update confirmDelete function
  const confirmDelete = async () => {
    if (!selectedOrder || !deleteReason) return;

    try {
      setLoading(true);
      console.log("Processing order deletion:", selectedOrder._id);

      // First delete from orders API
      const deleteResponse = await fetch(`${API_URL}/Order/${selectedOrder._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          reason: deleteReason.trim() 
        })
      });

      if (!deleteResponse.ok) {
        const errorText = await deleteResponse.text();
        console.error("Delete response:", errorText);
        throw new Error("Failed to delete order");
      }

      // After successful deletion, create deleted order record
      const deletedOrderData = {
        originalOrderId: selectedOrder._id,
        total_price: selectedOrder.services.reduce(
          (sum, service) => sum + service.price,
          0
        ),
        services: selectedOrder.services,
        date: selectedOrder.date,
        deletionReason: deleteReason.trim(),
        deletedAt: new Date().toISOString()
      };

      // Save to deleted-orders collection
      const saveToDeletedResponse = await fetch(`${API_URL}/deleted-orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deletedOrderData)
      });

      if (!saveToDeletedResponse.ok) {
        console.error("Warning: Failed to save to deleted-orders history");
      }

      // Update UI
      setOrders(prev => prev.filter(order => order._id !== selectedOrder._id));
      
      // Fetch updated deleted orders list
      const deletedOrdersRes = await fetch(`${API_URL}/deleted-orders`);
      if (deletedOrdersRes.ok) {
        const updatedDeletedOrders = await deletedOrdersRes.json();
        setDeletedOrders(updatedDeletedOrders);
      }

      // Reset states
      setModalOpen(false);
      setSelectedOrder(null);
      setDeleteReason("");

    } catch (err) {
      console.error("Delete process error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="orders">
      <h2>Active Orders</h2>
      {error && (
        <div className="error-message" onClick={() => setError(null)}>
          {error}
        </div>
      )}

      <div className="orders-list">
        {loading && <p>Loading...</p>}
        <table>
          <thead>
            <tr>
              {/* <th>ID</th> */}
              <th>Xizmatlar</th>
              <th>Foyda</th>
              <th>Sana</th>
              <th>Xarakatlar</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                {/* <td>{order._id}</td> */}
                <td>
                  {order.services?.map((service) => (
                    <div key={service._id}>{service.name}</div>
                  ))}
                </td>
                <td>
                  {order.services?.map((service) => (
                    <div key={service._id}>
                      {service.price} so`m
                    </div>
                  ))}
                </td>
                <td>{new Date(order.date).toLocaleDateString()}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(order)}
                    disabled={loading}
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
              <th>Original ID</th>
              <th>Services</th>
              <th>Total Price</th>
              <th>Delete Date</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {deletedOrders.map((order) => (
              <tr key={order._id} className="deleted-row">
                <td>{order.originalOrderId}</td>
                <td>
                  {order.services.map((service) => service.name).join(", ")}
                </td>
                <td>${order.total_price}</td>
                <td>{new Date(order.deletedAt).toLocaleDateString()}</td>
                <td>{order.deletionReason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setSelectedOrder(null)
          setDeleteReason('')
        }}
        onConfirm={confirmDelete}
        reason={deleteReason}
        setReason={setDeleteReason}
        loading={loading}
        selectedOrder={selectedOrder} // Add this prop
      />
    </div>
  );
};

export default Orders;
