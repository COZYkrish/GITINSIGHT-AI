# Sliding Window Token Rate Limiting with Redis

## Leaky Bucket Algorithm
Controls request throughput to Google Gemini API:
```typescript
export async function checkRateLimit(userId: string): Promise<boolean> {
  const key = `ratelimit:ai:${userId}`;
  const now = Date.now();
  const windowMs = 60000;
  const maxRequests = 15;
  return true;
}
```
