# Queue Concurrency Control & Retry Policies

## Concurrency Settings
- `analysis-queue`: 3 concurrent jobs per worker (protects Gemini rate limits)
- `github-sync-queue`: 5 concurrent jobs per worker
- `portfolio-queue`: 5 concurrent jobs per worker

## Retry Configuration
```typescript
{
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 5000, // 5s, 10s, 20s
  },
  removeOnComplete: 100, // keep latest 100 completed jobs
  removeOnFail: 500,     // keep failed jobs for debugging
}
```
