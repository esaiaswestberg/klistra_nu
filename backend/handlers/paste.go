package handlers

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/esaiaswestberg/klistra-go/api"
	"github.com/esaiaswestberg/klistra-go/models"
	"github.com/esaiaswestberg/klistra-go/services"
)

func (s *Server) CreatePaste(c *gin.Context) {
	var req api.CreatePasteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Logic
	id, err := services.GenerateID()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate ID"})
		return
	}

	// Encrypt Paste
	salt, err := services.GenerateSalt()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Salt generation failed"})
		return
	}
	saltBase64 := base64.StdEncoding.EncodeToString(salt)

	passwordToUse := ""
	if req.Pass != nil {
		passwordToUse = *req.Pass
	}
	if !req.PassProtect {
		passwordToUse = id
	}

	key := services.DeriveKey(passwordToUse, salt)
	encryptedText, err := services.Encrypt(req.PasteText, key)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Encryption failed"})
		return
	}

	timeoutUnix := time.Now().Add(time.Duration(req.Expiry) * time.Second).Unix()
	paste := models.Paste{
		ID:          id,
		Text:        encryptedText,
		Protected:   req.PassProtect,
		TimeoutUnix: timeoutUnix,
		Salt:        saltBase64,
	}
	
	pasteJSON, _ := json.Marshal(paste)
	
	err = services.Set(id, string(pasteJSON), time.Duration(req.Expiry)*time.Second)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// Set Session
	session := sessions.Default(c)
	session.Set("createdPaste", id)
	session.Save()

	c.String(http.StatusCreated, id)
}

func (s *Server) GetPaste(c *gin.Context) {
	var req api.GetPasteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	data, err := services.Get(req.Id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Paste not found"})
		return
	}

	var paste models.Paste
	json.Unmarshal([]byte(data), &paste)

	// Decrypt
	salt, _ := base64.StdEncoding.DecodeString(paste.Salt)
	
	pass := ""
	if req.Pass != nil {
		pass = *req.Pass
	}

	passwordToUse := pass
	// If protected and no pass provided?
	if paste.Protected && pass == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Password required"})
		return
	}
	if !paste.Protected {
		passwordToUse = req.Id
	}

	key := services.DeriveKey(passwordToUse, salt)
	decryptedText, err := services.Decrypt(paste.Text, key)
	if err != nil {
		fmt.Println("Decryption failed:", err)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect password"})
		return
	}

	response := api.Paste{
		Id:          &paste.ID,
		TimeoutUnix: &paste.TimeoutUnix, // api.gen.go uses *int64? let's check
		Protected:   &paste.Protected,
		Text:        &decryptedText,
	}
	// Need to verify api.Paste struct fields types from api.gen.go
	// api.gen.go:
	// type Paste struct {
    //    Id          *string `json:"id,omitempty"`
    //    Protected   *bool   `json:"protected,omitempty"`
    //    Text        *string `json:"text,omitempty"`
    //    TimeoutUnix *int64  `json:"timeoutUnix,omitempty"`
    // }
	// So pointers are correct.

	c.JSON(http.StatusOK, response)
}

func (s *Server) GetPasteStatus(c *gin.Context) {
	var req struct {
		ID string `json:"id"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
    // Wait, generated code might expect specific body for Status?
	// openapi.yaml:
	// /status: post requestBody schema: { properties: { id: string } }
	// generated: type GetPasteStatusJSONBody struct { Id *string `json:"id,omitempty"` }
	// But RegisterHandlersWithOptions calls wrapper.GetPasteStatus.
	// wrapper calls s.GetPasteStatus(c).
	// So I handle binding.
	
	// Let's use a struct matching the schema manually or define it.
	// OAPI Codegen doesn't generate named struct for inline schema requestBody unless configured?
	// It likely generated GetPasteStatusJSONBody.
	
	// Let's check api.gen.go for GetPasteStatusJSONBody.
	
	// Assuming simple bind works.
	
	data, err := services.Get(req.ID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Paste not found"})
		return
	}

	var paste models.Paste
	json.Unmarshal([]byte(data), &paste)

	c.JSON(http.StatusOK, gin.H{
		"id":        paste.ID,
		"protected": paste.Protected,
	})
}
