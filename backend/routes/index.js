const express = require('express');
const { authMiddleware, adminMiddleware } = require('../config/jwt');
const { uploadProductImages, uploadPaymentScreenshot, uploadAvatar } = require('../config/multer');

const {
  register, login, getMe, updateProfile,
} = require('../controllers/authController');

const {
  getAllProducts, getFeaturedProducts, getTrendingProducts, getRecentProducts,
  getProductsByCategory, getProduct, getMyProducts, createProduct, updateProduct,
  deleteProduct, markAsSold, adminGetAllProducts, toggleFeatured,
} = require('../controllers/productController');

const {
  getCart, addToCart, updateCartItem, removeFromCart, clearCart,
  getWishlist, toggleWishlist,
  createOrder, getMyOrders, getOrder, adminGetAllOrders, updateOrderStatus,
  submitPayment, adminGetPayments, verifyPayment,
  adminGetUsers, adminToggleUser,
} = require('../controllers/shopController');

const router = express.Router();

// ─── Auth ─────────────────────────────────────────────────────────────────────
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', authMiddleware, getMe);
router.put('/auth/profile', authMiddleware, uploadAvatar, updateProfile);

// ─── Products ─────────────────────────────────────────────────────────────────
router.get('/products', getAllProducts);
router.get('/products/featured', getFeaturedProducts);
router.get('/products/trending', getTrendingProducts);
router.get('/products/recent', getRecentProducts);
router.get('/products/category/:category', getProductsByCategory);
router.get('/products/my', authMiddleware, getMyProducts);
router.get('/products/:id', getProduct);
router.post('/products', authMiddleware, uploadProductImages, createProduct);
router.put('/products/:id', authMiddleware, uploadProductImages, updateProduct);
router.delete('/products/:id', authMiddleware, deleteProduct);
router.patch('/products/:id/sold', authMiddleware, markAsSold);
// Admin
router.get('/admin/products', authMiddleware, adminMiddleware, adminGetAllProducts);
router.patch('/admin/products/:id/featured', authMiddleware, adminMiddleware, toggleFeatured);

// ─── Cart ─────────────────────────────────────────────────────────────────────
router.get('/cart', authMiddleware, getCart);
router.post('/cart', authMiddleware, addToCart);
router.put('/cart/:productId', authMiddleware, updateCartItem);
router.delete('/cart/:productId', authMiddleware, removeFromCart);
router.delete('/cart', authMiddleware, clearCart);

// ─── Wishlist ─────────────────────────────────────────────────────────────────
router.get('/wishlist', authMiddleware, getWishlist);
router.post('/wishlist/toggle', authMiddleware, toggleWishlist);

// ─── Orders ───────────────────────────────────────────────────────────────────
router.post('/orders', authMiddleware, createOrder);
router.get('/orders/my', authMiddleware, getMyOrders);
router.get('/orders/:id', authMiddleware, getOrder);
// Admin
router.get('/admin/orders', authMiddleware, adminMiddleware, adminGetAllOrders);
router.patch('/admin/orders/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);

// ─── Payments ─────────────────────────────────────────────────────────────────
router.post('/payments', authMiddleware, uploadPaymentScreenshot, submitPayment);
router.get('/admin/payments', authMiddleware, adminMiddleware, adminGetPayments);
router.patch('/admin/payments/:id/verify', authMiddleware, adminMiddleware, verifyPayment);

// ─── Admin Users ──────────────────────────────────────────────────────────────
router.get('/admin/users', authMiddleware, adminMiddleware, adminGetUsers);
router.patch('/admin/users/:id/toggle', authMiddleware, adminMiddleware, adminToggleUser);

// ─── Stats ────────────────────────────────────────────────────────────────────
const db = require('../config/db');
router.get('/admin/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [[users]] = await db.query('SELECT COUNT(*) as count FROM users WHERE role="user"');
    const [[products]] = await db.query('SELECT COUNT(*) as count FROM products');
    const [[orders]] = await db.query('SELECT COUNT(*) as count FROM orders');
    const [[revenue]] = await db.query('SELECT COALESCE(SUM(amount),0) as total FROM payments WHERE payment_status="verified"');
    res.json({ success: true, stats: { users: users.count, products: products.count, orders: orders.count, revenue: revenue.total } });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
});

module.exports = router;
