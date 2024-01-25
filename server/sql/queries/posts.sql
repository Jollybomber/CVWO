-- name: CreatePost :one
INSERT INTO posts(id, created_at, updated_at, username, header, body, tag, user_id)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING *;

-- name: GetPosts :many
SELECT * FROM posts;

-- name: GetPostbyID :one
SELECT * FROM posts WHERE id = $1;

-- name: DeletePostbyID :one
DELETE FROM posts WHERE id = $1 RETURNING *;

-- name: EditPost :one
UPDATE posts SET header = $1, body = $2 WHERE id = $3 RETURNING *;