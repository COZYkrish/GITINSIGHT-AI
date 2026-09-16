# MongoDB Indexing Strategy & Query Optimization

To maintain sub-20ms query latency under load, the following compound and single indexes are enforced:

## Indexes by Collection

### `repositories`
- `{ userId: 1, starsCount: -1 }` (Quick retrieval of top starred user repos)
- `{ userId: 1, githubRepoId: 1 }` (Unique constraint to prevent duplicate sync)
- `{ userId: 1, primaryLanguage: 1 }` (Aggregation index for language distribution)

### `aiusages`
- `{ userId: 1, timestamp: -1 }` (User token history and budget calculations)
- `{ feature: 1, timestamp: -1 }` (System-wide feature usage telemetry)

### `notifications`
- `{ userId: 1, read: 1, createdAt: -1 }` (Fast unread notification fetching)
