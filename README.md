# 🌐 CareerLink Networks

> **Enterprise Talent Acquisition & Job Application Tracking Portal**  
> A full-stack, microservices-powered recruitment ecosystem featuring a Spring Boot reactive/cloud backend and a modern React + TypeScript frontend.

---

[![Java](https://img.shields.io/badge/Java-17%2B-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Spring Cloud](https://img.shields.io/badge/Spring_Cloud-Eureka_%26_Gateway-6DB33F?style=for-the-badge&logo=spring&logoColor=white)](https://spring.io/projects/spring-cloud)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas_%26_Local-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

---

## 📑 Table of Contents
1. [System Architecture](#-system-architecture)
2. [Microservices & Port Allocation](#-microservices--port-allocation)
3. [Key Features](#-key-features)
4. [Prerequisites](#-prerequisites)
5. [Getting Started](#-getting-started)
   - [Option A: Running with Docker Compose](#option-a-running-with-docker-compose-recommended)
   - [Option B: Running Locally (Maven + Vite)](#option-b-running-locally-maven--vite)
6. [Environment Configuration](#-environment-configuration)
7. [API Endpoints & Swagger](#-api-endpoints--swagger)
8. [Testing](#-testing)
9. [Project Directory Structure](#-project-directory-structure)

---

## 🏛 System Architecture

CareerLink follows a distributed microservices architecture designed around Spring Cloud and modern front-end design principles:

```mermaid
graph TD
    Client["Client Browser (React 18 + Vite)"] -->|HTTP / REST (Port 5173)| Gateway["Spring Cloud API Gateway (Port 8080)"]
    Gateway -->|Service Discovery| Eureka["Eureka Discovery Server (Port 8761)"]
    
    Gateway -->|/api/auth/**| Auth["Auth Service (Port 8081)"]
    Gateway -->|/api/profiles/**| Profile["Profile Service (Port 8082)"]
    Gateway -->|/api/jobs/**| Job["Job Service (Port 8083)"]
    Gateway -->|/api/applications/**| App["Application Service (Port 8084)"]

    App -.->|FeignClient (Job Verification)| Job
    App -.->|FeignClient (Resume Metadata)| Profile

    Auth --- Mongo[(MongoDB / MongoDB Atlas)]
    Profile --- Mongo
    Job --- Mongo
    App --- Mongo
```

- **API Gateway (Single Entry Point)**: Validates incoming JWT tokens, strips spoofed headers, injects trusted headers (`X-User-Id`, `X-User-Email`, `X-User-Role`), and routes requests dynamically.
- **Service Discovery (Eureka)**: Coordinates all microservices, enabling flexible scaling and zero hardcoded internal IP addresses.
- **Database Layer**: Clean separation of collections in MongoDB (`users`, `candidate_profiles`, `recruiter_profiles`, `jobs`, `applications`).

---

## 🔌 Microservices & Port Allocation

| Service | Port | Description | Documentation / UI |
|---|---|---|---|
| **Frontend App** | `5173` | React 18 SPA (Vite + Tailwind CSS + TanStack Query) | `http://localhost:5173` |
| **API Gateway** | `8080` | Spring Cloud Gateway (Security, Routing, CORS) | Routes all `/api/**` |
| **Eureka Server** | `8761` | Service Registry & Health Dashboard | `http://localhost:8761` |
| **Auth Service** | `8081` | JWT Auth, Google Sign-In, Role RBAC, User APIs | `http://localhost:8081/swagger-ui.html` |
| **Profile Service** | `8082` | Candidate & Recruiter Profile Management | `http://localhost:8082/swagger-ui.html` |
| **Job Service** | `8083` | Job Posting, Search, Filtering, and Lifecycle | `http://localhost:8083/swagger-ui.html` |
| **Application Service** | `8084` | Job Applications & Candidate Review Pipeline | `http://localhost:8084/swagger-ui.html` |

---

## ✨ Key Features

### 👤 Job Seekers / Candidates
- **Job Discovery & Search**: Keyword search, filters by location, category, and employment type (Full-time, Part-time, Remote, Contract, Internship).
- **One-Click Application**: Apply with tailored cover letter and resume link; automatic profile sync ensures your recruiter sees your details immediately.
- **Application Tracking**: Real-time pipeline status tracking (`APPLIED`, `UNDER_REVIEW`, `SHORTLISTED`, `INTERVIEW`, `HIRED`, `REJECTED`).
- **Profile Portfolio**: Manage headline, skills, work experience, education, contact info, and resume URL.

### 🏢 Recruiters & Hiring Managers
- **Job Management**: Create, publish, edit, and close job postings.
- **Hiring Inbox & Pipeline**: Overview of all candidate applications across all posted roles.
- **Candidate Review Drawer**: In-depth review modal showing candidate profile, skills, education, experience, cover letter, and resume view/download.
- **Pipeline Actions**: Update status instantly (Shortlist, Invite to Interview, Hire, or Reject).

### 🔐 Security & Authentication
- **Dual Sign-In**: Standard Email + Password and seamless **"Continue with Google"** OAuth 2.0.
- **Role-Based Access Control**: Strict candidate vs. recruiter permission enforcement at both Gateway and microservice levels.
- **Token Security**: Stateless JWTs with HMAC SHA-256 signing, header sanitization, and CORS protections.

---

## 🛠 Prerequisites

- **Java Development Kit (JDK)**: Version 17 or higher
- **Build Tool**: Maven 3.9+
- **Node.js**: Version 18+ (Node 20+ recommended) and `npm`
- **Database**: MongoDB instance (local or MongoDB Atlas connection URI)
- **Containerization (Optional)**: Docker & Docker Compose

---

## 🚀 Getting Started

### Option A: Running with Docker Compose (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/gajananmagar1101/careerlink-networks.git
   cd careerlink-networks
   ```

2. Configure environment variables for the backend:
   ```bash
   cp careerlink/.env.example careerlink/.env
   # Edit careerlink/.env with your MongoDB URI and random 32+ char JWT secret
   ```

3. Configure environment variables for the frontend:
   ```bash
   cp frontend/.env.example frontend/.env
   ```

4. Build and run all microservices:
   ```bash
   cd careerlink
   docker compose --env-file .env up --build
   ```

5. In another terminal, run the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

6. Open your browser at **`http://localhost:5173`**.

---

### Option B: Running Locally (Maven + Vite)

#### 1. Backend Microservices

```bash
cd careerlink

# Set environment variables (or put them in careerlink/.env)
export MONGODB_URI="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/careerlink?retryWrites=true&w=majority"
export JWT_SECRET="your-32-characters-minimum-jwt-secret-key-here"

# Start services (recommended order: Eureka -> Microservices -> Gateway)
mvn -pl eureka-server spring-boot:run
mvn -pl auth-service spring-boot:run
mvn -pl profile-service spring-boot:run
mvn -pl job-service spring-boot:run
mvn -pl application-service spring-boot:run
mvn -pl api-gateway spring-boot:run
```

> *Tip: You can also use the helper script `careerlink/scripts/start-local.sh` to start all services locally.*

#### 2. Frontend Web Application

```bash
cd frontend

# Install packages
npm install

# Start development server
npm run dev
```

---

## ⚙️ Environment Configuration

### Backend (`careerlink/.env`)
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/careerlink?retryWrites=true&w=majority
JWT_SECRET=your-random-32-plus-character-secret-key-string
JWT_EXPIRATION=86400000
GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com

AUTH_SERVICE_PORT=8081
PROFILE_SERVICE_PORT=8082
JOB_SERVICE_PORT=8083
APPLICATION_SERVICE_PORT=8084
GATEWAY_PORT=8080
EUREKA_PORT=8761

CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:4200
EUREKA_DEFAULT_ZONE=http://eureka-server:8761/eureka/
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
```

---

## 📡 API Endpoints & Swagger

Interactive Swagger UI documentation is available for each individual service when running locally:

- **Auth Service**: `http://localhost:8081/swagger-ui.html`
- **Profile Service**: `http://localhost:8082/swagger-ui.html`
- **Job Service**: `http://localhost:8083/swagger-ui.html`
- **Application Service**: `http://localhost:8084/swagger-ui.html`

### Primary Gateway API Routes (`http://localhost:8080`):
- `POST /api/auth/register` — Register Candidate or Recruiter
- `POST /api/auth/login` — Authenticate and receive JWT
- `POST /api/auth/google` — Authenticate via Google ID Token
- `GET /api/auth/users/{id}` — Lookup user summary
- `GET /api/jobs` — Browse and filter published jobs
- `POST /api/jobs` — Recruiter creates a job posting
- `GET /api/profiles/candidate/{userId}` — Fetch candidate profile
- `POST /api/applications` — Submit job application
- `GET /api/applications/job/{jobId}` — Recruiter candidate pipeline
- `PUT /api/applications/{id}/status` — Move candidate through hiring stages

---

## 🧪 Testing

### Backend Unit & Integration Tests
```bash
cd careerlink
mvn clean test
```

### Frontend Tests & Type Checking
```bash
cd frontend
# Run tests
npm test

# Production build validation
npm run build
```

---

## 📂 Project Directory Structure

```text
careerlink-networks/
├── .gitignore                     # Root gitignore protecting env & secrets
├── README.md                      # Project master documentation
├── careerlink/                    # Backend microservices root
│   ├── api-gateway/               # Spring Cloud Gateway
│   ├── auth-service/              # Authentication & User Management
│   ├── profile-service/           # Candidate & Recruiter Profiles
│   ├── job-service/               # Job Listings & Search
│   ├── application-service/       # Applications & Status Pipeline
│   ├── eureka-server/             # Eureka Service Registry
│   ├── docker-compose.yml         # Containerized cluster setup
│   ├── .env.example               # Backend environment template
│   └── pom.xml                    # Root Maven multi-module POM
└── frontend/                      # React frontend application
    ├── src/
    │   ├── api/                   # Axios API clients
    │   ├── components/            # UI & feature components
    │   ├── context/               # Auth & Toast React contexts
    │   ├── hooks/                 # React Query custom hooks
    │   ├── layouts/               # Public & Dashboard layouts
    │   ├── pages/                 # Candidate, Recruiter & Auth pages
    │   └── types/                 # TypeScript domain interfaces
    ├── .env.example               # Frontend environment template
    ├── package.json               # Frontend dependencies & scripts
    └── vite.config.ts             # Vite configuration
```

---

## 👥 Contributors

- **CareerLink Networks Team**
- GitHub: [@gajananmagar1101](https://github.com/gajananmagar1101)
