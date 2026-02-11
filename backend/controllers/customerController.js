const db = require('../config/database');

// Register new customer
const registerCustomer = (req, res) => {
  const { name, email, mobile } = req.body;

  if (!name || !email || !mobile) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if email already exists
  db.get('SELECT id FROM customers WHERE email = ?', [email], (err, customer) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (customer) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Insert new customer
    db.run(
      'INSERT INTO customers (name, email, mobile) VALUES (?, ?, ?)',
      [name, email, mobile],
      function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
          message: 'Customer registered successfully',
          customer: {
            id: this.lastID,
            name,
            email,
            mobile
          }
        });
      }
    );
  });
};

// Login customer (check if exists)
const loginCustomer = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  db.get('SELECT * FROM customers WHERE email = ?', [email], (err, customer) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({
      message: 'Login successful',
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        mobile: customer.mobile
      }
    });
  });
};

// Get customer by ID
const getCustomerById = (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM customers WHERE id = ?', [id], (err, customer) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(customer);
  });
};

// Update customer info
const updateCustomer = (req, res) => {
  const { id } = req.params;
  const { name, mobile } = req.body;

  db.run(
    'UPDATE customers SET name = ?, mobile = ? WHERE id = ?',
    [name, mobile, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      res.json({ message: 'Customer updated successfully' });
    }
  );
};

module.exports = {
  registerCustomer,
  loginCustomer,
  getCustomerById,
  updateCustomer
};
