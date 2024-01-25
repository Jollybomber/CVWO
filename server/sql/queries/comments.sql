-- name: CreateComment :one
INSERT INTO comments(id, created_at, updated_at, username, body, post_id, user_id)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;

-- name: GetCommentsByPost_Id :many
SELECT * FROM comments WHERE post_id = $1;

-- name: GetCommentByID :one
SELECT * FROM comments WHERE id = $1;

-- name: DeleteCommentById :one
DELETE FROM comments WHERE id = $1 RETURNING *; 

-- name: GetCommentCount :one
SELECT COUNT(*) FROM comments WHERE post_id = $1;

-- name: EditComment :one
UPDATE comments SET body = $1 WHERE id = $2 RETURNING *;