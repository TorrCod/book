

-- Connect to the "books" database
\c books;

-- Create the "books" table if it does not exist
CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL
);

-- Grant all permissions on the "books" table to the user "torrrrzz"
GRANT ALL PRIVILEGES ON TABLE books TO torrrrzz;
