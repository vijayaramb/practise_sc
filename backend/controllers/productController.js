const db = require('../config/database');

// Get all products
const getAllProducts = (req, res) => {
  const { category } = req.query;
  
  let query = 'SELECT * FROM products WHERE stock > 0';
  const params = [];
  
  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  
  query += ' ORDER BY category, name';
  
  db.all(query, params, (err, products) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(products);
  });
};

// Get product by ID
const getProductById = (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, product) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  });
};

// Get all categories
const getCategories = (req, res) => {
  db.all('SELECT DISTINCT category FROM products ORDER BY category', (err, categories) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(categories.map(c => c.category));
  });
};

module.exports = {
  getAllProducts,
  getProductById,
  getCategories
};
