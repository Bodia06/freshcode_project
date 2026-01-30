# 🚀 Payment App (Fullstack Docker Project)

This project is a **full-featured fullstack application** with a React frontend, a Node.js backend, and two databases (**PostgreSQL** and **MongoDB**).

The entire setup and deployment process is fully automated using **Docker** and **Bash scripts**, providing a smooth and developer-friendly experience.

---

## 🛠 Technology Stack

### Frontend

- React (Vite)
- Formik
- Redux Toolkit

### Backend

- Node.js
- Sequelize ORM

### Databases

- PostgreSQL (Relational Database)
- MongoDB (NoSQL Database)

### DevOps

- Docker
- Docker Compose
- Bash Scripting

---

## 🏗 Architecture

The application runs in a **multi-container architecture** defined in `docker-compose-dev.yaml`:

1. **front-react** — Client application  
   Port: `5001`

2. **server-dev** — API server  
   Port: `3000`

3. **db-dev** — PostgreSQL database  
   Port: `12346`

4. **mongo-dev** — MongoDB database  
   Port: `12345`

---

## 🚀 Getting Started

The fastest way to run the project is by using the provided automation script, which builds images, starts containers, and prepares the databases automatically.

### Prerequisites

Make sure you have the following installed on your machine:

- **Docker**
- **Docker Compose**

---

### Clone & Run

1. Open a terminal in the project root directory
2. Grant execution permissions and run the script:

```bash
chmod +x ./start.sh
./start.sh
```

### What does `start.sh` do?

- 🏗 **Build** — Builds Docker images for frontend and backend
- 🔝 **Up** — Starts all services in detached mode
- ⏳ **Wait** — Waits 5 seconds for the databases to be ready
- 🔄 **Migrations** — Automatically creates all PostgreSQL tables
- 🌱 **Seeds** — Populates the databases with test data (users and cards)

## 🔗 Service Access

Access running services after successful startup

| Service       | URL                   |
| ------------- | --------------------- |
| 🌐 Frontend   | http://localhost:5001 |
| ⚙️ API Server | http://localhost:3000 |

## 🌱 Seed Data (Immediate Access)

After startup, you can immediately use the preconfigured accounts and bank cards for testing.

### 👤 Users

| Role      | Email              | Password |
| --------- | ------------------ | -------- |
| CUSTOMER  | buyer@gmail.com    | 123456   |
| CREATOR   | creative@gmail.com | 123456   |
| MODERATOR | moder@gmail.com    | 123456   |

---

### 💳 Bank Cards

**Card 1**

- Number: `4564 6545 6456 4564`
- Name: `SquadHelp`
- Expiry: `11/26`
- CVC: `453`

**Card 2**

- Number: `4111 1111 1111 1111`
- Name: `yriy`
- Expiry: `09/26`
- CVC: `505`
- Balance: `$5000`

## 🛠 Useful Commands

Stop all services:

```bash
docker compose -f docker-compose-dev.yaml down
docker compose -f docker-compose-dev.yaml logs -f server-dev
docker compose -f docker-compose-dev.yaml up -d --build
```
