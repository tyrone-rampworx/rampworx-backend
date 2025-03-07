// Mock factory for test data
const mockFactory = {
  createMockUser: (overrides = {}) => {
    const user = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      membership_id: 'M123',
      created_at: new Date(),
      updated_at: new Date(),
      toJSON: function () {
        // eslint-disable-next-line no-unused-vars
        const { password, ...userWithoutPassword } = this;
        return userWithoutPassword;
      },
    };

    return {
      ...user,
      ...overrides,
    };
  },

  createMockUserModel: () => {
    return {
      create: jest.fn(),
      findOne: jest.fn(),
      findByPk: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
      findAll: jest.fn(),
    };
  },

  createMockAuthService: () => {
    return {
      register: jest.fn(),
      login: jest.fn(),
      validateUser: jest.fn(),
    };
  },

  createMockUserService: () => {
    return {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
  },
};

module.exports = mockFactory;
