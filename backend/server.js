const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/database');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const customerRoutes = require('./routes/customerRoutes');
const { startAutoStatusUpdate } = require('./utils/autoUpdate');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start auto-update mechanism
startAutoStatusUpdate();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Auto-update mechanism started`);
});
