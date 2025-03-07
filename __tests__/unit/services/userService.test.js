const User = require('../../../models/User');
const userService = require('../../../services/userService');
const logger = require('../../../utils/logger');

// Mock the User model and logger
jest.mock('../../../models/User');
jest.mock('../../../utils/logger');

// Mock the Address model
jest.mock('../../../models/Address', () => {
  return {};
});

describe('User Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return all users without passwords', async () => {
      const mockUsers = [
        {
          id: 1,
          username: 'testuser1',
          email: 'test1@example.com',
          membership_id: 'M123',
          created_at: new Date(),
          updated_at: new Date(),
          Address: null,
        },
        {
          id: 2,
          username: 'testuser2',
          email: 'test2@example.com',
          membership_id: 'M456',
          created_at: new Date(),
          updated_at: new Date(),
          Address: null,
        },
      ];

      User.findAll.mockResolvedValue(mockUsers);

      const result = await userService.getAllUsers();

      expect(User.findAll).toHaveBeenCalledWith({
        include: [expect.any(Object)],
        attributes: { exclude: ['password'] },
      });

      expect(result).toHaveLength(2);
      result.forEach(user => {
        expect(user).not.toHaveProperty('password');
      });
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      User.findAll.mockRejectedValue(error);

      await expect(userService.getAllUsers()).rejects.toThrow('Database error');
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should return user without password', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        membership_id: 'M123',
        created_at: new Date(),
        updated_at: new Date(),
        Address: null,
      };

      User.findByPk.mockResolvedValue(mockUser);

      const result = await userService.getUserById(1);

      expect(User.findByPk).toHaveBeenCalledWith(1, {
        include: [expect.any(Object)],
        attributes: { exclude: ['password'] },
      });

      expect(result).not.toHaveProperty('password');
    });

    it('should return null for non-existent user', async () => {
      User.findByPk.mockResolvedValue(null);

      const result = await userService.getUserById(999);

      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      User.findByPk.mockRejectedValue(error);

      await expect(userService.getUserById(1)).rejects.toThrow('Database error');
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('should update user and return without password', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        membership_id: 'M123',
        update: jest.fn(),
        toJSON: jest.fn().mockReturnValue({
          id: 1,
          username: 'updateduser',
          email: 'test@example.com',
          membership_id: 'M456',
          created_at: new Date(),
          updated_at: new Date(),
        }),
      };

      User.findByPk.mockResolvedValue(mockUser);
      mockUser.update.mockResolvedValue(mockUser);

      const updateData = {
        username: 'updateduser',
        membership_id: 'M456',
        password: 'newpassword', // This should be ignored
      };

      const result = await userService.updateUser(1, updateData);

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(mockUser.update).toHaveBeenCalledWith({
        username: 'updateduser',
        membership_id: 'M456',
      });
      expect(result).not.toHaveProperty('password');
      expect(result).toEqual({
        id: 1,
        username: 'updateduser',
        email: 'test@example.com',
        membership_id: 'M456',
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
    });

    it('should throw error for non-existent user', async () => {
      User.findByPk.mockResolvedValue(null);

      await expect(userService.updateUser(999, { username: 'test' }))
        .rejects
        .toThrow('User not found');
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      User.findByPk.mockRejectedValue(error);

      await expect(userService.updateUser(1, { username: 'test' }))
        .rejects
        .toThrow('Database error');
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should delete user and return success message', async () => {
      const mockUser = {
        id: 1,
        destroy: jest.fn(),
      };

      User.findByPk.mockResolvedValue(mockUser);
      mockUser.destroy.mockResolvedValue(undefined);

      const result = await userService.deleteUser(1);

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(mockUser.destroy).toHaveBeenCalled();
      expect(result).toEqual({ message: 'User deleted successfully' });
    });

    it('should throw error for non-existent user', async () => {
      User.findByPk.mockResolvedValue(null);

      await expect(userService.deleteUser(999))
        .rejects
        .toThrow('User not found');
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      User.findByPk.mockRejectedValue(error);

      await expect(userService.deleteUser(1)).rejects.toThrow('Database error');
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
