# OmniSync_Test

## 🚀 Running Locally
1. Clone the repo:
   ```bash
   git clone <repo-url>
   cd OmniSync_Test

2. Build and run with Docker
docker compose up --build

Access services:

Frontend → http://localhost:5173

Backend → http://localhost:5000

Database → localhost:5432

📝 Notes

Familiar/Easy: Frontend (React/TypeScript) — I began by creating a design of what I wanted and worked from there to style the UI.
     - see design image in omnisync_ts_app/public

New/Challenging: Docker setup and multi-service configuration were the hardest part because it was my first time orchestrating multiple containers (frontend, backend, database) and getting them to communicate properly. Learning how to structure docker-compose.yml, handle build contexts, and fix path/port mismatches took extra time and troubleshooting.

Design Decisions:

Used Docker Compose to connect frontend, backend, and database while keeping them isolated.

Chose serve to preview the production frontend build instead of running the dev server.

Added init.sql for automatic Postgres database seeding.