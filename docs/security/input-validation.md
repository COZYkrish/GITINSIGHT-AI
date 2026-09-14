# Input Validation and Sanitization Standards

## Defense-in-Depth Validation Layers

1. **Express Mongo Sanitize**:
   Every incoming HTTP request body, query parameter, and route param is sanitized via `express-mongo-sanitize` middleware to prevent NoSQL query selector injection attacks (e.g., stripping `$` and `.` operators).

2. **Strict Regex Filtering**:
   - GitHub usernames are validated against the official RFC spec: `/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i`.
   - Repository identifiers conform strictly to alphanumeric slugs.
   - MongoDB ObjectId parameters are verified before initiating Mongoose database queries.

3. **Zod Schema Verification**:
   All AI responses emitted by the Gemini engine are parsed and strictly validated against Zod schema definitions before being written to persistent storage.
