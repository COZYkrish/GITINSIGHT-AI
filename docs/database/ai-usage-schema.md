# MongoDB Schema: AIUsage Model (`AIUsage.ts`)

Granular telemetry tracking token consumption, model invocations, and estimated operational costs.

## Schema Attributes
- `userId`: Reference to User
- `model`: AI model identifier (e.g., `gemini-1.5-pro`, `gemini-1.5-flash`)
- `feature`: Invoking feature (`DEVELOPER_DNA`, `RECRUITER_REPORT`, `WRAPPED`, etc.)
- `promptTokens`: Input token count
- `completionTokens`: Output token count
- `totalTokens`: Sum of prompt + completion tokens
- `latencyMs`: Generation duration in milliseconds
- `timestamp`: Execution timestamp
