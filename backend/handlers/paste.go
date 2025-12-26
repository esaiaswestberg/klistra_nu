package handlers

import (
	"encoding/base64"
	"encoding/json"
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

	var encryptedFiles string
	if req.Files != nil && len(*req.Files) > 0 {
		filesJSON, err := json.Marshal(req.Files)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process files"})
			return
		}
		encryptedFiles, err = services.Encrypt(string(filesJSON), key)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "File encryption failed"})
			return
		}
	}

	timeoutUnix := time.Now().Add(time.Duration(req.Expiry) * time.Second).Unix()
	paste := models.Paste{
		ID:          id,
		Text:        encryptedText,
		Files:       encryptedFiles,
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

	// Return created paste object (as per new API spec)
	// We return the ID in the object, but text? 
	// Spec says returns Paste object. 
	// Should we return the clear text or null?
	// Usually POST returns the resource.
	// Let's return the metadata + ID. Text is optional/nullable.
	// Let's return what we have (we have clear text in req.PasteText).
	
	resp := api.Paste{
		Id:          &id,
		Protected:   &req.PassProtect,
		TimeoutUnix: &timeoutUnix,
		Text:        &req.PasteText, // Return clear text to confirm creation? Or null?
		Files:       req.Files,
	}
	// Actually, safer to not return text if we just encrypted it, 
	// but standard REST API returns the created resource.
	// The user just sent it, so they know it.
	
	c.JSON(http.StatusCreated, resp)
}

func (s *Server) GetPaste(c *gin.Context, id string, params api.GetPasteParams) {
	data, err := services.Get(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Paste not found"})
		return
	}

	var paste models.Paste
	json.Unmarshal([]byte(data), &paste)

	// Determine if we should attempt decryption
	pass := ""
	if params.XPastePassword != nil {
		pass = *params.XPastePassword
	}

	// If paste is protected and NO password provided -> Return Metadata (Locked)
	if paste.Protected && pass == "" {
		c.JSON(http.StatusOK, api.Paste{
			Id:          &paste.ID,
			Protected:   &paste.Protected,
			TimeoutUnix: &paste.TimeoutUnix,
			Text:        nil, // Locked
			Files:       nil,
		})
		return
	}

	// If paste is protected AND password provided -> Try Decrypt
	// OR If paste is NOT protected -> Use ID as password
	
	salt, _ := base64.StdEncoding.DecodeString(paste.Salt)
	passwordToUse := pass
	
	if !paste.Protected {
		passwordToUse = id
	}

	key := services.DeriveKey(passwordToUse, salt)
	decryptedText, err := services.Decrypt(paste.Text, key)
	if err != nil {
		// Decryption failed means password was wrong
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect password"})
		return
	}

	var files []api.File
	if paste.Files != "" {
		decryptedFilesJSON, err := services.Decrypt(paste.Files, key)
		if err == nil {
			_ = json.Unmarshal([]byte(decryptedFilesJSON), &files)
		}
	}

	// Success
	c.JSON(http.StatusOK, api.Paste{
		Id:          &paste.ID,
		Protected:   &paste.Protected,
		TimeoutUnix: &paste.TimeoutUnix,
		Text:        &decryptedText,
		Files:       &files,
	})
}