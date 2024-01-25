package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
	"github.com/google/uuid"
	"github.com/Jollybomber/cvwo_project/internal/database"

	
)

func (apiCfg *apiConfig) handlerCreateUser(w http.ResponseWriter, r *http.Request){
	type parameters struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	decoder := json.NewDecoder(r.Body)

	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Error parsing JSON: %v", err))
		return
	}

	// CreateUser from sqlc
	user, err := apiCfg.DB.CreateUser(r.Context(), database.CreateUserParams{
		ID: uuid.NewString(),
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
		Username: params.Username,
		Password: params.Password,
	})
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Couldn't create user: %v", err))
		return
	}


	respondWithJSON(w, 201, databaseUserToUser(user))
}

func (apiCfg *apiConfig) handlerGetUser(w http.ResponseWriter, r *http.Request, user database.User){
	
	
	respondWithJSON(w, 200, databaseUserToUser(user))
}

func (apiCfg *apiConfig) handlerGetAPI(w http.ResponseWriter, r *http.Request){
	type parameters struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	decoder := json.NewDecoder(r.Body)

	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Error parsing JSON: %v", err))
		return
	}

	// CreateUser from sqlc
	APIKey, err := apiCfg.DB.GetAPIKeybyUserPassword(r.Context(), database.GetAPIKeybyUserPasswordParams{
		Username: params.Username,
		Password: params.Password,
	})
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Couldn't find user: %v", err))
		return
	}


	respondWithJSON(w, 201, APIKey)
}

func (apiCfg *apiConfig) handlerDeleteUser(w http.ResponseWriter, r *http.Request, user database.User){
	enableCors(&w)

	user, err := apiCfg.DB.DeleteUser(r.Context(), user.ID)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Couldn't delete user: %v", err))
		return
	}

	respondWithJSON(w, 201, databaseUserToUser(user))
}