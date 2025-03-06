-- Create a custom schema (if not already created)
CREATE SCHEMA IF NOT EXISTS businessdata;

-- Create the users table
CREATE TABLE businessdata.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    membership_id VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the address table
CREATE TABLE businessdata.address (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES businessdata.users(id) ON DELETE CASCADE
);

-- Insert sample users
INSERT INTO businessdata.users (username, email, password, membership_id)
VALUES 
    ('john_doe', 'john.doe@example.com', 'hashed_password_1', 'M123'),
    ('jane_smith', 'jane.smith@example.com', 'hashed_password_2', 'M124');

-- Insert sample addresses
INSERT INTO businessdata.address (user_id, street, city, postal_code, country)
VALUES 
    (1, '123 Elm St', 'Somewhere', 'FY5 4BP', 'England'),
    (2, '456 Oak St', 'Elsewhere', 'OL4 1QN', 'England');

-- Query to join users with their addresses
SELECT u.id, u.username, u.email, u.membership_id, a.street, a.city, a.postal_code, a.country
FROM businessdata.users u
JOIN businessdata.address a ON u.id = a.user_id;
