const db = require('../config/db');

// ─── Orders ───────────────────────────────────────────────────────────────────
const createOrderTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      total_amount DECIMAL(10,2) NOT NULL,
      status ENUM('pending','confirmed','shipped','delivered','cancelled') DEFAULT 'pending',
      delivery_address TEXT,
      delivery_phone VARCHAR(20),
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      product_id INT NOT NULL,
      quantity INT DEFAULT 1,
      price DECIMAL(10,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);
  console.log('Orders tables ready');
};

// ─── Cart ─────────────────────────────────────────────────────────────────────
const createCartTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS cart (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      product_id INT NOT NULL,
      quantity INT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_cart_item (user_id, product_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);
  console.log('Cart table ready');
};

// ─── Wishlist ─────────────────────────────────────────────────────────────────
const createWishlistTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS wishlist (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      product_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_wish (user_id, product_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);
  console.log('Wishlist table ready');
};

// ─── Payments ─────────────────────────────────────────────────────────────────
const createPaymentTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS payments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      order_id INT NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      payment_screenshot VARCHAR(255),
      payment_status ENUM('pending','verified','rejected') DEFAULT 'pending',
      admin_note TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    )
  `);
  console.log('Payments table ready');
};

// ─── Order Model ─────────────────────────────────────────────────────────────
const Order = {
  create: async (userId, data) => {
    const [result] = await db.query(
      'INSERT INTO orders (user_id, total_amount, delivery_address, delivery_phone, notes) VALUES (?,?,?,?,?)',
      [userId, data.total_amount, data.delivery_address, data.delivery_phone, data.notes || null]
    );
    return result;
  },

  addItems: async (orderId, items) => {
    for (const item of items) {
      await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?,?,?,?)',
        [orderId, item.product_id, item.quantity, item.price]
      );
    }
  },

  getByUser: (userId) => db.query(`
    SELECT o.*, 
      GROUP_CONCAT(p.title SEPARATOR ', ') as product_titles,
      pay.payment_status
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    LEFT JOIN payments pay ON o.id = pay.order_id
    WHERE o.user_id = ?
    GROUP BY o.id ORDER BY o.created_at DESC
  `, [userId]),

  getById: async (id) => {
    const [orders] = await db.query(`
      SELECT o.*, u.username, u.email, pay.payment_status, pay.payment_screenshot, pay.id as payment_id
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN payments pay ON o.id = pay.order_id
      WHERE o.id = ?
    `, [id]);
    if (orders.length === 0) return null;
    const [items] = await db.query(`
      SELECT oi.*, p.title, p.category,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image
      FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [id]);
    return { ...orders[0], items };
  },

  getAll: () => db.query(`
    SELECT o.*, u.username, u.email, pay.payment_status
    FROM orders o LEFT JOIN users u ON o.user_id = u.id
    LEFT JOIN payments pay ON o.id = pay.order_id
    ORDER BY o.created_at DESC
  `),

  updateStatus: (id, status) => db.query('UPDATE orders SET status=? WHERE id=?', [status, id]),
};

// ─── Cart Model ─────────────────────────────────────────────────────────────
const Cart = {
  add: (userId, productId, qty = 1) => db.query(
    'INSERT INTO cart (user_id, product_id, quantity) VALUES (?,?,?) ON DUPLICATE KEY UPDATE quantity = quantity + ?',
    [userId, productId, qty, qty]
  ),
  getByUser: (userId) => db.query(`
    SELECT c.*, p.title, p.price, p.status as product_status, p.category, p.\`condition\`,
      (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image
    FROM cart c LEFT JOIN products p ON c.product_id = p.id WHERE c.user_id = ?
  `, [userId]),
  updateQty: (userId, productId, qty) => db.query('UPDATE cart SET quantity=? WHERE user_id=? AND product_id=?', [qty, userId, productId]),
  remove: (userId, productId) => db.query('DELETE FROM cart WHERE user_id=? AND product_id=?', [userId, productId]),
  clear: (userId) => db.query('DELETE FROM cart WHERE user_id=?', [userId]),
};

// ─── Wishlist Model ─────────────────────────────────────────────────────────
const Wishlist = {
  add: (userId, productId) => db.query(
    'INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?,?)', [userId, productId]
  ),
  remove: (userId, productId) => db.query('DELETE FROM wishlist WHERE user_id=? AND product_id=?', [userId, productId]),
  getByUser: (userId) => db.query(`
    SELECT w.*, p.title, p.price, p.category, p.status as product_status, p.\`condition\`,
      (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image
    FROM wishlist w LEFT JOIN products p ON w.product_id = p.id WHERE w.user_id = ?
  `, [userId]),
  check: (userId, productId) => db.query('SELECT id FROM wishlist WHERE user_id=? AND product_id=?', [userId, productId]),
};

// ─── Payment Model ─────────────────────────────────────────────────────────
const Payment = {
  create: async (userId, orderId, amount, screenshotPath) => {
    const [result] = await db.query(
      'INSERT INTO payments (user_id, order_id, amount, payment_screenshot) VALUES (?,?,?,?)',
      [userId, orderId, amount, screenshotPath]
    );
    return result;
  },
  getAll: () => db.query(`
    SELECT pay.*, u.username, u.email, o.total_amount, o.status as order_status
    FROM payments pay
    LEFT JOIN users u ON pay.user_id = u.id
    LEFT JOIN orders o ON pay.order_id = o.id
    ORDER BY pay.created_at DESC
  `),
  getByOrder: (orderId) => db.query('SELECT * FROM payments WHERE order_id=?', [orderId]),
  updateStatus: (id, status, note) => db.query(
    'UPDATE payments SET payment_status=?, admin_note=? WHERE id=?', [status, note || null, id]
  ),
};

module.exports = {
  Order, Cart, Wishlist, Payment,
  createOrderTable, createCartTable, createWishlistTable, createPaymentTable,
};
