// middlewares/authMiddleware.js
const { verifyToken } = require('../utils/jwt');
const authService = require('../services/authService');
const logger = require('../utils/logger');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Extract token from Bearer string
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = verifyToken(token);

    // Get user from database and attach to request
    const user = await authService.validateUser(decoded.id);
    req.user = user;

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    if (error.message === 'Invalid token') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.message === 'User not found') {
      return res.status(401).json({ message: 'User no longer exists' });
    }
    res.status(500).json({ message: 'Authentication error', error: error.message });
  }
};

module.exports = authMiddleware;
