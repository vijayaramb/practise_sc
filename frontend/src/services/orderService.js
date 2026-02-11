import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const orderService = {
  // Create a new order
  createOrder: async (orderData) => {
    const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
    return response.data;
  },

  // Get all orders with optional status filter
  getOrders: async (status = '') => {
    const url = status 
      ? `${API_BASE_URL}/orders?status=${status}`
      : `${API_BASE_URL}/orders`;
    const response = await axios.get(url);
    return response.data;
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`);
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    const response = await axios.patch(`${API_BASE_URL}/orders/${orderId}/status`, { status });
    return response.data;
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    const response = await axios.delete(`${API_BASE_URL}/orders/${orderId}`);
    return response.data;
  }
};

export const productService = {
  // Get all products
  getProducts: async (category = '') => {
    const url = category 
      ? `${API_BASE_URL}/products?category=${category}`
      : `${API_BASE_URL}/products`;
    const response = await axios.get(url);
    return response.data;
  },

  // Get product by ID
  getProductById: async (productId) => {
    const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
    return response.data;
  },

  // Get all categories
  getCategories: async () => {
    const response = await axios.get(`${API_BASE_URL}/products/categories`);
    return response.data;
  }
};

export const customerService = {
  // Register new customer
  register: async (customerData) => {
    const response = await axios.post(`${API_BASE_URL}/customers/register`, customerData);
    return response.data;
  },

  // Login customer
  login: async (email) => {
    const response = await axios.post(`${API_BASE_URL}/customers/login`, { email });
    return response.data;
  },

  // Get customer by ID
  getCustomerById: async (customerId) => {
    const response = await axios.get(`${API_BASE_URL}/customers/${customerId}`);
    return response.data;
  },

  // Update customer
  updateCustomer: async (customerId, customerData) => {
    const response = await axios.put(`${API_BASE_URL}/customers/${customerId}`, customerData);
    return response.data;
  }
};
