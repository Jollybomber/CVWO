package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
	"github.com/google/uuid"
	"github.com/Jollybomber/cvwo_project/internal/database"

	
)

func (apiCfg *apiConfig) handlerCreatePost(w http.ResponseWriter, r *http.Request, user database.User){
	enableCors(&w)
	type parameters struct {
		Username string `json:"username"`
		Header string `json:"header"`
		Body string `json:"body"`
		Tag string `json:"tag"`
	}
	decoder := json.NewDecoder(r.Body)

	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Error parsing JSON: %v", err))
		return
	}

	post, err := apiCfg.DB.CreatePost(r.Context(), database.CreatePostParams{
		ID: uuid.NewString(),
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
		Username: params.Username,
		Header: params.Header,
		Body: params.Body,
		Tag: params.Tag,
		UserID: user.ID,
	})
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Couldn't create post: %v", err))
		return
	}

	respondWithJSON(w, 201, databasePostToPost(post))
}

func (apiCfg *apiConfig) handlerGetPosts(w http.ResponseWriter, r *http.Request){
	enableCors(&w)
	posts, err := apiCfg.DB.GetPosts(r.Context())
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Couldn't get posts: %v", err))
		return
	}

	respondWithJSON(w, 201, databasePostsToPosts(posts))
}

func (apiCfg *apiConfig) handlerGetPostByID(w http.ResponseWriter, r *http.Request, post database.Post){
	
	respondWithJSON(w, 200, databasePostToPost(post))
}

func (apiCfg *apiConfig) handlerDeletePostByID(w http.ResponseWriter, r *http.Request, post database.Post){
	
	post, err := apiCfg.DB.DeletePostbyID(r.Context(), post.ID)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Error deleting: %v", err))
		return
	}
	respondWithJSON(w, 200, databasePostToPost(post))
}

func (apiCfg *apiConfig) handlerCreateVP(w http.ResponseWriter, r *http.Request){
	enableCors(&w)
	type parameters struct {
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
	
	vp, err := apiCfg.DB.CreatePostVote(r.Context(), database.CreatePostVoteParams{
		ID: uuid.NewString(),
		PostID: params.PostID,
		UserID: params.UserID,
	})
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Couldn't create post vote: %v", err))
		return
	}

	respondWithJSON(w, 201, databaseVPToVP(vp))
}

func (apiCfg *apiConfig) handlerGetVP(w http.ResponseWriter, r *http.Request, post database.Post){
	enableCors(&w)
	count, err := apiCfg.DB.GetVotesByPost(r.Context(), post.ID)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Couldn't get post votes: %v", err))
		return
	}

	respondWithJSON(w, 201, databaseVotes(count))
}

func (apiCfg *apiConfig) handlerDeleteVP(w http.ResponseWriter, r *http.Request){
	enableCors(&w)
	type parameters struct {
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

	vp, err := apiCfg.DB.DeleteVotesByPost(r.Context(), database.DeleteVotesByPostParams{
		PostID: params.PostID,
		UserID: params.UserID,
	})
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Couldn't downvote post: %v", err))
		return
	}

	respondWithJSON(w, 201, databaseVPToVP(vp))
}

func (apiCfg *apiConfig) handlerEditPost(w http.ResponseWriter, r *http.Request){
	enableCors(&w)
	type parameters struct {
		Header string `json:"header"`
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
	
	post, err := apiCfg.DB.EditPost(r.Context(), database.EditPostParams{
		Header: params.Header,
		Body: params.Body,
		ID: params.ID,
	})
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Couldn't edit post: %v", err))
		return
	}

	respondWithJSON(w, 201, databasePostToPost(post))
}


type postHandler func (http.ResponseWriter, *http.Request, database.Post)

func (apiCfg *apiConfig) middlewarePost(handler postHandler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		type parameters struct {
			Id string `json:"id"`
		}
		decoder := json.NewDecoder(r.Body)
	
		params := parameters{}
		err := decoder.Decode(&params)
		if err != nil {
			respondWithError(w, 400, fmt.Sprintf("Error parsing JSON: %v", err))
			return
		}

		
	post, err := apiCfg.DB.GetPostbyID(r.Context(), params.Id)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Couldn't get post: %v", err))
		return
	}
	handler(w, r, post)
	}
	
}