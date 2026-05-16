# Node.js Prisma Project

A backend service built with Node.js, Express, Docker, and Prisma ORM.

## Project Structure
```text
├── .env                  # Local environment variables (ignored by git)
├── .env.example          # Template for environment variables
├── docker-compose.yml    # Docker configuration for local services
├── package.json          # Node.js dependencies and scripts
├── prisma/               # Prisma schema and database migrations
└── src/                  # Application source code
```

## Features
- **Prisma ORM**: Type-safe database client and migrations.
- **Docker Integration**: Easy local database setup using Docker Compose.
- **Environment Isolation**: Secure configuration tracking via `.env`.

## Getting Started

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd <project-folder>
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy the example file and update it with your local credentials:
```bash
cp .env.example .env
```

### 4. Spin up Database (Docker)
```bash
docker-compose up -d
```

### 5. Run Database Migrations
```bash
npx prisma migrate dev
```
