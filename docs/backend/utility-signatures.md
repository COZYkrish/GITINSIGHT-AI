# Backend Utility Catalog & Function Signatures

| Utility Module | Exported Functions / Classes | Purpose |
|----------------|------------------------------|---------|
| `logger.ts` | `logger.info`, `logger.warn`, `logger.error` | Timestamped structured logging |
| `asyncHandler.ts` | `asyncHandler(fn)` | Express route exception wrapper |
| `responseFormatter.ts` | `sendSuccess(res, data)`, `sendError(res, err)` | Uniform JSON envelopes |
| `errors.ts` | `AppError`, `NotFoundError`, `UnauthorizedError` | Domain exception hierarchy |
| `validators.ts` | `isValidGitHubUsername`, `isValidRepoName` | Input verification |
| `metrics.ts` | `normalizeScore`, `getScoreTier`, `calculateWeightedScore` | Score calculations |
| `url.ts` | `parseGitHubRepoUrl`, `isValidHttpUrl` | URL & repo path parsing |
| `crypto.ts` | `hashToken`, `compareToken`, `generateRandomToken` | Cryptographic utilities |
