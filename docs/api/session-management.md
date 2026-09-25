# API Reference: Session Management & Logout

## `POST /api/auth/logout`
Terminates current user session:
- Clears session cookies
- Emits audit log entry
- Client clears local storage tokens and resets Zustand state.

## Session Invalidation
Tokens are stateless JWTs. Logout clears client-side credentials. For security, revoked token IDs can be blacklisted in Redis with TTL matching token expiration.
