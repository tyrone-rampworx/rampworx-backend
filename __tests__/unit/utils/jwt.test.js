const { generateToken, verifyToken } = require('../../../utils/jwt');
const jwt = require('jsonwebtoken');

// Mock jsonwebtoken
jest.mock('jsonwebtoken');

describe('JWT Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    membership_id: 'M123',
  };

  it('should generate a valid JWT token', () => {
    const mockToken = 'mock.jwt.token';
    jwt.sign.mockReturnValue(mockToken);

    const token = generateToken(mockUser);

    expect(token).toBe(mockToken);
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
        membership_id: mockUser.membership_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );
  });

  it('should verify a valid token', () => {
    const mockDecodedToken = {
      id: mockUser.id,
      username: mockUser.username,
      email: mockUser.email,
      membership_id: mockUser.membership_id,
    };
    jwt.verify.mockReturnValue(mockDecodedToken);

    const token = 'valid.jwt.token';
    const decoded = verifyToken(token);

    expect(decoded).toEqual(mockDecodedToken);
    expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
  });

  it('should throw error for invalid token', () => {
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    expect(() => {
      verifyToken('invalid.token.here');
    }).toThrow('Invalid token');
  });

  it('should throw error for expired token', () => {
    jwt.verify.mockImplementation(() => {
      const error = new Error('jwt expired');
      error.name = 'TokenExpiredError';
      throw error;
    });

    expect(() => {
      verifyToken('expired.token.here');
    }).toThrow('Invalid token');
  });
});
