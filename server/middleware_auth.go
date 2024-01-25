package main

import (
	"fmt"
	"net/http"

	"github.com/Jollybomber/cvwo_project/internal/auth"
	"github.com/Jollybomber/cvwo_project/internal/database"
)

type authenticationHandler func (http.ResponseWriter, *http.Request, database.User)

func (apiCfg *apiConfig) middlewareAuth(handler authenticationHandler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		apiKey, err := auth.GetAPIKey(r.Header)
	if err != nil {
		respondWithError(w, 403, fmt.Sprintf("Authentication error: %v", err))
		return
	}

	user, err := apiCfg.DB.GetUserByAPIKey(r.Context(), apiKey)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Couldn't get user: %v", err))
		return
	}
	handler(w, r, user)
	}
	
}


