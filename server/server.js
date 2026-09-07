const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, postman) or if origin matches allowed list
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(null, true); // Alternatively allow all in CORS or strict check
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// Database connection middleware for serverless requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({
      message: err.message,
      hint: 'Check MONGO_URI in Vercel settings and allow 0.0.0.0/0 in MongoDB Atlas Network Access'
    });
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

// Root and Health routes
app.get('/', (req, res) => res.json({ status: 'ok', message: 'Naik Foods API running on Vercel 🌿', endpoints: '/api/products' }));
app.get('/api', (req, res) => res.json({ status: 'ok', message: 'Naik Foods API running on Vercel 🌿', endpoints: '/api/products' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Naik Foods API running 🌿' }));

// Global error handler
app.use((err, req, res, next) => {
  const status = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(status).json({ message: err.message, stack: process.env.NODE_ENV === 'production' ? null : err.stack });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => console.log(`🚀 Naik Foods Server running on port ${PORT}`));
}

module.exports = app;
