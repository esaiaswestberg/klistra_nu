package services

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"fmt"
	"math/big"
)

var adjectives = []string{
	"happy", "fast", "brave", "bright", "calm", "clever", "cool", "eager", "fancy", "gentle",
	"grand", "great", "kind", "lively", "lucky", "mighty", "nice", "noble", "proud", "quick",
	"quiet", "smart", "strong", "sweet", "tough", "wild", "wise", "young", "bold", "crisp",
	"funny", "jolly", "merry", "silly", "sunny", "vivid", "witty", "zesty", "lazy", "busy",
	"tiny", "huge", "soft", "loud", "magic", "epic", "super", "mega", "ultra", "hyper",
}

var nouns = []string{
	"ape", "bat", "bee", "bug", "cat", "cow", "crab", "crow", "dog", "dove", "duck", "eel",
	"elk", "fox", "frog", "goat", "hare", "hawk", "jay", "lamb", "lion", "mole", "moose",
	"mouse", "otter", "owl", "panda", "pig", "pony", "rabbit", "rat", "seal", "shark",
	"sheep", "snail", "snake", "swan", "tiger", "toad", "whale", "wolf", "zebra",
	"apple", "banana", "grape", "kiwi", "lemon", "lime", "mango", "melon", "olive", "orange",
	"book", "cup", "door", "bed", "phone", "shoe", "lamp", "clock", "key", "glass", "plate",
	"paris", "rome", "lima", "cairo", "osaka", "lagos", "milan", "perth", "tokyo", "seoul",
	"pizza", "donut", "taco", "sushi", "burger", "cookie", "muffin", "cactus", "rocket", "comet",
}

func GenerateID() (string, error) {
	for i := 0; i < 100; i++ {
		adjIdx, _ := rand.Int(rand.Reader, big.NewInt(int64(len(adjectives))))
		nounIdx, _ := rand.Int(rand.Reader, big.NewInt(int64(len(nouns))))
		
		suffix := make([]byte, 3)
		if _, err := rand.Read(suffix); err != nil {
			return "", err
		}
		
		id := fmt.Sprintf("%s-%s-%s", adjectives[adjIdx.Int64()], nouns[nounIdx.Int64()], hex.EncodeToString(suffix))

		var data string
		var expiresAt int64
		err := DB.QueryRow("SELECT data, expires_at FROM pastes WHERE id = ?", id).Scan(&data, &expiresAt)
		if err == sql.ErrNoRows {
			return id, nil
		}
	}

	// Fallback to purely random if words fail (unlikely)
	return fallbackGenerator(16)
}

func fallbackGenerator(length int) (string, error) {
	const charset = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	b := make([]byte, length)
	for i := range b {
		idx, err := rand.Int(rand.Reader, big.NewInt(int64(len(charset))))
		if err != nil {
			return "", err
		}
		b[i] = charset[idx.Int64()]
	}
	return string(b), nil
}
