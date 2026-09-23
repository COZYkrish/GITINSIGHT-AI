# API Reference: Authentication Endpoints (`auth.routes.ts`)

## `GET /api/auth/github`
Initiates GitHub OAuth flow by redirecting user to GitHub authorization endpoint.

## `GET /api/auth/github/callback`
GitHub redirects here with temporary `code`. Backend exchanges code for user access token and returns JWT cookie/redirect.

## `GET /api/auth/me`
Returns currently authenticated user profile.
- **Headers**: `Authorization: Bearer <JWT>`
- **Response**: `{ success: true, data: { user: { ... } } }`
