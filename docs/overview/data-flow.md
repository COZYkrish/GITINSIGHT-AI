# GitInsight AI — Data Flow & Request Lifecycle

## 1. Authentication & GitHub Token Exchange
1. User clicks **Connect with GitHub** on frontend.
2. Client redirects to `/api/auth/github` OAuth authorization flow.
3. GitHub redirects back with temporary code to `/api/auth/callback`.
4. Backend exchanges authorization code for user access token via GitHub OAuth.
5. User profile and tokens are persisted securely in MongoDB.
6. A signed JWT session cookie/header is issued to the client.

## 2. Repository Sync Flow
1. User triggers repository synchronization from client dashboard.
2. Backend queries GitHub GraphQL API for repositories, commit histories, languages, stars, and PRs.
3. Repositories are upserted into the MongoDB `repositories` collection.
4. WebSocket/polling notifies frontend of sync completion.

## 3. Asynchronous AI Analysis Pipeline
1. User requests deep analysis (Developer DNA, Recruiter Report, or Wrapped).
2. Backend validates rate limits and schedules a job on BullMQ (`analysis-queue`).
3. Worker worker extracts repository metrics, commit statistics, and code structures.
4. Worker compiles prompt with strict JSON schema constraints and dispatches to Google Gemini.
5. AI response is parsed, validated against Zod schema, and saved to corresponding report collection.
