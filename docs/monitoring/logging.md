# Application Logging & Telemetry

GitInsight AI incorporates dual-layer logging:

1. **HTTP Request Logging**: Captures request method, URL path, HTTP status, response time, and payload size.
2. **Domain Event Logging**: Emitted via `logger.ts` with explicit log levels:
   - `[INFO]`: Lifecycle state changes, queue job dispatches
   - `[WARN]`: Rate limit warnings, fallback invocations
   - `[ERROR]`: Caught exceptions, database timeouts, upstream API errors with stack traces.
