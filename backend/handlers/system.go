package handlers

import (
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

func (s *Server) GetLastPasteSession(c *gin.Context) {
	// Returns the paste ID from session if any
	session := sessions.Default(c)
	pasteID := session.Get("createdPaste")
	
	if pasteID != nil {
		id := pasteID.(string)
		c.JSON(http.StatusOK, gin.H{"id": id})
	} else {
		// Return 200 with empty ID or just empty object?
		// Spec says { id: string }.
		c.JSON(http.StatusOK, gin.H{"id": ""})
	}
}
