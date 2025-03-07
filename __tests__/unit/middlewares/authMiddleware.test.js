const { verifyToken } = require('../../../utils/jwt');
const authService = require('../../../services/authService');
const authMiddleware = require('../../../middlewares/authMiddleware');
const logger = require('../../../utils/logger');

jest.mock('../../../utils/jwt');
jest.mock('../../../services/authService');
jest.mock('../../../utils/logger');

describe('Auth Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      headers: {},
      user: undefined,
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  it('should pass if valid token is provided', async () => {
    const mockToken = 'Bearer valid.jwt.token';
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword',
      membership_id: 'M123',
    };

    mockReq.headers.authorization = mockToken;
    verifyToken.mockReturnValue({ id: 1, username: 'testuser' });
    authService.validateUser.mockResolvedValue(mockUser);

    await authMiddleware(mockReq, mockRes, mockNext);

    expect(verifyToken).toHaveBeenCalledWith('valid.jwt.token');
    expect(authService.validateUser).toHaveBeenCalledWith(1);
    expect(mockReq.user).toEqual({
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      membership_id: 'M123',
    });
    expect(mockNext).toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('should return 401 if no token is provided', async () => {
    await authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'No token provided',
    });
    expect(mockNext).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('should return 401 if token format is invalid', async () => {
    mockReq.headers.authorization = 'InvalidTokenFormat';

    await authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'No token provided',
    });
    expect(mockNext).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('should return 401 if token verification fails', async () => {
    mockReq.headers.authorization = 'Bearer invalid.token';
    verifyToken.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Invalid token',
    });
    expect(mockNext).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalled();
  });

  it('should return 401 if user not found', async () => {
    const mockToken = 'Bearer valid.jwt.token';

    mockReq.headers.authorization = mockToken;
    verifyToken.mockReturnValue({ id: 1 });
    authService.validateUser.mockResolvedValue(null);

    await authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'User no longer exists',
    });
    expect(mockNext).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('should return 401 if user validation fails', async () => {
    const mockToken = 'Bearer valid.jwt.token';

    mockReq.headers.authorization = mockToken;
    verifyToken.mockReturnValue({ id: 1 });
    authService.validateUser.mockRejectedValue(new Error('User not found'));

    await authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'User no longer exists',
    });
    expect(mockNext).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalled();
  });

  it('should return 500 for unexpected errors', async () => {
    const mockToken = 'Bearer valid.jwt.token';

    mockReq.headers.authorization = mockToken;
    verifyToken.mockImplementation(() => {
      throw new Error('Database error');
    });

    await authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Authentication error',
      error: 'Database error',
    });
    expect(mockNext).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalled();
  });
});
