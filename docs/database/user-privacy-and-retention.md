# User Privacy Settings & Data Deletion Cascading Rules

## Privacy Controls
GitInsight AI adheres to GDPR and CCPA principles of data minimization and right-to-erasure.

## Cascading Deletion Workflow
When a user triggers account termination (`DELETE /api/users/me`):
```mermaid
sequenceDiagram
    User ->> API: DELETE /api/users/me
    API ->> MongoDB: Delete User Document
    API ->> MongoDB: Cascade Delete Repository Records
    API ->> MongoDB: Cascade Delete DeveloperDNA & Scores
    API ->> MongoDB: Cascade Delete Wrapped & Career Reports
    API ->> Redis: Invalidate All Active Sessions
    API ->> User: 204 No Content
```
