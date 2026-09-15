# Repository Synchronization Lifecycle & State Machine

```
[ PENDING ] ---> [ SYNCING ] ---> [ COMPLETED ]
                      |
                      v (On API failure / rate limit)
                  [ FAILED ] ---> [ RETRY_SCHEDULED ]
```

## State Transitions
1. **PENDING**: Job scheduled on BullMQ `github-sync` queue.
2. **SYNCING**: Worker actively querying GitHub GraphQL nodes. Repository commits, language stats, and PR history are streaming.
3. **COMPLETED**: Metadata validated, upserted to MongoDB, and WebSocket broadcast issued.
4. **FAILED**: Exponential backoff triggered. Up to 3 attempts with 5-minute cooldown.
