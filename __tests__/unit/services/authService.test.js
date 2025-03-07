const bcrypt = require('bcryptjs');
const User = require('../../../models/User');
const authService = require('../../../services/authService');
const logger = require('../../../utils/logger');

// Mock bcrypt
jest.mock('bcryptjs');

// Mock User model
jest.mock('../../../models/User', () => ({
  create: jest.fn(),
  findOne: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const mockUserData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      membership_id: 'M123',
    };

    it('should successfully register a new user', async () => {
      // Mock bcrypt functions
      const hashedPassword = 'hashedpassword123';
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue(hashedPassword);

      // Mock User.create
      const mockCreatedUser = {
        id: 1,
        ...mockUserData,
        password: hashedPassword,
        toJSON: () => ({
          id: 1,
          username: mockUserData.username,
          email: mockUserData.email,
          membership_id: mockUserData.membership_id,
        }),
      };
      User.create.mockResolvedValue(mockCreatedUser);

      // Call register
      const result = await authService.register(mockUserData);

      // Verify results
      expect(result).toHaveProperty('token');
      expect(result.user).toHaveProperty('id', 1);
      expect(result.user).toHaveProperty('username', mockUserData.username);
      expect(result.user).not.toHaveProperty('password');
      expect(User.create).toHaveBeenCalledWith({
        ...mockUserData,
        password: hashedPassword,
      });
      expect(logger.error).not.toHaveBeenCalled();
    });

    it('should throw error if user already exists', async () => {
      User.create.mockRejectedValue({
        name: 'SequelizeUniqueConstraintError',
      });

      await expect(authService.register(mockUserData))
        .rejects.toThrow('User already exists');
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const mockCredentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should successfully login user with valid credentials', async () => {
      // Mock bcrypt.compare
      bcrypt.compare.mockResolvedValue(true);

      // Mock User.findOne
      const mockUser = {
        id: 1,
        email: mockCredentials.email,
        password: 'hashedpassword123',
        toJSON: () => ({
          id: 1,
          email: mockCredentials.email,
          username: 'testuser',
          membership_id: 'M123',
        }),
      };
      User.findOne.mockResolvedValue(mockUser);

      // Call login
      const result = await authService.login(
        mockCredentials.email,
        mockCredentials.password,
      );

      // Verify results
      expect(result).toHaveProperty('token');
      expect(result.user).not.toHaveProperty('password');
      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: mockCredentials.email },
      });
      expect(logger.error).not.toHaveBeenCalled();
    });

    it('should throw error for non-existent user', async () => {
      User.findOne.mockResolvedValue(null);

      await expect(authService.login(
        mockCredentials.email,
        mockCredentials.password,
      )).rejects.toThrow('Invalid credentials');
      expect(logger.error).toHaveBeenCalled();
    });

    it('should throw error for invalid password', async () => {
      const mockUser = {
        id: 1,
        email: mockCredentials.email,
        password: 'hashedpassword123',
      };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(authService.login(
        mockCredentials.email,
        mockCredentials.password,
      )).rejects.toThrow('Invalid credentials');
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('validateUser', () => {
    it('should return user if found', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        toJSON: () => ({
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
        }),
      };
      User.findByPk.mockResolvedValue(mockUser);

      const result = await authService.validateUser(1);
      expect(result).toEqual(mockUser.toJSON());
      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(logger.error).not.toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      User.findByPk.mockResolvedValue(null);

      await expect(authService.validateUser(1))
        .rejects.toThrow('User not found');
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
