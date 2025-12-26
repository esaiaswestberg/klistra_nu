# Klistra.nu

**Klistra.nu** is a secure, encrypted, and ephemeral pastebin platform designed to share sensitive text with peace of mind. Built with a focus on privacy and security, it ensures that your data is encrypted before it even leaves your browser (transport encryption) and stored securely with AES-256-GCM encryption.

## ✨ Features

- **🔐 Strong Encryption:** All pastes are encrypted using `AES-256-GCM`.
- **🛡️ Password Protection:** Optional password protection for your pastes.
- **⏳ Automatic Expiry:** Set a validity period (from 1 minute to 1 week). Pastes are automatically deleted from Redis after expiry.
- **🌓 Dark & Light Mode:** A modern, responsive UI built with Tailwind CSS that adapts to your system preferences.
- **⚡ High Performance:** Powered by a lightweight PHP backend and Redis for lightning-fast ephemeral storage.
- **🕵️ Privacy First:** Minimal data retention. No database persistence beyond the specified expiry time.

## 🛠️ Technology Stack

- **Backend:** PHP 8.x
- **Database:** Redis 7.4 (used for ephemeral key-value storage)
- **Frontend:** HTML5, JavaScript (Vanilla), Tailwind CSS (via CDN)
- **Containerization:** Docker & Docker Compose

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/klistra_nu.git
    cd klistra_nu
    ```

2.  **Configure Environment Variables**
    Create a `.env` file from the example provided:
    ```bash
    cp .env.example .env
    ```
    
    Open `.env` in your favorite editor and configure the following:
    - `WEB_PORT`: The port to expose the web interface on (e.g., `8080`).
    - `ENCRYPTION_SALT`: **Critical.** A long, random string used for salt generation.
    - `REDIS_REQUIREPASS`: **Critical.** A strong password for your Redis instance.
    - `REDIS_STORAGE_PATH`: The local path where Redis will persist data (e.g., `./redis/data`).

3.  **Build and Run**
    Start the application using Docker Compose:
    ```bash
    docker-compose up -d --build
    ```

4.  **Access the Application**
    Open your browser and navigate to:
    `http://localhost:<WEB_PORT>` (e.g., `http://localhost:8080`)

## 📂 Project Structure

```
klistra_nu/
├── docker-compose.yml      # Main service orchestration
├── .env.example            # Environment variable template
├── php/
│   └── public/             # Web root
│       ├── api/            # Backend API endpoints (submit, read, etc.)
│       ├── components/     # UI components (header, footer, forms)
│       ├── include/        # Core logic (Encryption, Redis, IDs)
│       └── static/         # JS, CSS, and assets
└── dockerfiles/            # Docker build configurations
```

## 🔒 Security Architecture

Klistra.nu implements a multi-layered security approach:

1.  **Transport Layer:** Standard HTTPS (when deployed with a reverse proxy like Nginx/Traefik).
2.  **Application Layer:** 
    -   **Content Encryption:** Paste content is encrypted using `AES-256-GCM` with a key derived from the user's password (or a system-generated one) and the server-side salt.
    -   **Transport Encryption:** A custom encryption layer creates a secure tunnel for submission data, adding an extra layer of protection during transit.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request