package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"

	"github.com/Jollybomber/cvwo_project/internal/database"
	_ "github.com/lib/pq"
)

type apiConfig struct{
	DB *database.Queries
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func main() {
	

	// Loads .env file 
	godotenv.Load();

	// Gets port from .env to run program
	port := os.Getenv("PORT")
	if port == "" {
		log.Fatal("PORT is not found in the environment")
	}

	// Gets database URL from .env
	dbURL := os.Getenv("DB_URL")
	if dbURL == "" {
		log.Fatal("DB_URL is not found in the environment")
	}

	// Connect to database
	conn, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal("Can't connect to database", err)
	}

	apiCfg := apiConfig{
		DB: database.New(conn),
	}

	router := chi.NewRouter()

	// Allows others to make requests to the server
	router.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"https://*", "http://"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"*"},
		ExposedHeaders: []string{"Link"},
		AllowCredentials: false,
		MaxAge: 300,
	}))

	v1Router := chi.NewRouter()

	// v1Router.HandleFunc("/login", Login)
	// v1Router.HandleFunc("/home", Home)
	// v1Router.HandleFunc("/refresh", Refresh)

	v1Router.Get("/healthz", handlerReadiness) // Check server is running.
	v1Router.Get("/err", handlerErr) // Test for error handling
	v1Router.Post("/users", apiCfg.handlerCreateUser)
	v1Router.Get("/users", apiCfg.middlewareAuth(apiCfg.handlerGetUser))
	v1Router.Delete("/users", apiCfg.middlewareAuth(apiCfg.handlerDeleteUser))
	v1Router.Post("/users/login", apiCfg.handlerGetAPI)
	v1Router.Get("/posts", apiCfg.handlerGetPosts)
	v1Router.Post("/posts", apiCfg.middlewareAuth(apiCfg.handlerCreatePost))
	v1Router.Delete("/posts", apiCfg.middlewarePost(apiCfg.handlerDeletePostByID))
	v1Router.Patch("/posts", apiCfg.handlerEditPost)
	v1Router.Post("/posts/search", apiCfg.middlewarePost(apiCfg.handlerGetPostByID))
	v1Router.Post("/posts/comments", apiCfg.middlewarePost(apiCfg.handlerGetCommentsByPost_Id))
	v1Router.Post("/comments", apiCfg.middlewareAuth(apiCfg.handlerCreateComment))
	v1Router.Delete("/comments", apiCfg.middlewareComment(apiCfg.handlerDeleteCommentsById))
	v1Router.Patch("/comments", apiCfg.handlerEditComment)
	v1Router.Post("/count/comments", apiCfg.middlewarePost(apiCfg.handlerGetCommentCount))
	v1Router.Post("/vc", apiCfg.handlerCreateVC)
	v1Router.Delete("/vc", apiCfg.handlerDeleteVC)
	v1Router.Post("/vp", apiCfg.handlerCreateVP)
	v1Router.Delete("/vp", apiCfg.handlerDeleteVP)
	v1Router.Post("/count/vc", apiCfg.middlewareComment(apiCfg.handlerGetVC))
	v1Router.Post("/count/vp", apiCfg.middlewarePost(apiCfg.handlerGetVP))



	

	// Mounts router to /v1 path
	router.Mount("/v1", v1Router)

	// Starts server on localhost:port
	srv := &http.Server{
		Handler: router,
		Addr: ":" + port,
	}

	log.Printf("server starting on port %v", port)
	error := srv.ListenAndServe()
	if error != nil {
		log.Fatal(error)
	}

	fmt.Println("Port:", port)
}