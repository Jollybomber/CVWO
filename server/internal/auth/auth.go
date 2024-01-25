package auth

import (
	"errors"
	"net/http"
	"strings"
)

// Checks API key provided in http request
func GetAPIKey (headers http.Header) (string, error) {
	val := headers.Get("Authorization")
	if val == "" {
		return "", errors.New("no authentication info found")
	}

	vals := strings.Split(val, " ")
	if len(vals) != 2 {
		return "", errors.New("wrong authentication header")
	}

	if vals[0] != "ApiKey" {
		return "", errors.New("error with first part of authentication header")
	}
	return vals[1], nil
}