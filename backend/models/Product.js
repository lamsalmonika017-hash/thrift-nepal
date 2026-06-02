const db = require('../config/db');

const createProductTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      category VARCHAR(50) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      item_condition ENUM('New','Like New','Used') DEFAULT 'Used',
      seller_id INT NOT NULL,
      status ENUM('available','sold','inactive') DEFAULT 'available',
      is_featured BOOLEAN DEFAULT FALSE,
      views INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `;
  await db.query(sql);

  const imagesSql = `
    CREATE TABLE IF NOT EXISTS product_images (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      image_url VARCHAR(255) NOT NULL,
      is_primary BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `;
  await db.query(imagesSql);
  console.log('Products & product_images tables ready');
};

const Product = {
  create: async (data) => {
    const [result] = await db.query(
      'INSERT INTO products (title, description, category, price, item_condition, seller_id) VALUES (?, ?, ?, ?, ?, ?)',
      [
        data.title,
        data.description,
        data.category,
        data.price,
        data.item_condition,
        data.seller_id
      ]
    );
    return result;
  },

  addImages: async (productId, imageUrls) => {
    for (let i = 0; i < imageUrls.length; i++) {
      await db.query(
        'INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)',
        [productId, imageUrls[i], i === 0]
      );
    }
  },

  getAll: (filters = {}) => {
    let sql = `
      SELECT p.*, u.username as seller_name, u.college as seller_college,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
      FROM products p
      LEFT JOIN users u ON p.seller_id = u.id
      WHERE p.status = 'available'
    `;

    const params = [];

    if (filters.category) {
      sql += ' AND p.category = ?';
      params.push(filters.category);
    }

    if (filters.item_condition) {
      sql += ' AND p.item_condition = ?';
      params.push(filters.item_condition);
    }

    if (filters.minPrice) {
      sql += ' AND p.price >= ?';
      params.push(filters.minPrice);
    }

    if (filters.maxPrice) {
      sql += ' AND p.price <= ?';
      params.push(filters.maxPrice);
    }

    if (filters.search) {
      sql += ' AND (p.title LIKE ? OR p.description LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    sql += ' ORDER BY p.created_at DESC';

    if (filters.limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }

    return db.query(sql, params);
  },

  getFeatured: () => db.query(`
    SELECT p.*, u.username as seller_name,
      (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
    FROM products p
    LEFT JOIN users u ON p.seller_id = u.id
    WHERE p.status = 'available'
      AND p.is_featured = 1
    ORDER BY p.created_at DESC
    LIMIT 8
  `),

  getTrending: () => db.query(`
    SELECT p.*, u.username as seller_name,
      (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
    FROM products p
    LEFT JOIN users u ON p.seller_id = u.id
    WHERE p.status = 'available'
    ORDER BY p.views DESC
    LIMIT 8
  `),

  getRecent: () => db.query(`
    SELECT p.*, u.username as seller_name,
      (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
    FROM products p
    LEFT JOIN users u ON p.seller_id = u.id
    WHERE p.status = 'available'
    ORDER BY p.created_at DESC
    LIMIT 12
  `),

  getById: async (id) => {
    const [products] = await db.query(`
      SELECT p.*, 
             u.username as seller_name,
             u.college as seller_college,
             u.phone as seller_phone,
             u.avatar as seller_avatar
      FROM products p
      LEFT JOIN users u ON p.seller_id = u.id
      WHERE p.id = ?
    `, [id]);

    if (products.length === 0) return null;

    const [images] = await db.query(
      'SELECT * FROM product_images WHERE product_id = ?',
      [id]
    );

    await db.query(
      'UPDATE products SET views = views + 1 WHERE id = ?',
      [id]
    );

    return {
      ...products[0],
      images
    };
  },

  getBySeller: (sellerId) => db.query(`
    SELECT p.*,
      (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
    FROM products p
    WHERE p.seller_id = ?
    ORDER BY p.created_at DESC
  `, [sellerId]),

  getByCategory: (category, limit = 8) => db.query(`
    SELECT p.*, u.username as seller_name,
      (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
    FROM products p
    LEFT JOIN users u ON p.seller_id = u.id
    WHERE p.status = 'available'
      AND p.category = ?
    ORDER BY p.created_at DESC
    LIMIT ?
  `, [category, limit]),

  update: (id, data) => db.query(
    'UPDATE products SET title=?, description=?, category=?, price=?, item_condition=?, status=? WHERE id=?',
    [
      data.title,
      data.description,
      data.category,
      data.price,
      data.item_condition,
      data.status || 'available',
      id
    ]
  ),

  deleteImages: (productId) =>
    db.query('DELETE FROM product_images WHERE product_id = ?', [productId]),

  delete: (id) =>
    db.query('DELETE FROM products WHERE id=?', [id]),

  markAsSold: (id) =>
    db.query("UPDATE products SET status='sold' WHERE id=?", [id]),

  toggleFeatured: (id, val) =>
    db.query('UPDATE products SET is_featured=? WHERE id=?', [val, id]),

  adminGetAll: () => db.query(`
    SELECT p.*, u.username as seller_name,
      (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
    FROM products p
    LEFT JOIN users u ON p.seller_id = u.id
    ORDER BY p.created_at DESC
  `),
};

module.exports = { Product, createProductTable };