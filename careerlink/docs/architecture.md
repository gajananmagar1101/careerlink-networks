# CareerLink Architecture

CareerLink is a Spring Boot microservices academic project for secure talent acquisition and job application tracking.

## Services

| Service | Port | Responsibility |
| --- | ---: | --- |
| Eureka Server | 8761 | Service registry and dashboard |
| API Gateway | 8080 | JWT validation, trusted identity headers, service routing |
| Auth Service | 8081 | Registration, login, BCrypt hashing, JWT issuance |
| Profile Service | 8082 | Candidate and recruiter profiles |
| Job Service | 8083 | Job CRUD, search, filtering, indexes |
| Application Service | 8084 | Applications, duplicate prevention, status workflow |

## Request Flow

1. Clients authenticate through `/api/auth/login`.
2. Auth Service issues a signed JWT containing `userId`, `email`, `role`, `iat`, and `exp`.
3. Clients send `Authorization: Bearer <token>` to API Gateway.
4. Gateway validates the token, strips any client-supplied `X-User-*` headers, and forwards trusted identity headers.
5. Services enforce resource ownership and role rules using the trusted headers.

## Service Communication

Application Service uses OpenFeign with Eureka names:

- `@FeignClient(name = "job-service")` to verify job existence, status, deadline, and recruiter ownership.
- `@FeignClient(name = "profile-service")` to load candidate resume metadata when the apply request omits `resumeUrl`.

No service reads another service's MongoDB database directly.

## Data Boundaries

Each service owns its own MongoDB collections. MongoDB Atlas is supported through environment variables, usually `MONGODB_URI`, or service-specific URIs such as `AUTH_MONGODB_URI`.

Indexes:

- Auth: unique `email`.
- Profile: unique `userId` for candidate and recruiter profiles.
- Job: `recruiterId`, `status`, `location`, `category`, `skills`, `createdAt`.
- Application: unique compound index on `jobId + candidateId`.
