const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  getCategories
} = require('../controllers/productController');

// Get all products (with optional category filter)
router.get('/', getAllProducts);

// Get all categories
router.get('/categories', getCategories);

// Get product by ID
router.get('/:id', getProductById);

module.exports = router;
