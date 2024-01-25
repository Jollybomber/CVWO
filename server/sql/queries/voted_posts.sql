-- name: CreatePostVote :one
INSERT INTO voted_posts(id, post_id, user_id)  
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetVotesByPost :one
SELECT COUNT(*) FROM voted_posts WHERE post_id = $1;

-- name: DeleteVotesByPost :one
DELETE FROM voted_posts WHERE post_id = $1 AND user_id = $2 RETURNING *;