package main

import (
	"time"

	"github.com/Jollybomber/cvwo_project/internal/database"
)

type User struct {
	ID        string `json:"id"`
	CreatedAt time.Time	`json:"created_at"`
	UpdatedAt time.Time	`json:"updated_at"`
	Username      string	`json:"username"`
	Password 	string		`json:"password"`
	APIKey 	string `json:"api_key"`
}

func databaseUserToUser(dbUser database.User) User {
	return User {
		ID:			dbUser.ID,
		CreatedAt:	dbUser.CreatedAt,
		UpdatedAt:	dbUser.UpdatedAt,
		Username: 		dbUser.Username,
		Password:	dbUser.Password,
		APIKey:		dbUser.ApiKey,
	}
}

type Post struct {
	ID        string `json:"id"`
	CreatedAt time.Time	`json:"created_at"`
	UpdatedAt time.Time	`json:"updated_at"`
	Username      string	`json:"username"`
	Header string `json:"header"`
	Body string `json:"body"`
	Tag string `json:"tag"`
	UserID string `json:"user_id"`
}

func databasePostToPost (dbPost database.Post) Post {
	return Post {
		ID: dbPost.ID,
		CreatedAt: dbPost.CreatedAt,
		UpdatedAt: dbPost.UpdatedAt,
		Username: dbPost.Username,
		Header : dbPost.Header,
		Body: dbPost.Body,
		Tag: dbPost.Tag,
		UserID: dbPost.UserID,
	}
}

func databasePostsToPosts (dbPosts []database.Post) []Post {
	posts := []Post{}
	for _, dbPost := range dbPosts {
		posts = append (posts, databasePostToPost(dbPost))
	}
	return posts
}


type Comment struct {
	ID        string `json:"id"`
	CreatedAt time.Time	`json:"created_at"`
	UpdatedAt time.Time	`json:"updated_at"`
	Username      string	`json:"username"`
	Body string `json:"body"`
	PostID string `json:"post_id"`
	UserID string `json:"user_id"`
}

func databaseCommentToComment (dbComment database.Comment) Comment {
	return Comment {
		ID: dbComment.ID,
		CreatedAt: dbComment.CreatedAt,
		UpdatedAt: dbComment.UpdatedAt,
		Username: dbComment.Username,
		Body: dbComment.Body,
		PostID: dbComment.PostID,
		UserID: dbComment.UserID,
	}
}

func databaseCommentsToComments (dbComments []database.Comment) []Comment {
	comments := []Comment{}
	for _, dbComment := range dbComments {
		comments = append (comments, databaseCommentToComment(dbComment))
	}
	return comments
}

type VotedComment struct {
	ID        string `json:"id"`
	CommentID string `json:"comment_id"`
	UserID string `json:"user_id"`
}

func databaseVCToVC (dbVotedComment database.VotedComment) VotedComment {
	return VotedComment {
		ID: dbVotedComment.ID,
		CommentID: dbVotedComment.CommentID,
		UserID: dbVotedComment.UserID,
	}
}

type VotedPost struct {
	ID        string `json:"id"`
	PostID string `json:"post_id"`
	UserID string `json:"user_id"`
}

func databaseVPToVP (dbVotedPost database.VotedPost) VotedPost {
	return VotedPost {
		ID: dbVotedPost.ID,
		PostID: dbVotedPost.PostID,
		UserID: dbVotedPost.UserID,
	}
}

type Votes struct {
	Votes 	int64 `json:"votes"`
}

func databaseVotes (count int64) Votes {
	return Votes {
		Votes: count,
	}
}
