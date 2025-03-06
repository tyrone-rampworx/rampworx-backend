// services/userService.js
const userModel = require('../models/userModel');

const getAllUsers = async () => {
  return await userModel.getAllUsers();
};

const createUser = async (username, email, password, membershipId) => {
  // Add business logic here, such as validation
  if (!username || !email || !password || !membershipId) {
    throw new Error('Missing required fields');
  }

  return await userModel.createUser(username, email, password, membershipId);
};

module.exports = { getAllUsers, createUser };
