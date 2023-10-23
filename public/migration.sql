DROP TABLE IF EXISTS posts;

CREATE TABLE posts(
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL
);