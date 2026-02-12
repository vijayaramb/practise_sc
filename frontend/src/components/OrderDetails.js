import React, { useState, useEffect, useCallback } from 'react';
import './OrderDetails.css';

function OrderDetails({ orderId, onClose, orderService }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  //Make the function identity stable
  const fetchOrderDetails = useCallback(async () => {
    if(!orderId) return;
    try {
      setLoading(true);
      const data = await orderService.getOrderById(orderId);
      setOrder(data);
      setError('');
    } catch (err) {
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  }, [orderId, orderService]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="error">{error}</div>
          <button onClick={onClose} className="close-btn">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content order-details" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Order Details - #{order.id}</h2>
          <button onClick={onClose} className="close-icon">&times;</button>
        </div>

        <div className="details-section">
          <h3>Customer Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Name:</label>
              <span>{order.customer_name}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{order.customer_email}</span>
            </div>
            <div className="info-item">
              <label>Status:</label>
              <span className={`status-badge status-${order.status}`}>
                {order.status}
              </span>
            </div>
            <div className="info-item">
              <label>Created:</label>
              <span>{formatDate(order.created_at)}</span>
            </div>
            <div className="info-item">
              <label>Updated:</label>
              <span>{formatDate(order.updated_at)}</span>
            </div>
          </div>
        </div>

        <div className="details-section">
          <h3>Order Items</h3>
          <table className="items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.product_name}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="total-label">Total:</td>
                <td className="total-amount">${order.total_amount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="close-btn">Close</button>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
