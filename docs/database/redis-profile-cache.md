# Redis Caching Layer for Frequent User Profile Lookups

## Cache Invalidation Architecture
Public developer profiles experience high read-to-write ratios. Redis stores serialized profile payloads:
- **Key Pattern**: `cache:profile:<slug>`
- **TTL**: 3600 seconds (1 hour).
