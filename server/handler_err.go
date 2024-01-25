package main

import "net/http"

// Returns an error
func handlerErr(w http.ResponseWriter, r *http.Request) {
	respondWithError(w, 400, "Something went wrong")
}