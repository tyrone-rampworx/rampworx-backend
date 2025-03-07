const authService = require('../services/authService');
const logger = require('../utils/logger');

class AuthController {
  async register(req, res) {
    try {
      const { username, email, password, membership_id } = req.body;

      // Validate required fields
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
      }

      const result = await authService.register({
        username,
        email,
        password,
        membership_id,
      });

      res.status(201).json(result);
    } catch (error) {
      logger.error('Error in register controller:', error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: 'Username or email already exists' });
      }
      res.status(500).json({ message: 'Error registering user', error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
      }

      const result = await authService.login(email, password);
      res.status(200).json(result);
    } catch (error) {
      logger.error('Error in login controller:', error);
      if (error.message === 'Invalid credentials') {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      res.status(500).json({ message: 'Error logging in', error: error.message });
    }
  }

  async getProfile(req, res) {
    try {
      // eslint-disable-next-line no-unused-vars
      const { password, ...userWithoutPassword } = req.user.toJSON();
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      logger.error('Error in getProfile controller:', error);
      res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
  }
}

module.exports = new AuthController();
