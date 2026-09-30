# OWASP Top 10 Hardening Architecture

1. **A01: Broken Access Control**: Middleware verifies JWT token ownership on all repository and report modification endpoints.
2. **A02: Cryptographic Failures**: OAuth tokens encrypted in transit (TLS 1.3) and hashed at rest.
3. **A03: Injection**: Strict Mongoose schema models and `express-mongo-sanitize` neutralize NoSQL injection vectors.
4. **A05: Security Misconfiguration**: Helmet applies strict HTTP headers; detailed stack traces disabled in production.
