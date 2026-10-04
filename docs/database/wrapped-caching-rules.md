# GitHub Wrapped Snapshot Caching & Annual Freeze Rules

## Concept
GitHub Wrapped represents a yearly retrospective of developer activity (e.g., Wrapped 2026). Once the calendar year terminates, the snapshot is frozen and immutable.

## Caching Strategy
- **Current Year**: Cached in Redis with a 24-hour TTL, recomputed on manual user refresh.
- **Historical Years**: Stored in MongoDB `wrappedreports` collection as static JSON documents.
