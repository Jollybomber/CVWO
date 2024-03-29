// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0
// source: voted_comments.sql

package database

import (
	"context"
)

const createCommentVote = `-- name: CreateCommentVote :one
INSERT INTO voted_comments(id, comment_id, user_id)  
VALUES ($1, $2, $3)
RETURNING id, comment_id, user_id
`

type CreateCommentVoteParams struct {
	ID        string
	CommentID string
	UserID    string
}

func (q *Queries) CreateCommentVote(ctx context.Context, arg CreateCommentVoteParams) (VotedComment, error) {
	row := q.db.QueryRowContext(ctx, createCommentVote, arg.ID, arg.CommentID, arg.UserID)
	var i VotedComment
	err := row.Scan(&i.ID, &i.CommentID, &i.UserID)
	return i, err
}

const deleteVotesByComment = `-- name: DeleteVotesByComment :one
DELETE FROM voted_comments WHERE comment_id = $1 AND user_id = $2 RETURNING id, comment_id, user_id
`

type DeleteVotesByCommentParams struct {
	CommentID string
	UserID    string
}

func (q *Queries) DeleteVotesByComment(ctx context.Context, arg DeleteVotesByCommentParams) (VotedComment, error) {
	row := q.db.QueryRowContext(ctx, deleteVotesByComment, arg.CommentID, arg.UserID)
	var i VotedComment
	err := row.Scan(&i.ID, &i.CommentID, &i.UserID)
	return i, err
}

const getVotesByComment = `-- name: GetVotesByComment :one
SELECT COUNT(*) FROM voted_comments WHERE comment_id = $1
`

func (q *Queries) GetVotesByComment(ctx context.Context, commentID string) (int64, error) {
	row := q.db.QueryRowContext(ctx, getVotesByComment, commentID)
	var count int64
	err := row.Scan(&count)
	return count, err
}
