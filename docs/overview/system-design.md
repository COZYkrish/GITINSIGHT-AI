# GitInsight AI — System Design & Service Boundaries

## Modular Subsystems

### 1. Ingestion Service (`services/github.service.ts`)
- Manages authenticated GitHub REST & GraphQL client communication.
- Handles pagination, Octokit rate-limit budget checks, and exponential backoff retry.
- Responsible for transforming raw GitHub payloads into normalized repository entities.

### 2. Analysis Service (`services/analysis.service.ts`)
- Core business logic coordinator.
- Computes aggregated repository metrics:
  - Code frequency and commit cadence
  - Language diversity and primary stack proficiency
  - Contribution impact (stars, forks, open-source PR ratios)

### 3. AI Service (`services/ai/gemini.service.ts`)
- Encapsulates Google Gemini API communication (`@google/generative-ai`).
- Enforces system prompt constraints, JSON schema enforcement, and temperature tuning.
- Manages fallback strategy when primary AI endpoints encounter transient throttling.

### 4. Background Worker Subsystem (`jobs/`)
- Isolates compute-heavy LLM queries and GitHub syncs from synchronous request-response loops.
- Provides job progress metrics and real-time status updates via Redis pub/sub.
