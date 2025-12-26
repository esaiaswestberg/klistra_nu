package handlers

import (
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

func (s *Server) GetSession(c *gin.Context) {
	// Returns the paste ID from session if any
	session := sessions.Default(c)
	pasteID := session.Get("createdPaste")
	if pasteID != nil {
		c.String(http.StatusOK, pasteID.(string))
	} else {
		// Return empty or 404? PHP returned string (empty or id)
		c.String(http.StatusOK, "")
	}
}