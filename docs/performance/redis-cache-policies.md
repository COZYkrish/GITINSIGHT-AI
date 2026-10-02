# Redis Caching Policies & Time-To-Live (TTL)

| Cache Key Pattern | TTL | Invalidation Trigger |
|-------------------|-----|----------------------|
| `user:profile:<id>` | 1 Hour | User profile update event |
| `user:repos:<id>` | 15 Minutes | Repository sync completed |
| `ai:report:dna:<id>` | 24 Hours | User requests manual re-analysis |
| `github:ratelimit:<id>` | 60 Seconds | Periodic polling interval |
