// golag restapi server with gin-gonic and gorm for sqlite3
// jwt token based authentication
// "gorm.io/driver/sqlite"
// "gorm.io/gorm"
// "github.com/gin-gonic/gin"
// "github.com/dgrijalva/jwt-go"
// "github.com/gin-contrib/cors"
// swagger

package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// User struct
type UserModel struct {
	gorm.Model
	Username string `json:"username"`
	Password string `json:"password"`
}

// UserLogin struct
type UserLogin struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// UserToken struct
type UserToken struct {
	Username string `json:"username"`
	Token    string `json:"token"`
}

// UserClaims struct
type UserClaims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}

// UserResponse struct
type UserResponse struct {
	Username string `json:"username"`
}

// UserError struct
type UserError struct {
	Error string `json:"error"`
}

func main() {
	// load .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// connect to sqlite3 database
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// migrate the schema
	db.AutoMigrate(&UserModel{})

	// set the router as the default one shipped with Gin
	router := gin.Default()

	// set up CORS middleware options
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:8080", "http://localhost:3000"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE"}
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	router.Use(cors.New(config))

	router.POST("/register", Register(db))
	router.POST("/login", Login(db))

	// set up jwt middleware
	router.Use(JwtMiddleware())

	// set up routes
	router.GET("/user", User(db))
	router.GET("/users", Users(db))
	router.PUT("/user", Update(db))
	router.DELETE("/user", Delete(db))

	// start and run the server
	router.Run(":8080")
}

// Register function
func Register(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var user UserModel
		c.BindJSON(&user)

		// check if user exists
		var count int64
		db.Model(&UserModel{}).Where("username = ?", user.Username).Count(&count)
		if count > 0 {
			c.JSON(http.StatusConflict, UserError{Error: "User already exists"})
			return
		}

		// create user
		db.Create(&UserModel{Username: user.Username, Password: user.Password})
		c.JSON(http.StatusCreated, UserResponse{Username: user.Username})
	}
}

// Login function
func Login(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var userLogin UserLogin
		c.BindJSON(&userLogin)

		// check if user exists
		var user UserModel
		db.Where("username = ?", userLogin.Username).First(&user)
		if user.ID == 0 {
			c.JSON(http.StatusNotFound, UserError{Error: "User not found"})
			return
		}

		// check if password matches
		if user.Password != userLogin.Password {
			c.JSON(http.StatusUnauthorized, UserError{Error: "Password does not match"})
			return
		}

		// generate jwt token
		token, err := GenerateToken(user.Username)
		if err != nil {
			c.JSON(http.StatusInternalServerError, UserError{Error: "Error while generating token"})
			return
		}

		c.JSON(http.StatusOK, UserToken{Username: user.Username, Token: token})
	}
}

// User function
func User(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		claims := c.MustGet("claims").(*UserClaims)
		var user UserModel
		db.Where("username = ?", claims.Username).First(&user)
		if user.ID == 0 {
			c.JSON(http.StatusNotFound, UserError{Error: "User not found"})
			return
		}
		c.JSON(http.StatusOK, UserResponse{Username: user.Username})
	}
}

// Users function
func Users(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var users []UserModel
		db.Find(&users)
		c.JSON(http.StatusOK, users)
	}
}

// Update function
func Update(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		claims := c.MustGet("claims").(*UserClaims)
		var user UserModel
		db.Where("username = ?", claims.Username).First(&user)
		if user.ID == 0 {
			c.JSON(http.StatusNotFound, UserError{Error: "User not found"})
			return
		}
		c.BindJSON(&user)
		db.Save(&user)
		c.JSON(http.StatusOK, UserResponse{Username: user.Username})
	}
}

// Delete function
func Delete(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		claims := c.MustGet("claims").(*UserClaims)
		var user UserModel
		db.Where("username = ?", claims.Username).First(&user)
		if user.ID == 0 {
			c.JSON(http.StatusNotFound, UserError{Error: "User not found"})
			return
		}
		db.Delete(&user)
		c.JSON(http.StatusOK, gin.H{})
	}
}

// GenerateToken function
func GenerateToken(username string) (string, error) {
	claims := UserClaims{
		username,
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("SECRET")))
}

// JwtMiddleware function
func JwtMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")
		// Bearer token
		tokenString = tokenString[7:]
		token, err := jwt.ParseWithClaims(tokenString, &UserClaims{}, func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("SECRET")), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, UserError{Error: "Unauthorized"})
			c.Abort()
			return
		}

		claims := token.Claims.(*UserClaims)
		c.Set("claims", claims)
	}
}
