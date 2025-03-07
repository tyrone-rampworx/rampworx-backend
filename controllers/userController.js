// controllers/userController.js
const userService = require('../services/userService');
const authService = require('../services/authService');
const logger = require('../utils/logger');

// Register new user
const register = async (req, res) => {
  try {
    const { username, email, password, membership_id } = req.body;
    if (!username || !email || !password) {
      logger.error('Missing required fields in registration');
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await authService.register({
      username,
      email,
      password,
      membership_id,
    });

    res.status(201).json(result);
  } catch (err) {
    logger.error('Error in user registration:', err);
    if (err.message === 'User already exists') {
      return res.status(400).json({ message: 'User already exists' });
    }
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      logger.error('Missing email or password in login');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await authService.login(email, password);
    res.status(200).json(result);
  } catch (err) {
    logger.error('Error in user login:', err);
    if (err.message === 'Invalid credentials') {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    logger.error('Error fetching user profile:', err);
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    logger.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    logger.error(`Error fetching user ${req.params.id}:`, err);
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    // Check if user is updating their own profile
    if (req.params.id !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this user' });
    }

    const updatedUser = await userService.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    logger.error(`Error updating user ${req.params.id}:`, err);
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    res.status(500).json({ message: 'Error updating user', error: err.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    // Check if user is deleting their own profile
    if (req.params.id !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this user' });
    }

    await userService.deleteUser(req.params.id);
    res.status(204).send();
  } catch (err) {
    logger.error(`Error deleting user ${req.params.id}:`, err);
    if (err.message === 'User not found') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
