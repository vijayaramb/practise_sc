const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  updateOrderStatus,
  listOrders,
  cancelOrder
} = require('../controllers/orderController');

// Create a new order
router.post('/', createOrder);

// Get all orders (with optional status filter)
router.get('/', listOrders);

// Get order by ID
router.get('/:id', getOrderById);

// Update order status
router.patch('/:id/status', updateOrderStatus);

// Cancel order
router.delete('/:id', cancelOrder);

module.exports = router;
