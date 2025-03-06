// middlewares/authMiddleware.js
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
      return res.status(403).json({ message: 'No token provided' });
    }
    // Here, you would verify the token and proceed
    next();
  };
  
  module.exports = authMiddleware;
  