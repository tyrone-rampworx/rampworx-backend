# Rampworx Backend

This project handles database interactions, API calls, and all other backend requirements for RampWorx. It uses Express.js for the API server and Sequelize ORM for database operations.

## Project Structure 
``` 
rampworx-backend/
├── config/                  # Configuration files
│   └── sequelize.js        # Sequelize ORM configuration
├── controllers/            # Request handlers
│   ├── authController.js   # Authentication controller
│   └── userController.js   # User management controller
├── models/                 # Sequelize models
│   ├── User.js            # User model with Sequelize schema
│   └── Address.js         # Address model with User association
├── routes/                # API route definitions
│   ├── authRoutes.js      # Authentication routes
│   └── userRoutes.js      # User management routes
├── services/              # Business logic layer
│   ├── authService.js     # Authentication service
│   └── userService.js     # User management service
├── middlewares/           # Custom middlewares
│   └── authMiddleware.js  # JWT authentication middleware
├── utils/                 # Utility functions
│   ├── jwt.js            # JWT token utilities
│   └── logger.js         # Logger utility
├── __tests__/            # Test files
│   └── unit/             # Unit tests
├── .env                  # Environment variables
├── .eslintrc.json        # ESLint configuration
├── jest.config.js        # Jest test configuration
├── server.js             # Application entry point
├── package.json          # Dependencies and scripts
├── create_db_structure.sql # Reference SQL schema
├── docker-compose.yml    # PostgreSQL Docker configuration
├── login_to_postgres.sh  # Database login utility
└── node_modules/         # Node.js modules
```

## Set Up Guide 

### Prerequisites
- Docker
- Node.js v22.14.0
- npm (comes with Node.js)

### Local Setup
1. Clone the project and install dependencies:
    ```bash
    git clone <repository-url>
    cd rampworx-backend
    npm install
    ```

2. Set up the database:
    ```bash
    npm run db:setup
    ```
    Then run the contents of `create_db_structure.sql` in the PSQL prompt to create the schema and tables.

3. Configure environment variables:
    Create a `.env` file in the root directory with the following variables:
    ```
    # Database Configuration
    DB_USER=your_user
    DB_HOST=your_host
    DB_NAME=your_db
    DB_PASSWORD=your_password
    DB_PORT=your_port

    # Server Configuration
    PORT=3000
    NODE_ENV=development

    # JWT Configuration
    JWT_SECRET=your-secret-key
    JWT_EXPIRES_IN=24h
    ```

4. Start the application:
    - For production:
    ```bash
    npm start
    ```
    - For development (with auto-reload):
    ```bash
    npm run dev
    ```
    The server will start on port 3000 (or as specified in PORT env variable).

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with auto-reload
- `npm run db:setup` - Set up the PostgreSQL database using Docker
- `npm test` - Run all unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run lint` - Run ESLint to check code style
- `npm run lint:fix` - Automatically fix ESLint issues

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "membership_id": "string (optional)"
  }
  ```
- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- `GET /api/auth/profile` - Get user profile (Protected)

### Users
- `GET /api/users` - List all users (Protected)
- `GET /api/users/:id` - Get user by ID (Protected)
- `PUT /api/users/:id` - Update user (Protected)
- `DELETE /api/users/:id` - Delete user (Protected)

### Authentication
Protected endpoints require a valid JWT token in the request header:
```
Authorization: Bearer <your-token>
```

## Database Schema

The application uses PostgreSQL with Sequelize ORM. Main entities:

### Users Table
- `id`: Serial Primary Key
- `username`: String (unique)
- `email`: String (unique)
- `password`: String (hashed)
- `membership_id`: String (unique)
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Address Table
- `id`: Serial Primary Key
- `user_id`: Integer (Foreign Key)
- `street`: String
- `city`: String
- `postal_code`: String
- `country`: String

## Development

### Code Style and Linting
The project uses ESLint to maintain code quality and consistency. Key rules include:
- Use single quotes for strings
- 2 spaces for indentation
- Maximum line length of 100 characters
- Semicolons required
- Camelcase for variable names
- No unused variables (except with _ prefix)
- No console.log (use logger instead)

Run linting:
```bash
npm run lint      # Check for issues
npm run lint:fix  # Fix automatically fixable issues
```

### Adding New Models
To add a new model:
1. Create a new file in `models/`
2. Define the Sequelize model with proper associations
3. Create corresponding controller and service files
4. Add routes in the appropriate router file

### Error Handling
The application uses a standardized error response format:
```json
{
  "message": "Error description",
  "error": "Detailed error message (in development)"
}
```

### Authentication Flow
1. User registers or logs in via `/api/auth/register` or `/api/auth/login`
2. Server validates credentials and returns a JWT token
3. Client includes token in subsequent requests via Authorization header
4. Server validates token and grants access to protected resources

## Automated Testing

### Overview
The project uses Jest for unit testing, focusing on testing individual components in isolation without external dependencies. All tests are located in the `__tests__/unit` directory.

### Test Structure
```
__tests__/
└── unit/
    ├── controllers/
    │   └── userController.test.js    # User controller tests
    ├── middlewares/
    │   └── authMiddleware.test.js    # Auth middleware tests
    ├── services/
    │   └── authService.test.js       # Auth service tests
    └── utils/
        └── jwt.test.js              # JWT utility tests
```

### Running Tests
```bash
npm test              # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

### Test Setup
- Test environment configuration is in `__tests__/setup.unit.js`
- Environment variables are set for testing
- External dependencies (database, JWT, bcrypt) are mocked
- Logger is mocked to prevent console output

### Test Coverage
The following components are tested:
1. **Auth Service**
   - User registration
   - User login
   - User validation
   - Error handling for duplicate users
   - Password hashing and verification

2. **JWT Utils**
   - Token generation
   - Token verification
   - Error handling for invalid tokens

3. **Auth Middleware**
   - Token validation
   - User authentication
   - Error handling for missing/invalid tokens

4. **User Controller**
   - User registration endpoint
   - User login endpoint
   - Profile retrieval
   - Input validation
   - Error responses

### Mocking Strategy
1. **Database Operations**
   ```javascript
   jest.mock('../models/User', () => ({
     User: {
       create: jest.fn(),
       findOne: jest.fn(),
       findByPk: jest.fn()
     }
   }));
   ```

2. **External Services**
   ```javascript
   jest.mock('bcryptjs');
   jest.mock('../utils/jwt');
   jest.mock('../utils/logger');
   ```

### Best Practices
1. **Test Organization**
   - Group related tests using `describe` blocks
   - Clear test descriptions using `it` blocks
   - Setup and cleanup using `beforeEach` and `afterEach`

2. **Mocking**
   - Mock all external dependencies
   - Reset mocks between tests
   - Verify mock calls and arguments

3. **Error Handling**
   - Test both success and error cases
   - Verify error messages and status codes
   - Test edge cases and invalid inputs

4. **Code Coverage**
   - Aim for high test coverage
   - Test all branches of conditional logic
   - Include error handling paths

5. **Async Testing**
   - Use async/await for asynchronous tests
   - Test promise rejections
   - Handle timeouts appropriately

### Example Test
```javascript
describe('Auth Service', () => {
  it('should register a new user', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    const mockUser = { ...userData, id: 1 };
    User.create.mockResolvedValue(mockUser);

    const result = await authService.register(userData);

    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('token');
    expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
      username: userData.username,
      email: userData.email
    }));
  });
});
```
## Manual Testing Guide

### Prerequisites
1. Ensure the server is running:
   ```bash
   npm run dev
   ```

2. Set up environment variables in `.env`:
   ```
   DB_USER=your_user
   DB_HOST=your_host
   DB_NAME=your_db
   DB_PASSWORD=your_password
   DB_PORT=your_port
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=24h
   ```

### Testing Authentication Flow

1. **Register a New User**
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "username": "testuser",
       "email": "test@example.com",
       "password": "password123",
       "membership_id": "M123"
     }'
   ```
   Expected Response (200 OK):
   ```json
   {
     "user": {
       "id": 1,
       "username": "testuser",
       "email": "test@example.com",
       "membership_id": "M123"
     },
     "token": "eyJhbGciOiJIUzI1NiIs..."
   }
   ```

2. **Login User**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "password123"
     }'
   ```
   Expected Response (200 OK):
   ```json
   {
     "user": {
       "id": 1,
       "username": "testuser",
       "email": "test@example.com",
       "membership_id": "M123"
     },
     "token": "eyJhbGciOiJIUzI1NiIs..."
   }
   ```

3. **Get User Profile**
   ```bash
   # Replace <token> with the token received from login/register
   curl -X GET http://localhost:3000/api/auth/profile \
     -H "Authorization: Bearer <token>"
   ```
   Expected Response (200 OK):
   ```json
   {
     "id": 1,
     "username": "testuser",
     "email": "test@example.com",
     "membership_id": "M123"
   }
   ```

### Testing User Management

1. **List All Users**
   ```bash
   curl -X GET http://localhost:3000/api/users \
     -H "Authorization: Bearer <token>"
   ```
   Expected Response (200 OK):
   ```json
   [
     {
       "id": 1,
       "username": "testuser",
       "email": "test@example.com",
       "membership_id": "M123"
     }
   ]
   ```

2. **Get User by ID**
   ```bash
   curl -X GET http://localhost:3000/api/users/1 \
     -H "Authorization: Bearer <token>"
   ```
   Expected Response (200 OK):
   ```json
   {
     "id": 1,
     "username": "testuser",
     "email": "test@example.com",
     "membership_id": "M123"
   }
   ```

3. **Update User**
   ```bash
   # Note: Users can only update their own profile
   curl -X PUT http://localhost:3000/api/users/1 \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{
       "username": "updateduser",
       "email": "updated@example.com"
     }'
   ```
   Expected Response (200 OK):
   ```json
   {
     "id": 1,
     "username": "updateduser",
     "email": "updated@example.com",
     "membership_id": "M123"
   }
   ```

4. **Delete User**
   ```bash
   # Note: Users can only delete their own profile
   curl -X DELETE http://localhost:3000/api/users/1 \
     -H "Authorization: Bearer <token>"
   ```
   Expected Response (204 No Content)

### Error Cases to Test

1. **Invalid Registration**
   ```bash
   # Missing required fields
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "username": "testuser"
     }'
   ```
   Expected Response (400 Bad Request):
   ```json
   {
     "message": "Please provide all required fields"
   }
   ```

2. **Invalid Login**
   ```bash
   # Wrong password
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "wrongpassword"
     }'
   ```
   Expected Response (401 Unauthorized):
   ```json
   {
     "message": "Invalid email or password"
   }
   ```

3. **Unauthorized Access**
   ```bash
   # No token provided
   curl -X GET http://localhost:3000/api/users
   ```
   Expected Response (401 Unauthorized):
   ```json
   {
     "message": "No token provided"
   }
   ```

4. **Invalid Token**
   ```bash
   curl -X GET http://localhost:3000/api/users \
     -H "Authorization: Bearer invalid.token.here"
   ```
   Expected Response (401 Unauthorized):
   ```json
   {
     "message": "Invalid token"
   }
   ```

5. **Unauthorized Update**
   ```bash
   # Trying to update another user's profile
   curl -X PUT http://localhost:3000/api/users/2 \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{
       "username": "hacker"
     }'
   ```
   Expected Response (403 Forbidden):
   ```json
   {
     "message": "Not authorized to update this user"
   }
   ```

### Testing Tools
For a better testing experience, consider using:
- [Postman](https://www.postman.com/) - GUI tool for API testing
- [Insomnia](https://insomnia.rest/) - Alternative to Postman
- [HTTPie](https://httpie.io/) - Command-line tool with a more user-friendly syntax than curl

### Troubleshooting Common Issues

1. **Connection Refused**
   - Ensure the server is running (`npm run dev`)
   - Check if the port is correct in your request
   - Verify no other service is using port 3000

2. **Database Errors**
   - Verify PostgreSQL is running
   - Check database credentials in `.env`
   - Ensure database and tables exist

3. **Authentication Errors**
   - Verify JWT_SECRET is set in `.env`
   - Check token format (Bearer prefix)
   - Ensure token hasn't expired

4. **Request Body Errors**
   - Verify Content-Type header is set
   - Check JSON syntax in request body
   - Ensure all required fields are provided

## Contributing

### Branch Strategy
- `main` - Production-ready code
- `dev` - Development branch for feature integration
- Feature branches should be created from `dev` with the format: `feature/feature-name`
- Bug fix branches should be named: `fix/bug-description`

### Code Style
- Use ESLint for code linting
- Follow the existing project structure
- Use async/await for asynchronous operations
- Include JSDoc comments for functions
- Use meaningful variable and function names

### Pull Request Process
1. Create your feature branch from `dev`
2. Update documentation if needed
3. Ensure all existing tests pass
4. Create a pull request to `dev`
5. Request review from at least one team member
6. Merge after approval

### Commit Messages
Follow conventional commits format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks