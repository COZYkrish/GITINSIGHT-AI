# Database Latency & Index Tuning Benchmarks

## Query Execution Benchmarks (10,000 repositories dataset)
- `findUserRepos(userId)` without index: `84ms`
- `findUserRepos(userId)` with compound index: `2.4ms` (**35x speedup**)
- `findTopLanguages(userId)` with aggregation pipeline: `14ms`
- `findRecentDNA(userId)` single document lookup: `0.8ms`
