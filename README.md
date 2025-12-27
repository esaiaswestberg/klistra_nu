# Klistra.nu

**Klistra.nu** is a secure, encrypted, and ephemeral sharing platform designed to share sensitive text with peace of mind. Built with a focus on privacy and security, it ensures that your data is encrypted and stored securely.

## ✨ Features

- **🔐 Strong Encryption:** Text pastes are encrypted using `AES-256-GCM`.
- **📁 Multi-File Support:** Securely share multiple files alongside your text.
- **🛡️ Client-Side File Encryption:** Files are encrypted in your browser using `AES-256-GCM` before upload, ensuring zero-knowledge storage.
- **⚛️ Post-Quantum Ready:** Uses 256-bit symmetric keys and memory-hard key derivation to stay secure in the quantum era.
- **🛡️ Password Protection:** Optional password protection for your pastes.
- **⏳ Automatic Expiry:** Set a validity period (from 1 minute to 1 month). Pastes are automatically deleted after expiry.
- **🛡️ Rate Limiting:** Built-in protection against brute-force and DoS attacks.
- **🔐 Secure IDs:** High-entropy, human-readable identifiers that are resistant to discovery by guessing.
- **🌓 Dark & Light Mode:** A modern, responsive UI built with React and Tailwind CSS.
- **⚡ High Performance:** Powered by a Go backend and SQLite for efficient storage.
- **🛠️ Easy Customization:** Support for custom `<head>` injection and external static files (for SEO verification).

## 🚀 Deployment

### Docker (Recommended)

Klistra.nu is designed to be easily deployed using Docker.

#### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_PATH` | Path to the SQLite database file | `klistra.db` |
| `SESSION_SECRET` | Secret key for session encryption | `default-secret` |
| `CUSTOM_HEAD_HTML` | Custom HTML to inject into the `<head>` section (e.g., for analytics) | - |
| `EXTERNAL_STATIC_DIR` | Directory to serve extra static files from (e.g., for Google verification) | `/app/static` |
| `GIN_MODE` | Gin framework mode (`debug` or `release`) | `debug` |
| `RATE_LIMIT_GENERAL` | Max requests per minute for general API endpoints | `60` |
| `RATE_LIMIT_CREATE` | Max requests per minute for paste creation | `5` |

#### Customization Example

To verify your site with Google Search Console or add analytics:

1.  **Static Files:** Mount a volume to `/app/static` containing your verification files.
2.  **Custom Scripts:** Set the `CUSTOM_HEAD_HTML` variable with your tracking scripts.

```yaml
services:
  web:
    image: ghcr.io/esaiaswestberg/klistra_nu:latest
    environment:
      - CUSTOM_HEAD_HTML=<script defer src="https://analytics.example.com/script.js"></script>
    volumes:
      - ./my-static-files:/app/static
```

## 🔒 Security Architecture

Klistra.nu implements a multi-layered security approach:

1.  **Transport Layer:** Standard HTTPS.
2.  **Client-Side Encryption (Text & Files):** 
    -   All encryption happens locally in the browser using the **Web Crypto API**.
    -   **Algorithm:** `AES-256-GCM`.
3.  **Key Management:**
    -   **Password Protected (Zero-Knowledge):** Keys are derived from your password using **Argon2id** (WASM). Only a non-reversible access hash is sent to the server for authentication. The server never sees your password or the decryption key.
    -   **Public Link:** For unprotected pastes, a random master key is generated client-side and stored encrypted on the server. The server returns this key alongside the data when the link is accessed.
4.  **Quantum Resistance:**
    -   By using 256-bit symmetric keys, Klistra.nu is resistant to Grover's algorithm, maintaining 128-bit security even against future quantum computers.
5.  **Server Blindness (Protected Pastes):**
    -   For password-protected pastes, the server and storage provider never see raw text, file content, decryption keys, or your password.
6.  **Server-Side Protection:**
    -   **Rate Limiting:** Protects against automated brute-force attacks on paste IDs and resource exhaustion.
    -   **High-Entropy IDs:** Uses `crypto/rand` to generate IDs with a large search space, preventing "iteration" or "crawling" attacks.
    -   **Session Hardening:** Cookies use `HttpOnly`, `Secure`, and `SameSite: Strict` flags to prevent XSS-based hijacking and CSRF.
    -   **Input Validation:** Strict limits on request sizes (10MB) and expiry durations are enforced at the API level.
    -   **Path Traversal Protection:** Static file serving is jailed to specific directories with secure path resolution.

## 🔌 API Reference

The Klistra.nu API is fully documented using the OpenAPI Specification. You can find the complete definition in the [openapi.yaml](./openapi.yaml) file.

For development, you can use the `generate.sh` script to regenerate client and server types from this specification.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
