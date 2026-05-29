const db = require('../config/db');
const bcrypt = require('bcryptjs');

const createUserTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      college VARCHAR(100),
      avatar VARCHAR(255),
      role ENUM('user', 'admin') DEFAULT 'user',
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;
  await db.query(sql);
  console.log('Users table ready');
};

const ensureDefaultAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@thriftnepal.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';

    const [rows] = await db.query('SELECT id FROM users WHERE email = ?', [adminEmail]);
    if (rows.length > 0) {
      console.log('Default admin already exists');
      return;
    }
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    await db.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [adminUsername, adminEmail, hashedPassword, 'admin']
    );
    console.log('Default admin created:', adminEmail);
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

const User = {
  hashPassword: async (password) => bcrypt.hash(password, 12),
  comparePassword: async (password, hash) => bcrypt.compare(password, hash),

  create: (data) => db.query(
    'INSERT INTO users (username, email, password, phone, college, role) VALUES (?, ?, ?, ?, ?, ?)',
    [data.username, data.email, data.password, data.phone || null, data.college || null, data.role || 'user']
  ),

  findByEmail: (email) => db.query('SELECT * FROM users WHERE email = ?', [email]),
  findByUsername: (username) => db.query('SELECT * FROM users WHERE username = ?', [username]),
  findById: (id) => db.query('SELECT id, username, email, phone, college, avatar, role, is_active, created_at FROM users WHERE id = ?', [id]),

  getAll: () => db.query('SELECT id, username, email, phone, college, avatar, role, is_active, created_at FROM users ORDER BY created_at DESC'),

  update: (id, data) => db.query(
    'UPDATE users SET username=?, phone=?, college=?, avatar=? WHERE id=?',
    [data.username, data.phone, data.college, data.avatar, id]
  ),

  toggleActive: (id, status) => db.query('UPDATE users SET is_active=? WHERE id=?', [status, id]),
  delete: (id) => db.query('DELETE FROM users WHERE id=?', [id]),
};

module.exports = { User, createUserTable, ensureDefaultAdmin };
