CREATE TABLE documents (
    id SERIAL PRIMARY KEY,          -- Auto-incrementing unique ID for each document
    user_id INT NOT NULL,           -- Foreign key to associate the document with a user
    content TEXT NOT NULL,          -- Extracted text content of the PDF
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp for when the document was created
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Ensure referential integrity
);
