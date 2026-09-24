# Express Application Middleware Pipeline (`app.ts`)

Requests pass through an orderly pipeline:

1. **Helmet**: Sets security HTTP headers (`X-Content-Type-Options`, `X-Frame-Options`, CSP).
2. **CORS**: Enforces origins restricted to `CLIENT_URL`.
3. **Express JSON / URL-encoded**: Parses incoming request payloads (limit: 10MB).
4. **Mongo Sanitize**: Strips query selector operators (`$`, `.`).
5. **Rate Limiting**: Bounded by IP and user ID.
6. **Routes**: Mounts `/api/auth`, `/api/github`, `/api/analysis`, `/api/user`, `/api/jobs`.
7. **404 Handler**: Catches unmatched routes.
8. **Global Error Middleware**: Normalizes errors into standard `ApiResponse` JSON.
