# Sensitive Data Redaction Guidelines

Application logs automatically redact sensitive fields before outputting to stdout:
- `accessToken` -> `[REDACTED]`
- `clientSecret` -> `[REDACTED]`
- `Authorization` header -> `Bearer [REDACTED]`
- Passwords and secret keys are stripped via regex filters.
