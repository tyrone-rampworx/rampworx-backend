const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const logger = require('../utils/logger');

const authService = {
  register: async (userData) => {
    try {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Create user with hashed password
      const user = await User.create({
        ...userData,
        password: hashedPassword,
      });

      // Generate JWT token
      const token = generateToken(user);

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user.toJSON();
      return {
        user: userWithoutPassword,
        token,
      };
    } catch (error) {
      logger.error('Error in register service:', error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('User already exists');
      }
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      // Generate JWT token
      const token = generateToken(user);

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user.toJSON();
      return {
        user: userWithoutPassword,
        token,
      };
    } catch (error) {
      logger.error('Error in login service:', error);
      throw error;
    }
  },

  validateUser: async (userId) => {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user.toJSON();
      return userWithoutPassword;
    } catch (error) {
      logger.error('Error validating user:', error);
      throw error;
    }
  },
};

module.exports = authService;
