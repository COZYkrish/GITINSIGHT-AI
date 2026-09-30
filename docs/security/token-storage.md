# Secure Token Storage & Refresh Strategy

## Client Storage
- JWT session tokens are stored in `localStorage` or `HttpOnly, Secure, SameSite=Lax` cookies.
- Expired tokens automatically trigger redirect to GitHub OAuth login.

## Server Storage
- GitHub user access tokens stored in MongoDB are encrypted at application level.
- Keys are decoupled from standard user profile reads.
