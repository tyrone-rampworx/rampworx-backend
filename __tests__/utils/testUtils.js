const { User } = require('../../models/User');
const { generateToken } = require('../../utils/jwt');
const bcrypt = require('bcryptjs');

const createTestUser = async (userData = {}) => {
  const defaultUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    membership_id: 'M123',
  };

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(
    userData.password || defaultUser.password,
    salt,
  );

  const user = await User.create({
    ...defaultUser,
    ...userData,
    password: hashedPassword,
  });

  return user;
};

const generateTestToken = (user) => {
  return generateToken(user);
};

const clearDatabase = async () => {
  await User.destroy({
    where: {},
    force: true,
  });
};

module.exports = {
  createTestUser,
  generateTestToken,
  clearDatabase,
};
