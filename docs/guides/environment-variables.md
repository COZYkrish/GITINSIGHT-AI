# Environment Variables Reference

A detailed guide to configuring environment variables across GitInsight AI services.

## Backend `.env`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `5000` | HTTP listener port for Express API |
| `NODE_ENV` | Yes | `development` | Environment mode (`development`, `production`, `test`) |
| `MONGO_URI` | Yes | - | MongoDB connection string |
| `REDIS_URL` | Yes | `redis://localhost:6379` | Redis host connection URI for BullMQ |
| `JWT_SECRET` | Yes | - | Cryptographic secret for signing auth tokens |
| `GITHUB_CLIENT_ID` | Yes | - | GitHub OAuth Client ID |
| `GITHUB_CLIENT_SECRET` | Yes | - | GitHub OAuth Client Secret |
| `GITHUB_CALLBACK_URL` | Yes | - | OAuth redirect callback URI |
| `GEMINI_API_KEY` | Yes | - | Google Gemini AI Studio API key |
| `CLIENT_URL` | Yes | `http://localhost:5173` | Allowed CORS origin for frontend |

## Frontend `.env`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | Yes | `http://localhost:5000/api` | Base URL for backend REST endpoints |
