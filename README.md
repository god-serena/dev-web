## 🛠️ Project Architecture

*   **`/backend`**: Python service (FastAPI) providing the API, managing data models, and serving static media.
*   **`/frontend`**: Visitor-facing resume website built with React, Vite, and TailwindCSS.
*   **`/admin`**: Admin dashboard to manage resume content, experiences, projects, and skills.

---

## 🐳 How to Run & Test Locally with Docker

You can run the entire stack locally in a single command using Docker Compose.

### Prerequisites
*   [Docker](https://docs.docker.com/get-docker/) installed.

### 1. Build and Start the Services
Run the following command in the root directory:
```bash
docker compose up --build
```

### 2. Access the Application Services
Once all containers are running successfully, you can access them at the following addresses:

| Service | Local Address |
| :--- | :--- |
| **Visitor Frontend** | [http://localhost:3000](http://localhost:3000) |
| **Admin Dashboard** | [http://localhost:3001](http://localhost:3001) |

### 3. Log In to Admin Panel
*   **Username / Admin Password**: (Configure via environment variables. Default setup uses the credentials defined in the compose file: `admin123`).

### 4. Stop the Containers
To stop the services and clean up running containers:
```bash
docker compose down
```
If you also want to delete the local PostgreSQL volume data:
```bash
docker compose down -v
```
