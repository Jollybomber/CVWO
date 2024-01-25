-- +goose Up
CREATE TABLE voted_posts (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (post_id, user_id)
);

-- +goose Down
DROP TABLE voted_posts;