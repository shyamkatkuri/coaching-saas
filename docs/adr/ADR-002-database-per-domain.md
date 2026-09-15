# ADR-002: Preserve Database-per-Domain Architecture

## Status

Accepted

## Context

The application already contains independent logical databases:

tenant_db
user_db
student_db
course_db
trainer_db
batch_db

These databases already represent useful domain ownership boundaries.

## Decision

The existing database architecture will be preserved.

The NestJS modular monolith may connect to several logical databases,
but every module may access only the database that it owns.

## Example

Tenant Module -> tenant_db

Identity Module -> user_db

Student Module -> student_db

Course Module -> course_db

Trainer Module -> trainer_db

Batch Module -> batch_db

## Rules

No direct cross-database joins.

No cross-database foreign keys.

A module must not query another module's database directly.

Cross-domain interaction must go through an application abstraction,
service contract or event.

## Benefits

Strong ownership boundaries.

Simpler future microservice extraction.

Reduced schema coupling.

Existing database work does not need migration.

## Disadvantages

Cross-domain reporting becomes more complex.

Atomic transactions cannot easily span domain databases.

Some workflows require eventual consistency.

## Future Evolution

Cross-domain workflows will progressively introduce:

Domain events

Transactional Outbox

Kafka

Idempotency

Saga patterns

Read models