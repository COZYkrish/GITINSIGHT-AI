# GitHub Service Methods & Architecture (`github.service.ts`)

## Core Public Methods
- `getUserProfile(token)`: Fetches authenticated user identity and metadata
- `getUserRepositories(token, page, limit)`: Paginated repository query
- `getRepositoryDetails(token, owner, repo)`: In-depth metrics for specific repository
- `getCommitActivity(token, owner, repo)`: Trailing 52-week commit activity history
- `getRateLimitStatus(token)`: Inspects remaining API quota
