// services/userService.js
const User = require('../models/User');
const Address = require('../models/Address');

const getAllUsers = async () => {
  return await User.findAll({
    include: [Address],
  });
};

const createUser = async (username, email, password, membership_id) => {
  if (!username || !email || !password || !membership_id) {
    throw new Error('Missing required fields');
  }

  return await User.create({
    username,
    email,
    password,
    membership_id,
  });
};

const getUserById = async (id) => {
  return await User.findByPk(id, {
    include: [Address],
  });
};

const updateUser = async (id, userData) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('User not found');
  }
  return await user.update(userData);
};

const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('User not found');
  }
  return await user.destroy();
};

module.exports = { getAllUsers, createUser, getUserById, updateUser, deleteUser };
