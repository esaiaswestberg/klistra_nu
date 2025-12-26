# Klistra.nu

**Klistra.nu** is a secure, encrypted, and ephemeral pastebin platform designed to share sensitive text with peace of mind. Built with a focus on privacy and security, it ensures that your data is encrypted and stored securely.

## ✨ Features

- **🔐 Strong Encryption:** Text pastes are encrypted using `XChaCha20-Poly1305`.
- **📁 Multi-File Support:** Securely share multiple files alongside your text.
- **🛡️ Client-Side File Encryption:** Files are encrypted in your browser using `AES-256-GCM` before upload, ensuring zero-knowledge storage.
- **⚛️ Post-Quantum Ready:** Uses 256-bit symmetric keys and memory-hard key derivation to stay secure in the quantum era.
- **🛡️ Password Protection:** Optional password protection for your pastes.
- **⏳ Automatic Expiry:** Set a validity period (from 1 minute to 1 week). Pastes are automatically deleted after expiry.
- **🌓 Dark & Light Mode:** A modern, responsive UI built with React and Tailwind CSS.
- **⚡ High Performance:** Powered by a Go backend and SQLite for efficient storage.

## 🛠️ Technology Stack

- **Backend:** Go (Golang) 1.25+ with Gin framework
- **Database:** SQLite
- **Frontend:** React, Vite, Tailwind CSS, Web Crypto API
- **Containerization:** Docker & Docker Compose

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Bun](https://bun.sh/) (for frontend development)
- [Go](https://go.dev/) (for backend development)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/esaiaswestberg/klistra_nu.git
    cd klistra_nu
    ```

2.  **Generate API Types**
    ```bash
    ./generate.sh
    ```

3.  **Configure Environment Variables**
    Create a `.env` file from the example provided:
    ```bash
    cp .env.example .env
    ```

4.  **Build and Run**
    Start the application using Docker Compose (Development):
    ```bash
    docker-compose -f docker-compose.dev.yml up --build
    ```

5.  **Access the Application**
    Open your browser and navigate to:
    `http://localhost:8080` (or the port specified in your `.env`)

## 📂 Project Structure

```
klistra_nu/
├── generate.sh             # API code generation script
├── openapi.yaml            # API specification
├── backend/                # Go Backend
│   ├── api/                # Generated API types
│   ├── handlers/           # HTTP Handlers
│   ├── models/             # Data Models
│   ├── services/           # Core Logic (Encryption, DB)
│   └── main.go             # Application entry point
├── frontend/               # React Frontend
│   ├── src/                # Source code
│   │   ├── api-types.ts    # Generated TS types
│   │   ├── lib/crypto.ts   # Client-side encryption logic
│   └── vite.config.ts      # Vite Configuration
└── Dockerfile              # Multi-stage Docker build
```

## 🔒 Security Architecture

Klistra.nu implements a multi-layered, zero-knowledge security approach:

1.  **Transport Layer:** Standard HTTPS.
2.  **Application Layer (Text):** 
    -   **Content Encryption:** Paste content is encrypted using `XChaCha20-Poly1305`.
    -   **Key Derivation:** Keys are derived using `Argon2id` with a unique, random salt generated for every paste.
3.  **Client-Side Layer (Files):**
    -   **File Encryption:** Files are encrypted locally in the browser using `AES-256-GCM` before being sent to the server.
    -   **Zero-Knowledge:** The server and file storage provider never see the raw file content or the file decryption keys.
4.  **Quantum Resistance:**
    -   By using 256-bit symmetric keys, Klistra.nu is resistant to Grover's algorithm, maintaining 128-bit security even against future quantum computers.

## 🔌 API Reference

The Klistra.nu API is fully documented using the OpenAPI Specification. You can find the complete definition in the [openapi.yaml](./openapi.yaml) file.

For development, you can use the `generate.sh` script to regenerate client and server types from this specification.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
