# Health Check Endpoints & Monitoring

## `GET /health`
Liveness probe used by Docker, Kubernetes, and Render:
- Status: `200 OK`
- Verifies HTTP server is responding.

## `GET /health/deep`
Readiness probe verifying external dependencies:
- MongoDB connection status (`mongoose.connection.readyState === 1`)
- Redis client ping (`redis.ping() === 'PONG'`)
- Process memory and uptime metrics.
