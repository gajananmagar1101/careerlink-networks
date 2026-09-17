# PS015: Enterprise Talent Acquisition & Job Application Tracking Portal

CareerLink Networks is a production-style Spring Boot microservices backend for candidate profiles, recruiter job posts, job applications, JWT authentication, Eureka discovery, and gateway routing.

## Stack

Java 17, Spring Boot 3.x, Spring Cloud, Spring Security, JWT, MongoDB/MongoDB Atlas, OpenFeign, Eureka, Spring Cloud Gateway, Maven, Lombok, Bean Validation, Actuator, Springdoc OpenAPI, JUnit 5, Mockito, Docker Compose.

## Services And Ports

| Service | Default port | Swagger |
| --- | ---: | --- |
| Eureka Server | 8761 | Dashboard: `http://localhost:8761` |
| API Gateway | 8080 | Gateway routes APIs |
| Auth Service | 8081 | `http://localhost:8081/swagger-ui.html` |
| Profile Service | 8082 | `http://localhost:8082/swagger-ui.html` |
| Job Service | 8083 | `http://localhost:8083/swagger-ui.html` |
| Application Service | 8084 | `http://localhost:8084/swagger-ui.html` |

## MongoDB Atlas Setup

Create a MongoDB Atlas cluster, obtain the connection string, and place it in the `.env` file as `MONGODB_URI`. Never commit `.env` to Git.

1. Copy `.env.example` to `.env`.
2. Paste your private Atlas connection string:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/careerlink?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-long-random-secret-at-least-32-chars
JWT_EXPIRATION=86400000
```

Service-specific URI overrides are also supported: `AUTH_MONGODB_URI`, `PROFILE_MONGODB_URI`, `JOB_MONGODB_URI`, and `APPLICATION_MONGODB_URI`.

## Run Locally With Maven

Install Java 17+ and Maven 3.9+.

```bash
cd careerlink
export JWT_SECRET='replace-with-a-long-random-secret-at-least-32-chars'
export MONGODB_URI='mongodb+srv://<username>:<password>@<cluster-url>/careerlink?retryWrites=true&w=majority'
mvn clean test
mvn -pl eureka-server spring-boot:run
mvn -pl auth-service spring-boot:run
mvn -pl profile-service spring-boot:run
mvn -pl job-service spring-boot:run
mvn -pl application-service spring-boot:run
mvn -pl api-gateway spring-boot:run
```

Start Eureka first, then the services, then the gateway.

## Run With Docker Compose

```bash
cd careerlink
cp .env.example .env
docker compose --env-file .env up --build
```

## API Endpoints

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/validate`
- `GET /api/auth/me`

Profiles:

- `POST /api/profiles/candidate`
- `GET /api/profiles/candidate/{userId}`
- `PUT /api/profiles/candidate/{userId}`
- `POST /api/profiles/recruiter`
- `GET /api/profiles/recruiter/{userId}`
- `PUT /api/profiles/recruiter/{userId}`

Jobs:

- `POST /api/jobs`
- `GET /api/jobs?page=0&size=10&sort=createdAt,desc`
- `GET /api/jobs/{jobId}`
- `PUT /api/jobs/{jobId}`
- `DELETE /api/jobs/{jobId}`
- `GET /api/jobs/recruiter/{recruiterId}`
- `GET /api/jobs/search?keyword=Java&location=Pune&category=Software&employmentType=FULL_TIME`

Applications:

- `POST /api/applications`
- `GET /api/applications/{applicationId}`
- `GET /api/applications/candidate/{candidateId}`
- `GET /api/applications/job/{jobId}`
- `PUT /api/applications/{applicationId}/status`
- `DELETE /api/applications/{applicationId}`

## Authentication Flow

Users register as `CANDIDATE` or `RECRUITER`. Passwords are stored with BCrypt. Login returns a JWT containing `userId`, `email`, `role`, issued time, and expiration. The client sends `Authorization: Bearer <JWT>` to the API Gateway. The gateway validates the token, removes untrusted incoming identity headers, adds trusted `X-User-Id`, `X-User-Email`, and `X-User-Role`, then routes to services.

## Example Requests

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Rahul Patil","email":"rahul@example.com","password":"Password@123","role":"CANDIDATE"}'
```

```bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"rahul@example.com","password":"Password@123"}' | jq -r '.data.token')
```

```bash
curl -X GET "http://localhost:8080/api/jobs/search?keyword=Java&page=0&size=10&sort=createdAt,desc" \
  -H "Authorization: Bearer $TOKEN"
```

Recruiter job creation:

```bash
curl -X POST http://localhost:8080/api/jobs \
  -H "Authorization: Bearer $RECRUITER_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"title":"Java Backend Developer","description":"Looking for a Java Spring Boot developer","location":"Pune","employmentType":"FULL_TIME","experienceRequired":2,"salaryMin":500000,"salaryMax":900000,"skills":["Java","Spring Boot","MongoDB"],"category":"Software Development","companyName":"CareerLink Networks","applicationDeadline":"2026-10-30"}'
```

Candidate apply:

```bash
curl -X POST http://localhost:8080/api/applications \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"jobId":"<jobId>","coverLetter":"I am interested in this position."}'
```

## Design Notes

- API Gateway protects all routes except registration and login.
- Downstream services use trusted gateway headers for authorization decisions.
- Eureka and `lb://SERVICE-NAME` enable discovery and client-side load balancing.
- Application Service uses OpenFeign instead of database sharing.
- MongoDB credentials and JWT secrets are read only from environment variables.
- Standard error responses include timestamp, status, error, message, and path.
- Success responses use `success`, `message`, `data`, and `timestamp`.

## Indexing Strategy

Unique indexes prevent duplicate user emails, duplicate profile ownership, and duplicate applications for the same `jobId + candidateId`. Job search fields are indexed for common recruiter and candidate access paths: recruiter-owned listings, open listings, location/category filtering, skill matching, and newest-first sorting.

## Tests

```bash
mvn test
mvn -pl auth-service test
mvn -pl job-service test
mvn -pl application-service test
```

Current tests cover registration, duplicate email checks, login, invalid password, profile ownership, recruiter/candidate job authorization, duplicate applications, closed jobs, and application visibility rules.

## VS Code Setup

Recommended extensions are listed in `.vscode/extensions.json`: Extension Pack for Java, Spring Boot tools, Maven, and Docker.

Debugging:

1. Open the `careerlink` folder in VS Code.
2. Load Maven projects from the root `pom.xml`.
3. Create a `.env` file from `.env.example`.
4. Run each Spring Boot application class, starting with `EurekaServerApplication`.

## Troubleshooting

- `JWT_SECRET must be at least 32 characters`: update `.env`.
- Services do not appear in Eureka: confirm `EUREKA_DEFAULT_ZONE` and start Eureka first.
- Mongo authentication fails: URL-encode special characters in the Atlas password.
- Gateway returns `401`: send `Authorization: Bearer <token>`.
- Gateway returns `403`: the token role does not own or cannot perform that action.
