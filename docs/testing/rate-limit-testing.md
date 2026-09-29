# GitHub API Rate Limit Threshold Testing

Simulates GitHub GraphQL rate limits:
- When remaining points fall below 100, the sync worker automatically delays queries and enters a cooldown state.
- Client UI receives warning toast notification: "GitHub API rate limit cooldown active. Sync will resume shortly."
