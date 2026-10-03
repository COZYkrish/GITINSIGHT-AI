# Repository Synchronization Decision Matrix

## Decision Tree
To balance freshness with GitHub API rate limits, the sync scheduler dynamically decides between an **Incremental Sync** and a **Full Re-index**:

```mermaid
graph TD
    Start([User Logs In / Manual Sync]) --> CheckLastSync{Last Synced < 6 Hours?}
    CheckLastSync -->|Yes| QuickCheck[Poll GitHub ETag / Last-Modified]
    QuickCheck --> Changed{Any New Commits?}
    Changed -->|No| NoOp[Return Cached State]
    Changed -->|Yes| IncSync[Incremental Sync: Fetch Only New Commits]
    CheckLastSync -->|No| FullResync[Full Sync: Query GraphQL Tree & Recalculate Archetypes]
```
