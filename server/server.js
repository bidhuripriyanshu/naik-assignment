const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Naik Foods API running 🌿' }));

// Global error handler
app.use((err, req, res, next) => {
  const status = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(status).json({ message: err.message, stack: process.env.NODE_ENV === 'production' ? null : err.stack });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Naik Foods Server running on port ${PORT}`));
