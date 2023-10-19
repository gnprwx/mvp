DROP TABLE IF EXISTS posts;

CREATE TABLE posts(
    id SERIAL,
    username TEXT,
    message TEXT,
    created_at TEXT
);