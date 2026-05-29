const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'thrift_nepal_secret_key';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

const generateToken = (userId, email, username, role) => {
  return jwt.sign({ userId, email, username, role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') throw new Error('Token has expired');
    if (error.name === 'JsonWebTokenError') throw new Error('Invalid token');
    throw error;
  }
};

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: error.message || 'Token verification failed' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied. Admin role required.' });
  }
  next();
};

module.exports = { generateToken, verifyToken, authMiddleware, adminMiddleware };
