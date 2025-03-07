// Mock the logger to avoid console output during tests
jest.mock('../utils/logger', () => ({
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

beforeAll(() => {
  // Set test environment variables to match production values
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'your-secret-key';
  process.env.JWT_EXPIRES_IN = '24h';
});
