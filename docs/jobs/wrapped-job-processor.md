# GitHub Wrapped Processor & Cache Strategy (`wrapped.job.ts`)

## Annual Cache Invalidation
Because historical commit data for past years is immutable, once a `WrappedReport` is generated for a completed calendar year (e.g., 2025), it is cached indefinitely in MongoDB with `immutable: true`.

For the current active year, reports are cached for 24 hours before re-computing fresh stats upon user request.
