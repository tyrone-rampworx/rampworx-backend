// services/userService.js
const User = require('../models/User');
const Address = require('../models/Address');
const logger = require('../utils/logger');

const getAllUsers = async () => {
  try {
    const users = await User.findAll({
      include: [Address],
      attributes: { exclude: ['password'] },
    });
    return users;
  } catch (error) {
    logger.error('Error fetching all users:', error);
    throw error;
  }
};

const createUser = async (username, email, password, membership_id) => {
  try {
    if (!username || !email || !password || !membership_id) {
      throw new Error('Missing required fields');
    }

    return await User.create({
      username,
      email,
      password,
      membership_id,
    });
  } catch (error) {
    logger.error('Error creating user:', error);
    throw error;
  }
};

const getUserById = async (id) => {
  try {
    const user = await User.findByPk(id, {
      include: [Address],
      attributes: { exclude: ['password'] },
    });
    return user;
  } catch (error) {
    logger.error(`Error fetching user with id ${id}:`, error);
    throw error;
  }
};

const updateUser = async (id, userData) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    // Don't allow password updates through this endpoint
    const updateData = { ...userData };
    delete updateData.password;
    const updatedUser = await user.update(updateData);
    return updatedUser.toJSON({ exclude: ['password'] });
  } catch (error) {
    logger.error(`Error updating user with id ${id}:`, error);
    throw error;
  }
};

const deleteUser = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    await user.destroy();
    return { message: 'User deleted successfully' };
  } catch (error) {
    logger.error(`Error deleting user with id ${id}:`, error);
    throw error;
  }
};

module.exports = { getAllUsers, createUser, getUserById, updateUser, deleteUser };
