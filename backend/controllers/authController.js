const { User } = require('../models/User');
const { generateToken } = require('../config/jwt');

const register = async (req, res) => {
  try {
    const { username, email, password, phone, college } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ success: false, message: 'Username, email, and password are required' });

    const hashed = await User.hashPassword(password);
    const result = await User.create({ username, email, password: hashed, phone, college, role: 'user' });

    res.status(201).json({ success: true, message: 'Account created successfully! Welcome to Thrift Nepal 🎉' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      const msg = error.message.includes('email') ? 'Email already registered' : 'Username already taken';
      return res.status(400).json({ success: false, message: msg });
    }
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required' });

    const [users] = await User.findByEmail(email);
    if (!users || users.length === 0)
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const user = users[0];
    if (!user.is_active)
      return res.status(403).json({ success: false, message: 'Account is deactivated. Contact admin.' });

    const match = await User.comparePassword(password, user.password);
    if (!match)
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const token = generateToken(user.id, user.email, user.username, user.role);
    res.json({
      success: true,
      message: 'Welcome back! 👋',
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role, avatar: user.avatar, college: user.college },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

const getMe = async (req, res) => {
  try {
    const [rows] = await User.findById(req.user.userId);
    if (!rows || rows.length === 0)
      return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { username, phone, college } = req.body;
    const avatar = req.file ? `/uploads/avatars/${req.file.filename}` : req.body.avatar;
    await User.update(req.user.userId, { username, phone, college, avatar });
    const [rows] = await User.findById(req.user.userId);
    res.json({ success: true, message: 'Profile updated!', user: rows[0] });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

module.exports = { register, login, getMe, updateProfile };
