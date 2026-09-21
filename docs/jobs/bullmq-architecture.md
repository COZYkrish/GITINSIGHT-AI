# BullMQ Queue Architecture (`queue.setup.ts`)

GitInsight AI decouples long-running asynchronous AI evaluations from synchronous HTTP request cycles using BullMQ and Redis.

## Named Queues
- `analysis-queue`: Computes Developer DNA, Recruiter Reports, and Career Readiness.
- `github-sync-queue`: Fetches and normalizes repositories from GitHub GraphQL API.
- `portfolio-queue`: Aggregates portfolio scores and showcase projects.
- `wrapped-queue`: Generates annual retrospectives.
- `resume-queue`: Generates ATS-friendly resumes.

## Redis Connection Setup
Configured via `ioredis` with automatic reconnection, heartbeat pings every 15 seconds, and exponential backoff retry.
