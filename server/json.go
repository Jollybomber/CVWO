package main

import (
	"encoding/json"
	"log"
	"net/http"
)

// Returns a proper error message
func respondWithError(w http.ResponseWriter, code int, msg string) {

	if code > 499 {
		log.Println("Responding with a 5XX error:", msg) // 5XX error likely a server side issue.
	}
	type errResponse struct {
		Error string  `json:"error"`
	}

	respondWithJSON(w , code, errResponse{
		Error:msg,
	})
}

// Tries to package payload as JSON
func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	data, err:= json.Marshal(payload)
	if err != nil{
		log.Printf("Failed to marshal JSON response: %v", payload)
		w.WriteHeader(500)
		return
	}
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(data)
}