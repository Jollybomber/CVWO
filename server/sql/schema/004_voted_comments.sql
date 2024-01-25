-- +goose Up
CREATE TABLE voted_comments (
    id TEXT PRIMARY KEY,
    comment_id TEXT NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(comment_id, user_id)
);

-- +goose Down
DROP TABLE voted_comments;