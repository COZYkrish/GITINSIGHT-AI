# Redis Connection Resilience & Worker Failure Recovery

## Failure Scenarios Handled
1. **Redis Network Partitions**: BullMQ worker enters auto-reconnect mode with exponential backoff without crashing the Node.js process.
2. **Worker Process Termination (SIGTERM)**:
   - Worker stops accepting new jobs.
   - Currently active jobs are given 30 seconds to finish (`gracefulShutdown`).
   - Incomplete jobs are released back to the queue for another worker to claim.
