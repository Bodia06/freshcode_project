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
./start-dev.sh
```

### What does `start-dev.sh` do?

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

## 🛠 Bug fixed

- Bug with component loading
- Bug with payment and withdrawal of money
- Contest creation bug
- File upload bug
- Styles bug

## 📋 Frontend Tasks

### 1. "How It Works" Page Layout

- Replicated the layout of atom.com/how-it-works using a mobile-first approach.
- Implemented complex sections using CSS Grid and Flexbox for maximum flexibility.
- Ensured full responsiveness for mobile, tablet, and desktop views, including optimized image scaling.

### 2. Events Manager (Dynamic Branding)

- **Event Creation:** Dedicated `/events` page with a form to input event name, date, time, and a "reminder threshold."
- **Smart Sorting:** The list of active timers is automatically sorted, keeping the soonest events at the top.
- **Notification System:** A red notification badge appears in the navigation menu when a timer hits the user-defined alert threshold.
- **Performance:** Timers are built using custom hooks and ensure all intervals are cleared when components unmount.
- **Data Persistence:** All events are saved in `localStorage`, allowing data to persist after page reloads.

### 3. Custom ButtonGroup Component

- Developed a specialized UI component for the `/startContest/nameContest` route.
- Matched the exact styling and interactive states (hover/active) of the original Atom.com contest selection tool.

## 🟢 Node.js Backend Tasks

### 1. Error Logger System

- **Automated Logging:** Developed a custom logging utility that captures errors in a structured JSON format: `{message, time, code, stackTrace}`.
- **Stream Handling:** Implemented efficient file writing to ensure logs are appended without blocking the main event loop.

### 2. Daily Log Rotation & Transformation

- **Scheduled Tasks:** Integrated a cron-like scheduling mechanism to perform daily log backups at a specific time.
- **Data Transformation:** Implemented a transformation pipeline that processes raw logs into a compact format `{message, code, time}` before archiving.
- **Log Rotation Logic:** Automated the creation of timestamped archive files and synchronized the clearing of the primary log file to ensure continuous operation without data loss.

## 🔵 Fullstack & Database Integration

### 1. Moderation System (RBAC & Workflow)

- **Role-Based Access Control:** Implemented a dedicated Moderator role with restricted access. The Moderator can only access a specific dashboard to review, approve, or reject offers.
- **Offer Lifecycle:** Developed a "Pending" state for all new offers. Offers remain invisible to Customers until a Moderator grants approval, ensuring quality control.
- **Secure Permissions:** Enforced strict backend authorization—only users with the Moderator role can change offer statuses. Moderators are restricted from viewing Creative's private information.
- **Email Notifications:** Integrated an email service (Nodemailer/SendGrid) to automatically notify Creatives when their offers are approved or rejected.
- **Admin UI:** Created a responsive moderation table with Pagination to efficiently manage large volumes of data.

### 2. SQL Migration (Sequelize ORM)

- **Architecture Shift:** Successfully migrated the application's messaging system from a NoSQL structure to a Relational (SQL) Database.
- **ORM Implementation:** Defined complex Sequelize models and migrations based on a relational DB schema (handling Users, Conversations, and Messages).
- **Logic Refactoring:** Rewrote backend controllers and frontend services to maintain seamless chat functionality while switching the underlying database engine.
- **Data Integrity:** Ensured foreign key constraints and indexing were properly set up to maintain high-performance queries in the SQL environment.
