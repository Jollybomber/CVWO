package main

import "net/http"

// Handles a server check
func handlerReadiness(w http.ResponseWriter, r *http.Request){
	respondWithJSON(w, 200, struct{}{})
}