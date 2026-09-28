# Frontend API Client & Axios Interceptors

## Axios Base Instance (`services/api.ts`)
- Configured with `baseURL: import.meta.env.VITE_API_URL`
- `withCredentials: true` enables HTTP-only cookies

## Request Interceptor
Attaches `Authorization: Bearer <token>` from Zustand auth store.

## Response Interceptor
Intercepts HTTP 401 errors, clears user session, and smoothly redirects to `/login`.
