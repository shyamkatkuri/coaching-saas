# ADR-001: Start Core Business as a Modular Monolith

## Status

Accepted

## Context

The Coaching SaaS contains strongly related domains including tenant,
student, course, batch, enrollment, attendance and fee management.

Starting every domain as an independent microservice would introduce
network calls, distributed transactions, observability requirements,
service discovery, retries and eventual consistency before those
problems are justified.

## Decision

The primary transactional backend begins as a NestJS modular monolith.

Business domains must remain strongly separated as modules.

Module boundaries should be designed so selected modules can later
be extracted into independent services.

## Benefits

Simpler transactions.

Simpler local development.

Lower deployment complexity.

Better debugging.

Reduced operational overhead.

Easy refactoring during early product development.

## Disadvantages

Modules initially share one deployment lifecycle.

One module can affect overall process resource usage.

Independent scaling of a single module is not initially possible.

## Future Evolution

A module may become a microservice when independent scaling,
independent ownership, different technology requirements,
availability requirements, or workload isolation justify extraction.