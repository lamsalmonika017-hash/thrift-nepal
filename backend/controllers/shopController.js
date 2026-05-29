const { Order, Cart, Wishlist, Payment } = require('../models/index');
const { Product } = require('../models/Product');

// ─── Cart Controllers ─────────────────────────────────────────────────────────
const getCart = async (req, res) => {
  try {
    const [items] = await Cart.getByUser(req.user.userId);
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    res.json({ success: true, items, total });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch cart' });
  }
};

const addToCart = async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    await Cart.add(req.user.userId, product_id, quantity);
    res.json({ success: true, message: 'Added to cart!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add to cart' });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity <= 0) {
      await Cart.remove(req.user.userId, req.params.productId);
    } else {
      await Cart.updateQty(req.user.userId, req.params.productId, quantity);
    }
    res.json({ success: true, message: 'Cart updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update cart' });
  }
};

const removeFromCart = async (req, res) => {
  try {
    await Cart.remove(req.user.userId, req.params.productId);
    res.json({ success: true, message: 'Removed from cart' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove item' });
  }
};

const clearCart = async (req, res) => {
  try {
    await Cart.clear(req.user.userId);
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to clear cart' });
  }
};

// ─── Wishlist Controllers ─────────────────────────────────────────────────────
const getWishlist = async (req, res) => {
  try {
    const [items] = await Wishlist.getByUser(req.user.userId);
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch wishlist' });
  }
};

const toggleWishlist = async (req, res) => {
  try {
    const { product_id } = req.body;
    const [existing] = await Wishlist.check(req.user.userId, product_id);
    if (existing.length > 0) {
      await Wishlist.remove(req.user.userId, product_id);
      res.json({ success: true, message: 'Removed from wishlist', wishlisted: false });
    } else {
      await Wishlist.add(req.user.userId, product_id);
      res.json({ success: true, message: 'Added to wishlist!', wishlisted: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update wishlist' });
  }
};

// ─── Order Controllers ────────────────────────────────────────────────────────
const createOrder = async (req, res) => {
  try {
    const { items, delivery_address, delivery_phone, notes } = req.body;
    if (!items || items.length === 0)
      return res.status(400).json({ success: false, message: 'No items in order' });

    const total_amount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const result = await Order.create(req.user.userId, { total_amount, delivery_address, delivery_phone, notes });
    const orderId = result.insertId;
    await Order.addItems(orderId, items);
    await Cart.clear(req.user.userId);

    res.status(201).json({ success: true, message: 'Order placed successfully!', orderId });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: 'Failed to place order' });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const [orders] = await Order.getByUser(req.user.userId);
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.getById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user_id !== req.user.userId && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
};

// Admin
const adminGetAllOrders = async (req, res) => {
  try {
    const [orders] = await Order.getAll();
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await Order.updateStatus(req.params.id, status);
    res.json({ success: true, message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order' });
  }
};

// ─── Payment Controllers ──────────────────────────────────────────────────────
const submitPayment = async (req, res) => {
  try {
    const { order_id, amount } = req.body;
    if (!req.file) return res.status(400).json({ success: false, message: 'Payment screenshot is required' });
    const screenshotPath = `/uploads/payments/${req.file.filename}`;
    await Payment.create(req.user.userId, order_id, amount, screenshotPath);
    res.status(201).json({ success: true, message: 'Payment submitted! Admin will verify shortly. ✅' });
  } catch (error) {
    console.error('Submit payment error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit payment' });
  }
};

const adminGetPayments = async (req, res) => {
  try {
    const [payments] = await Payment.getAll();
    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch payments' });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { status, admin_note } = req.body;
    await Payment.updateStatus(req.params.id, status, admin_note);
    res.json({ success: true, message: `Payment ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update payment' });
  }
};

// ─── Admin User Controllers ───────────────────────────────────────────────────
const { User } = require('../models/User');

const adminGetUsers = async (req, res) => {
  try {
    const [users] = await User.getAll();
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

const adminToggleUser = async (req, res) => {
  try {
    const { is_active } = req.body;
    await User.toggleActive(req.params.id, is_active);
    res.json({ success: true, message: `User ${is_active ? 'activated' : 'deactivated'}` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update user' });
  }
};

module.exports = {
  getCart, addToCart, updateCartItem, removeFromCart, clearCart,
  getWishlist, toggleWishlist,
  createOrder, getMyOrders, getOrder, adminGetAllOrders, updateOrderStatus,
  submitPayment, adminGetPayments, verifyPayment,
  adminGetUsers, adminToggleUser,
};
