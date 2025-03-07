const userController = require('../../../controllers/userController');
const authService = require('../../../services/authService');
const logger = require('../../../utils/logger');

jest.mock('../../../services/authService');

describe('User Controller', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      user: undefined,
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
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
      const mockServiceResponse = {
        user: {
          id: 1,
          username: mockUserData.username,
          email: mockUserData.email,
          membership_id: mockUserData.membership_id,
        },
        token: 'mock.jwt.token',
      };

      mockReq.body = mockUserData;
      authService.register.mockResolvedValue(mockServiceResponse);

      await userController.register(mockReq, mockRes);

      expect(authService.register).toHaveBeenCalledWith(mockUserData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockServiceResponse);
      expect(logger.error).not.toHaveBeenCalled();
    });

    it('should return 400 if required fields are missing', async () => {
      mockReq.body = { username: 'testuser' }; // Missing required fields

      await userController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Missing required fields',
      });
      expect(authService.register).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });

    it('should return 400 if user already exists', async () => {
      mockReq.body = mockUserData;
      authService.register.mockRejectedValue(new Error('User already exists'));

      await userController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User already exists',
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const mockCredentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should successfully login user', async () => {
      const mockServiceResponse = {
        user: {
          id: 1,
          email: mockCredentials.email,
          username: 'testuser',
        },
        token: 'mock.jwt.token',
      };

      mockReq.body = mockCredentials;
      authService.login.mockResolvedValue(mockServiceResponse);

      await userController.login(mockReq, mockRes);

      expect(authService.login).toHaveBeenCalledWith(
        mockCredentials.email,
        mockCredentials.password,
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockServiceResponse);
      expect(logger.error).not.toHaveBeenCalled();
    });

    it('should return 400 if required fields are missing', async () => {
      mockReq.body = { email: 'test@example.com' }; // Missing password

      await userController.login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Email and password are required',
      });
      expect(authService.login).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });

    it('should return 401 for invalid credentials', async () => {
      mockReq.body = mockCredentials;
      authService.login.mockRejectedValue(new Error('Invalid credentials'));

      await userController.login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Invalid credentials',
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        membership_id: 'M123',
      };

      mockReq.user = mockUser;

      await userController.getProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUser);
      expect(logger.error).not.toHaveBeenCalled();
    });
  });
});
