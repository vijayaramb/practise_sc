import React, { useState, useEffect } from 'react';
import './OrderList.css';

function OrderList({ orders, onOrderSelect, onRefresh, onCancelOrder, onUpdateStatus }) {
  const [statusFilter, setStatusFilter] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    if (statusFilter) {
      setFilteredOrders(orders.filter(order => order.status === statusFilter));
    } else {
      setFilteredOrders(orders);
    }
  }, [orders, statusFilter]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'processing':
        return 'status-processing';
      case 'shipping':
        return 'status-shipping';
      case 'delivered':
        return 'status-delivered';
      default:
        return '';
    }
  };

  const handleCancelOrder = async (orderId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to cancel this order?')) {
      await onCancelOrder(orderId);
    }
  };

  const handleStatusChange = async (orderId, newStatus, e) => {
    e.stopPropagation();
    await onUpdateStatus(orderId, newStatus);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="order-list">
      <div className="list-header">
        <h2>All Orders ({filteredOrders.length})</h2>
        <div className="controls">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipping">Shipping</option>
            <option value="delivered">Delivered</option>
          </select>
          <button onClick={onRefresh} className="refresh-btn">
            Refresh
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="no-orders">No orders found</div>
      ) : (
        <div className="orders-grid">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="order-card"
              onClick={() => onOrderSelect(order.id)}
            >
              <div className="order-header">
                <span className="order-id">Order #{order.id}</span>
                <span className={`status-badge ${getStatusClass(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div className="order-details">
                <p><strong>Customer:</strong> {order.customer_name}</p>
                <p><strong>Email:</strong> {order.customer_email}</p>
                <p><strong>Total:</strong> ${order.total_amount.toFixed(2)}</p>
                <p><strong>Created:</strong> {formatDate(order.created_at)}</p>
              </div>
              <div className="order-actions">
                {order.status === 'pending' && (
                  <button
                    className="cancel-btn"
                    onClick={(e) => handleCancelOrder(order.id, e)}
                  >
                    Cancel Order
                  </button>
                )}
                {order.status !== 'delivered' && (
                  <select
                    className="status-select"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value, e)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipping">Shipping</option>
                    <option value="delivered">Delivered</option>
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderList;
