# Authentication Service Architecture (`auth.service.ts`)

Manages user identity verification and token generation.

## Token Characteristics
- Algorithm: HMAC-SHA256 (`HS256`)
- Expiration: 7 days (`7d`)
- Payload Claims: `{ id: user._id, githubId: user.githubId, role: user.role }`
- Verified via `auth.middleware.ts` on every protected route.
