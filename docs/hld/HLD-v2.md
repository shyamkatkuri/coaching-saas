# Coaching SaaS — High-Level Design V2

## Architecture Style

The application follows a hybrid architecture.

The core transactional business system begins as a NestJS modular monolith.

Capabilities that require independent scaling, different runtimes,
asynchronous processing, or independent deployment may be extracted
as services.

## Frontend

Angular is the primary authenticated enterprise application.

Next.js owns public, SEO-sensitive and server-rendered functionality.

Selected Angular domains will be implemented as Micro Frontends to learn
runtime federation and independent deployment.

Cross-framework composition will be explored separately through route
composition and Web Components.

## Backend

NestJS Core API is the initial business backend.

Primary modules:

- Tenant
- Identity
- Student
- Trainer
- Course
- Batch
- Enrollment
- Attendance
- Exam
- Fee

Future independent services:

- Audit Service
- Notification Service
- Python AI/Analytics Service
- Reporting Service

## API Styles

REST is the primary transactional API.

GraphQL is introduced for read aggregation, dashboards and flexible querying.

WebSockets are used only for real-time functionality.

Kafka is used for asynchronous integration events.

## Authentication

Keycloak provides identity.

OAuth 2.0 Authorization Code Flow with PKCE and OpenID Connect are used
for authentication.

JWT access tokens are validated by backend services.

Application authorization supports platform, tenant and branch scope.

## Databases

Existing logical databases remain unchanged.

tenant_db
user_db
student_db
course_db
trainer_db
batch_db

Additional domain databases may be added later.

Cross-database foreign keys are prohibited.

Each domain owns its data.

## Caching

Redis will be introduced for:

- caching
- distributed rate limiting
- distributed coordination
- idempotency
- temporary application state

The system must continue to operate where reasonable when Redis is
temporarily unavailable.

## Event Architecture

Domain changes may generate domain events.

Integration events are published using the Transactional Outbox Pattern.

Kafka consumers must be idempotent.

Retries and dead-letter handling are required for failed events.

## Scalability

Backend servers must remain stateless where possible.

Services can scale horizontally behind load balancers.

Database connection pools must be controlled to prevent connection
exhaustion.

High-read workloads may later use caching or read replicas.

## Observability

The platform will eventually provide:

- structured logging
- correlation IDs
- metrics
- distributed tracing
- health checks
- readiness checks
- liveness checks

OpenTelemetry will be used for tracing and telemetry standards.

## Deployment

Applications will be containerized using Docker.

CI/CD pipelines will execute:

lint
type checking
unit tests
integration tests
build
security checks
Docker image build
deployment

Dev deployments occur automatically after approved code is merged.

Production deployment strategy will support rollback and later
blue/green or canary deployment.