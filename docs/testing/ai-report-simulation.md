# AI Report Generation & Error Simulation Testing

## Edge Cases Verified
1. **Empty Repositories**: Brand new GitHub account with 0 commits returns graceful guidance rather than 500 error.
2. **Gemini 429 Quota Exceeded**: System gracefully falls back to `gemini-1.5-flash` model.
3. **Malformed AI JSON**: Regex extraction recovers payload from markdown fences without breaking user experience.
