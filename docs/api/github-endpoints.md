# API Reference: GitHub Integration Routes (`github.routes.ts`)

## `POST /api/github/sync`
Triggers full asynchronous repository synchronization.
- **Rate Limit**: Max 1 request every 5 minutes per user.
- **Response**: `{ success: true, data: { jobId: "sync-1234", status: "pending" } }`

## `GET /api/github/rate-limit`
Returns remaining GitHub API points for authenticated user.
