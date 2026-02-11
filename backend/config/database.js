const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'orders.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Create customers table
    db.run(`
      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        mobile TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create products table
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        stock INTEGER DEFAULT 100,
        image_url TEXT,
        description TEXT
      )
    `, (err) => {
      if (err) {
        console.error('Error creating products table:', err.message);
      } else {
        // Insert default products if table is empty
        db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
          if (!err && row.count === 0) {
            const products = [
              ['Laptop', 'Computers', 999.99, 50, '💻', 'High-performance laptop'],
              ['Desktop', 'Computers', 1299.99, 30, '🖥️', 'Powerful desktop computer'],
              ['Mouse', 'Accessories', 29.99, 200, '🖱️', 'Wireless optical mouse'],
              ['Keyboard', 'Accessories', 79.99, 150, '⌨️', 'Mechanical keyboard'],
              ['Tablet', 'Mobile', 599.99, 75, '📱', '10-inch tablet'],
              ['Mobile', 'Mobile', 799.99, 100, '📱', 'Smartphone'],
              ['Monitor', 'Computers', 349.99, 60, '🖥️', '27-inch 4K monitor'],
              ['Headphones', 'Accessories', 149.99, 120, '🎧', 'Noise-canceling headphones'],
              ['Webcam', 'Accessories', 89.99, 80, '📷', 'HD webcam'],
              ['Printer', 'Office', 199.99, 40, '🖨️', 'Wireless printer']
            ];

            const stmt = db.prepare('INSERT INTO products (name, category, price, stock, image_url, description) VALUES (?, ?, ?, ?, ?, ?)');
            products.forEach(product => stmt.run(product));
            stmt.finalize();
            console.log('Default products added');
          }
        });
      }
    });

    // Create orders table
    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER NOT NULL,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_mobile TEXT,
        status TEXT DEFAULT 'pending',
        total_amount REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id)
      )
    `, (err) => {
      if (!err) {
        // Migration: Add customer_id and customer_mobile columns if they don't exist
        db.all("PRAGMA table_info(orders)", (err, columns) => {
          if (!err) {
            const hasCustomerId = columns.some(col => col.name === 'customer_id');
            const hasCustomerMobile = columns.some(col => col.name === 'customer_mobile');
            
            if (!hasCustomerId) {
              db.run("ALTER TABLE orders ADD COLUMN customer_id INTEGER", (err) => {
                if (!err) console.log('Migration: Added customer_id column to orders');
              });
            }
            if (!hasCustomerMobile) {
              db.run("ALTER TABLE orders ADD COLUMN customer_mobile TEXT", (err) => {
                if (!err) console.log('Migration: Added customer_mobile column to orders');
              });
            }
          }
        });
      }
    });

    // Create order_items table
    db.run(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER,
        product_name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `, (err) => {
      if (!err) {
        // Migration: Add product_id column if it doesn't exist
        db.all("PRAGMA table_info(order_items)", (err, columns) => {
          if (!err) {
            const hasProductId = columns.some(col => col.name === 'product_id');
            if (!hasProductId) {
              db.run("ALTER TABLE order_items ADD COLUMN product_id INTEGER", (err) => {
                if (err) {
                  console.error('Error adding product_id column:', err.message);
                } else {
                  console.log('Migration: Added product_id column to order_items');
                }
              });
            }
          }
        });
      }
    });

    console.log('Database tables initialized');
  });
}

module.exports = db;
