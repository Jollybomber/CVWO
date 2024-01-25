package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/Jollybomber/cvwo_project/internal/database"
	"github.com/google/uuid"
)

func (apiCfg *apiConfig) handlerCreateComment(w http.ResponseWriter, r *http.Request, user database.User){
	enableCors(&w)
	type parameters struct {
		Username string `json:"username"`
		Body string `json:"body"`
		PostID string `json:"post_id"`
		UserID string `json:"user_id"`
	}
	decoder := json.NewDecoder(r.Body)

	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Error parsing JSON: %v", err))
		return
	}
	

	comment, err := apiCfg.DB.CreateComment(r.Context(), database.CreateCommentParams{
		ID: uuid.NewString(),
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
		Username: params.Username,
		Body: params.Body,
		PostID: params.PostID,
		UserID: params.UserID,
	})
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Couldn't create comment: %v", err))
		return
	}

	respondWithJSON(w, 201, databaseCommentToComment(comment))
}

func (apiCfg *apiConfig) handlerGetCommentsByPost_Id(w http.ResponseWriter, r *http.Request, post database.Post){
	enableCors(&w)
	comments, err := apiCfg.DB.GetCommentsByPost_Id(r.Context(), post.ID)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Couldn't get comments: %v", err))
		return
	}

	respondWithJSON(w, 201, databaseCommentsToComments(comments))
}

func (apiCfg *apiConfig) handlerDeleteCommentsById(w http.ResponseWriter, r *http.Request, comment database.Comment){
	enableCors(&w)
	comment, err := apiCfg.DB.DeleteCommentById(r.Context(), comment.ID)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Couldn't get comments: %v", err))
		return
	}

	respondWithJSON(w, 201, databaseCommentToComment(comment))
}

func (apiCfg *apiConfig) handlerCreateVC(w http.ResponseWriter, r *http.Request){
	enableCors(&w)
	type parameters struct {
		CommentID string `json:"comment_id"`
		UserID string `json:"user_id"`
	}
	decoder := json.NewDecoder(r.Body)

	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Error parsing JSON: %v", err))
		return
	}
	
	vc, err := apiCfg.DB.CreateCommentVote(r.Context(), database.CreateCommentVoteParams{
		ID: uuid.NewString(),
		CommentID: params.CommentID,
		UserID: params.UserID,
	})
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Couldn't create comment vote: %v", err))
		return
	}

	respondWithJSON(w, 201, databaseVCToVC(vc))
}

func (apiCfg *apiConfig) handlerGetVC(w http.ResponseWriter, r *http.Request, comment database.Comment){
	enableCors(&w)
	count, err := apiCfg.DB.GetVotesByComment(r.Context(), comment.ID)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Couldn't get comment votes: %v", err))
		return
	}

	respondWithJSON(w, 201, databaseVotes(count))
}

func (apiCfg *apiConfig) handlerGetCommentCount(w http.ResponseWriter, r *http.Request, post database.Post){
	enableCors(&w)
	count, err := apiCfg.DB.GetCommentCount(r.Context(), post.ID)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Couldn't get comments: %v", err))
		return
	}

	respondWithJSON(w, 201, databaseVotes(count))
}

func (apiCfg *apiConfig) handlerDeleteVC(w http.ResponseWriter, r *http.Request){
	enableCors(&w)
	type parameters struct {
		CommentID string `json:"comment_id"`
		UserID string `json:"user_id"`
	}
	decoder := json.NewDecoder(r.Body)

	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Error parsing JSON: %v", err))
		return
	}

	vc, err := apiCfg.DB.DeleteVotesByComment(r.Context(), database.DeleteVotesByCommentParams{
		CommentID: params.CommentID,
		UserID: params.UserID,
	})
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Couldn't downvote comment: %v", err))
		return
	}

	respondWithJSON(w, 201, databaseVCToVC(vc))
}

func (apiCfg *apiConfig) handlerEditComment(w http.ResponseWriter, r *http.Request){
	enableCors(&w)
	type parameters struct {
		Body string `json:"body"`
		ID string `json:"id"`
		
	}
	decoder := json.NewDecoder(r.Body)

	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Error parsing JSON: %v", err))
		return
	}
	
	comment, err := apiCfg.DB.EditComment(r.Context(), database.EditCommentParams{
		Body: params.Body,
		ID: params.ID,
	})
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Couldn't edit comment: %v", err))
		return
	}

	respondWithJSON(w, 201, databaseCommentToComment(comment))
}

type commentHandler func (http.ResponseWriter, *http.Request, database.Comment)

func (apiCfg *apiConfig) middlewareComment(handler commentHandler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		type parameters struct {
			ID string`json:"id"`
		}
		decoder := json.NewDecoder(r.Body)
	
		params := parameters{}
		err := decoder.Decode(&params)
		if err != nil {
			respondWithError(w, 400, fmt.Sprintf("Error parsing JSON: %v", err))
			return
		}
		
	comment, err := apiCfg.DB.GetCommentByID(r.Context(), params.ID)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Couldn't get user: %v", err))
		return
	}
	handler(w, r, comment)
	}
	
}