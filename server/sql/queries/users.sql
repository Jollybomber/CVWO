-- name: CreateUser :one
INSERT INTO users(id, created_at, updated_at, username, password, api_key)  
VALUES ($1, $2, $3, $4, $5, encode(sha256(random()::text::bytea), 'hex'))
RETURNING *;

-- name: GetUserByAPIKey :one
SELECT * FROM users WHERE api_key = $1;

-- name: GetAPIKeybyUserPassword :one
SELECT api_key FROM users WHERE username = $1 AND password = $2;

-- name: DeleteUser :one
DELETE FROM users WHERE id = $1 RETURNING *;