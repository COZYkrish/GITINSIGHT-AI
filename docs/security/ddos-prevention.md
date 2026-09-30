# Rate Limiting & DDoS Prevention Policies

Configured via `express-rate-limit`:
- **Global API Limit**: 100 requests per 15-minute window per IP.
- **Analysis Trigger Limit**: 10 requests per hour per user ID.
- **Sync Trigger Limit**: 1 request per 5 minutes per user ID.
- **Authentication Routes**: 5 attempts per 10 minutes.
