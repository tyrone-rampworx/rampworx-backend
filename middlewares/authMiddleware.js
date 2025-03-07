const { verifyToken } = require('../utils/jwt');
const authService = require('../services/authService');
const logger = require('../utils/logger');

const authMiddleware = async (req, res, next) => {
  try {
    // Check if token exists
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    // Validate user exists and is active
    try {
      const user = await authService.validateUser(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'User no longer exists' });
      }
      // Remove sensitive data before attaching to request
      // eslint-disable-next-line no-unused-vars
      const { password: _, ...userWithoutPassword } = user;
      req.user = userWithoutPassword;
      next();
    } catch (userError) {
      logger.error('User validation error:', userError);
      return res.status(401).json({ message: 'User no longer exists' });
    }
  } catch (error) {
    logger.error('Authentication error:', error);
    if (error.message === 'Invalid token') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    return res.status(500).json({
      message: 'Authentication error',
      error: error.message,
    });
  }
};

module.exports = authMiddleware;
