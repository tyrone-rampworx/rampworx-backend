// controllers/userController.js
const userService = require('../services/userService');

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Create a new user
const createUser = async (req, res) => {
  const { username, email, password, membershipId} = req.body;
  try {
    const newUser = await userService.createUser(username, email, password, membershipId);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: 'Error creating user' });
  }
};

module.exports = { getUsers, createUser };
