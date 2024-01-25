-- name: CreateCommentVote :one
INSERT INTO voted_comments(id, comment_id, user_id)  
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetVotesByComment :one
SELECT COUNT(*) FROM voted_comments WHERE comment_id = $1;

-- name: DeleteVotesByComment :one
DELETE FROM voted_comments WHERE comment_id = $1 AND user_id = $2 RETURNING *;