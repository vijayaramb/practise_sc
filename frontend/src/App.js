import React, { useState, useEffect } from 'react';
import './App.css';
import CustomerAuth from './components/CustomerAuth';
import CreateOrder from './components/CreateOrder';
import OrderList from './components/OrderList';
import OrderDetails from './components/OrderDetails';
import { orderService, customerService } from './services/orderService';

function App() {
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    // Check if customer is logged in from localStorage
    const savedCustomer = localStorage.getItem('customer');
    if (savedCustomer) {
      setCustomer(JSON.parse(savedCustomer));
    }
  }, []);

  useEffect(() => {
    if (customer) {
      fetchOrders();
      // Refresh orders every 30 seconds to see auto-updates
      const interval = setInterval(fetchOrders, 30000);
      return () => clearInterval(interval);
    }
  }, [customer]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (error) {
      showNotification('Failed to fetch orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (data, isRegistering) => {
    try {
      let result;
      if (isRegistering) {
        result = await customerService.register(data);
      } else {
        result = await customerService.login(data.email);
      }
      
      const customerData = result.customer;
      setCustomer(customerData);
      localStorage.setItem('customer', JSON.stringify(customerData));
      showNotification(`Welcome ${customerData.name}!`, 'success');
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    setCustomer(null);
    localStorage.removeItem('customer');
    setOrders([]);
    showNotification('Logged out successfully', 'success');
  };

  const handleCreateOrder = async (orderData) => {
    try {
      const result = await orderService.createOrder(orderData);
      showNotification(`Order #${result.order_id} created successfully!`, 'success');
      await fetchOrders();
    } catch (error) {
      throw error;
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await orderService.cancelOrder(orderId);
      showNotification('Order cancelled successfully', 'success');
      await fetchOrders();
      if (selectedOrderId === orderId) {
        setSelectedOrderId(null);
      }
    } catch (error) {
      showNotification(error.response?.data?.error || 'Failed to cancel order', 'error');
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      showNotification('Order status updated successfully', 'success');
      await fetchOrders();
    } catch (error) {
      showNotification('Failed to update order status', 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 3000);
  };

  if (!customer) {
    return <CustomerAuth onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <header className="app-header">
        <div>
          <h1>Order Processing System</h1>
          <p>Manage your orders efficiently</p>
        </div>
        <div className="header-actions">
          <div className="user-info">
            <span className="user-name">{customer.name}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      {notification.message && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <main className="app-main">
        <CreateOrder onOrderCreated={handleCreateOrder} customer={customer} />
        
        {loading && <div className="loading-indicator">Loading orders...</div>}
        
        <OrderList
          orders={orders}
          onOrderSelect={setSelectedOrderId}
          onRefresh={fetchOrders}
          onCancelOrder={handleCancelOrder}
          onUpdateStatus={handleUpdateStatus}
        />

        {selectedOrderId && (
          <OrderDetails
            orderId={selectedOrderId}
            onClose={() => setSelectedOrderId(null)}
            orderService={orderService}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Order Processing System &copy; 2026</p>
      </footer>
    </div>
  );
}

export default App;
