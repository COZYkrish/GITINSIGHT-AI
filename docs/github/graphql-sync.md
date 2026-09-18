# GitHub GraphQL Synchronization Strategy

## Why GraphQL over REST?
Traditional GitHub REST v3 endpoints require `N+1` roundtrips:
1. `GET /user/repos` (List repositories)
2. `GET /repos/{owner}/{repo}/languages` (Fetch languages per repo)
3. `GET /repos/{owner}/{repo}/commits` (Fetch commit counts)

With GitHub GraphQL v4, GitInsight AI retrieves all user repositories, primary languages, byte counts, and default branch commit histories in a single atomic query, reducing network latency by over 80%.

## Rate-Limit Budgeting
- GitHub allocates **5,000 GraphQL points per hour** per OAuth user token.
- A single comprehensive query requesting 100 repositories consumes ~1 point.
- Sync jobs track remaining rate limits from response headers and apply backoff when remaining points dip below 100.
