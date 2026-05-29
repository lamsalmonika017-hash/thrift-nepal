const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { createUserTable, ensureDefaultAdmin } = require('./models/User');
const { createProductTable } = require('./models/Product');
const { createOrderTable, createCartTable, createWishlistTable, createPaymentTable } = require('./models/index');
const routes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── CORS ──────────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// ─── Body Parsers ──────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Static Files ─────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── API Routes ───────────────────────────────────────────────────────────
app.use('/api', routes);

// ─── API 404 ──────────────────────────────────────────────────────────────
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// ─── Error Handler ────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

// ─── Init DB & Start ──────────────────────────────────────────────────────
const initDB = async () => {
  await createUserTable();
  await createProductTable();
  await createOrderTable();
  await createCartTable();
  await createWishlistTable();
  await createPaymentTable();
  await ensureDefaultAdmin();
  console.log('✅ All tables initialized');
};

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Thrift Nepal server running on port ${PORT}`);
      console.log(`📦 API: http://localhost:${PORT}/api`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to initialize DB:', err);
    process.exit(1);
  });