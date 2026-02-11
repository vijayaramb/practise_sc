const db = require('../config/database');

// Create order with multiple items
const createOrder = (req, res) => {
  const { customer_id, customer_name, customer_email, customer_mobile, items } = req.body;

  if (!customer_id || !customer_name || !customer_email || !customer_mobile || !items || items.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const total_amount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  db.run(
    `INSERT INTO orders (customer_id, customer_name, customer_email, customer_mobile, total_amount, status) VALUES (?, ?, ?, ?, ?, 'pending')`,
    [customer_id, customer_name, customer_email, customer_mobile, total_amount],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const orderId = this.lastID;
      const itemPromises = items.map(item => {
        return new Promise((resolve, reject) => {
          db.run(
            `INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES (?, ?, ?, ?, ?)`,
            [orderId, item.product_id || null, item.product_name, item.quantity, item.price],
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });
      });

      Promise.all(itemPromises)
        .then(() => {
          res.status(201).json({
            message: 'Order created successfully',
            order_id: orderId,
            total_amount
          });
        })
        .catch(err => {
          res.status(500).json({ error: err.message });
        });
    }
  );
};

// Get order by ID
const getOrderById = (req, res) => {
  const { id } = req.params;

  db.get(
    `SELECT * FROM orders WHERE id = ?`,
    [id],
    (err, order) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      db.all(
        `SELECT * FROM order_items WHERE order_id = ?`,
        [id],
        (err, items) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ ...order, items });
        }
      );
    }
  );
};

// Update order status
const updateOrderStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'processing', 'shipping', 'delivered'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  db.run(
    `UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [status, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json({ message: 'Order status updated successfully', status });
    }
  );
};

// List all orders with optional status filter
const listOrders = (req, res) => {
  const { status } = req.query;

  let query = `SELECT * FROM orders`;
  const params = [];

  if (status) {
    query += ` WHERE status = ?`;
    params.push(status);
  }

  query += ` ORDER BY created_at DESC`;

  db.all(query, params, (err, orders) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(orders);
  });
};

// Cancel order (only pending orders)
const cancelOrder = (req, res) => {
  const { id } = req.params;

  db.get(
    `SELECT status FROM orders WHERE id = ?`,
    [id],
    (err, order) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      if (order.status !== 'pending') {
        return res.status(400).json({ error: 'Only pending orders can be cancelled' });
      }

      db.run(
        `DELETE FROM orders WHERE id = ?`,
        [id],
        function(err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ message: 'Order cancelled successfully' });
        }
      );
    }
  );
};

module.exports = {
  createOrder,
  getOrderById,
  updateOrderStatus,
  listOrders,
  cancelOrder
};
