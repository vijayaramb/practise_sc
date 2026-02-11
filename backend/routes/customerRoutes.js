const express = require('express');
const router = express.Router();
const {
  registerCustomer,
  loginCustomer,
  getCustomerById,
  updateCustomer
} = require('../controllers/customerController');

// Register new customer
router.post('/register', registerCustomer);

// Login customer
router.post('/login', loginCustomer);

// Get customer by ID
router.get('/:id', getCustomerById);

// Update customer
router.put('/:id', updateCustomer);

module.exports = router;
