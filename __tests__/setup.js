const sequelize = require('../config/sequelize.test');
const { User } = require('../models/User');

beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret-key';
  process.env.JWT_EXPIRES_IN = '1h';

  try {
    // Create test schema if it doesn't exist
    await sequelize.query('CREATE SCHEMA IF NOT EXISTS test;');

    // Drop and recreate test schema tables
    await sequelize.sync({ force: true, schema: 'test' });
  } catch (error) {
    console.error('Test database setup failed:', error);
    throw error;
  }
});

beforeEach(async () => {
  // Clear all tables before each test
  await User.destroy({
    where: {},
    force: true,
    schema: 'test',
  });
});

afterAll(async () => {
  // Drop test schema
  await sequelize.query('DROP SCHEMA IF EXISTS test CASCADE;');

  // Close database connection
  await sequelize.close();
});
