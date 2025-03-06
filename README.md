# Rampworx Backend

This project is for handeling DB interations, API calls and all other backend requirements for the RampWorx

## Project Structure 
``` 
rampworx-backend/
├── config/                  # Configuration files (e.g., database, environment variables)
│   └── db.js                # Database configuration
├── controllers/             # Request handlers (controllers)
│   └── userController.js    # Controller to handle user-related API requests
├── models/                  # Database models (for interaction with tables)
│   └── userModel.js         # Model for user-related database queries
├── routes/                  # API route definitions
│   └── userRoutes.js        # Routes for user-related endpoints
├── services/                # Business logic (optional, can be used for complex services)
│   └── userService.js       # Service to handle user-related business logic
├── middlewares/             # Custom middlewares (authentication, validation, etc.)
│   └── authMiddleware.js    # Middleware for authentication
├── utils/                   # Utility functions (e.g., logging, error handling)
│   └── logger.js            # Logger utility
├── .env                     # Environment variables
├── server.js                # The entry point for the application
├── package.json             # Dependencies and scripts
├── create_db_structure.sql  # SQL for creating database structure and inserting test data
├── docker-compose.yml       # Build a PostgreSQL DB instance for running locally
├── login_to_postgres.sh     # Runs Docker compose and logs you into DB
└── node_modules/            # Node.js modules
```

## Set Up Guide 

### Prerequisite
- Install Docker
- Install Node v22.14.0

### Local Set Up
- Git clone the project
- Move into the cloned rampworx-backend directory
    ``` 
    cd rampworx-backend
    ```
- Run NPM install to download node modules
    ``` 
    npm install
    ```
- Execute the following script to build you postgres instance and log you in using PSQL
    ``` 
    ./login_to_postgres.sh
    ```
- Run the content of the create_db_structure.sql within PSQL and then exit out
- Run NPM start to start the application on port 5000
    ``` 
    npm start
    ```
- App should be able to be hit with the following URL
    ``` 
    http://localhost:5000/api/users
    ```