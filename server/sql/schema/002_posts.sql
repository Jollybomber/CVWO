-- +goose Up
CREATE TABLE posts (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    username TEXT NOT NULL,
    header TEXT NOT NULL,
    body TEXT NOT NULL,
    tag TEXT NOT NULL DEFAULT 'General',
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- +goose Down
DROP TABLE posts;