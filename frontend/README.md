# CareerLink Networks — Frontend

![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06b6d4?logo=tailwindcss&logoColor=white)

Enterprise Talent Acquisition & Job Application Tracking Portal.  
A modern hiring platform frontend for candidates to discover jobs and track applications, and for recruiters to manage postings and review candidates.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment config
cp .env.example .env

# 3. Start development server
npm run dev
```

The app runs at **http://localhost:5173**.

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8080` | API Gateway base URL |

Create a `.env` file from `.env.example`:

```
VITE_API_BASE_URL=http://localhost:8080
```

> The frontend communicates **only** with the API Gateway. It never connects directly to individual microservices or MongoDB.

---

## Backend Requirements

The frontend requires the CareerLink backend microservices:

| Service | Port | Purpose |
|---|---|---|
| Eureka Server | 8761 | Service discovery |
| API Gateway | 8080 | Single entry point for all API calls |
| Auth Service | 8081 | JWT authentication and user management |
| Profile Service | 8082 | Candidate and recruiter profile management |
| Job Service | 8083 | Job posting and search |
| Application Service | 8084 | Application submission and tracking |

**Start the backend** using Docker Compose from the `careerlink/` directory:

```bash
cd ../careerlink
docker-compose up -d
```

Or start each service individually with Maven/Spring Boot.

---

## Authentication Flow

1. User registers (`POST /api/auth/register`) or logs in (`POST /api/auth/login`)
2. Backend returns a JWT token in the `AuthResponse`
3. Token is stored in `localStorage` under `careerlink.token`
4. Axios request interceptor attaches `Authorization: Bearer <token>` to all protected requests
5. API Gateway validates the JWT and injects `X-User-Id`, `X-User-Email`, `X-User-Role` headers to downstream services
6. On `401 Unauthorized`, the token is cleared and the user is redirected to `/login`

**Roles**: `CANDIDATE` | `RECRUITER`

---

## Available Routes

### Public

| Route | Page |
|---|---|
| `/` | Landing page |
| `/jobs` | Public job search |
| `/login` | Sign in |
| `/register` | Create account |

### Candidate (requires `CANDIDATE` role)

| Route | Page |
|---|---|
| `/candidate/dashboard` | Dashboard with stats, recommended jobs, profile completion |
| `/candidate/jobs` | Job search with filters and pagination |
| `/candidate/jobs/:id` | Job details with apply modal |
| `/candidate/applications` | Application list with status badges |
| `/candidate/applications/:id` | Application detail with timeline |
| `/candidate/profile` | Profile editor with completion tracking |

### Recruiter (requires `RECRUITER` role)

| Route | Page |
|---|---|
| `/recruiter/dashboard` | Hiring overview with metrics |
| `/recruiter/jobs` | Posted jobs management |
| `/recruiter/jobs/new` | Create a new job posting |
| `/recruiter/jobs/:id` | Job details view |
| `/recruiter/jobs/:id/edit` | Edit an existing job |
| `/recruiter/jobs/:id/applications` | Review candidates and update statuses |
| `/recruiter/profile` | Company profile editor |

### Error Pages

| Route | Page |
|---|---|
| `/403` | Forbidden (wrong role) |
| `/500` | Server error |
| `*` | 404 Not Found |

---

## Commands

```bash
npm install       # Install dependencies
npm run dev       # Start dev server (port 5173)
npm run build     # Production build (tsc + vite build)
npm run preview   # Preview production build (port 4173)
npm run test      # Run Vitest test suite
npm run lint      # ESLint
```

---

## Production Build

```bash
npm run build
```

Output is written to `dist/`. Serve it with any static file server:

```bash
npm run preview
# or
npx serve dist
```

---

## Project Structure

```
src/
├── api/           # Axios client and API service modules
│   ├── apiClient.ts       # Axios instance, interceptors, unwrap utility
│   ├── authApi.ts         # /api/auth endpoints
│   ├── jobApi.ts          # /api/jobs endpoints
│   ├── profileApi.ts      # /api/profiles endpoints
│   └── applicationApi.ts  # /api/applications endpoints
├── components/    # Reusable UI components
│   ├── ui/        # Primitives (Button, Input, Modal, Badge, etc.)
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   ├── Footer.tsx
│   ├── JobCard.tsx
│   └── ApplicationCard.tsx
├── constants/     # Demo data and constants
├── context/       # Auth and Toast React contexts
├── hooks/         # Custom React Query hooks
├── layouts/       # AppLayout (dashboard) and PublicLayout
├── pages/         # Route-level page components
│   ├── auth/      # Login, Register
│   ├── candidate/ # Dashboard, jobs, applications, profile
│   ├── public/    # Landing page, public jobs
│   ├── recruiter/ # Dashboard, job management, applications
│   └── system/    # 404, 403, 500 error pages
├── routes/        # Route definitions and guards
├── styles/        # Global CSS with Tailwind
├── test/          # Test setup and test files
├── types/         # TypeScript type definitions
└── utils/         # Utility functions (format, splitTags)
```

---

## Tech Stack

- **React 18** — Component framework
- **TypeScript 5** — Type safety
- **Vite 5** — Build tool and dev server
- **Tailwind CSS 3** — Utility-first styling
- **TanStack React Query 5** — Server state management
- **React Hook Form 7** — Form handling
- **Zod 3** — Schema validation
- **Axios** — HTTP client
- **Lucide React** — Icon library
- **Vitest** — Test runner

---

## Live data and public access

Job listings and application records come from the API Gateway; there is no demo-data fallback. Loading, empty, and service-error states reflect the actual request outcome. The landing-page workflow preview is explicitly illustrative, not a live application.

The gateway currently requires authentication for job reads. Public pages show a sign-in prompt on HTTP 401; anonymous failures do not trigger a session logout. Authenticated 401s still clear the session. Search filters are preserved when signing in from public job search. The gateway access policy has not been changed.

Registration uses the existing auth API. Recruiters add company details in Company Profile after signing in. Social sign-in and password reset are not implemented.
