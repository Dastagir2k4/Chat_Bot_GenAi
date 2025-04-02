CREATE TABLE users (
    id SERIAL PRIMARY KEY,       -- Auto-incrementing unique ID for each user
    name VARCHAR(255) NOT NULL,  -- Name of the user, required
    email VARCHAR(255) NOT NULL UNIQUE, -- Email of the user, required and must be unique
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp for when the user was created
);
