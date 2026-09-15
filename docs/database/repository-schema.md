# MongoDB Schema: Repository Model (`Repository.ts`)

The `Repository` model stores cloned repository metadata ingested via GitHub GraphQL API.

## Schema Fields

| Field | Type | Description |
|-------|------|-------------|
| `userId` | `ObjectId` | Foreign key referencing the owning `User` |
| `githubRepoId` | `String` | GitHub numerical repository identifier |
| `name` | `String` | Repository name (e.g., `gitinsight-ai`) |
| `fullName` | `String` | Full repository name with namespace (`owner/repo`) |
| `description` | `String` | Short repository description |
| `isPrivate` | `Boolean` | Visibility flag |
| `starsCount` | `Number` | GitHub stargazers count |
| `forksCount` | `Number` | Repository fork count |
| `primaryLanguage` | `String` | Dominant programming language |
| `languages` | `Map<String, Number>` | Byte count breakdown per language |
| `commitCount` | `Number` | Total commits authored by the user in this repo |
| `syncStatus` | `String` | State: `pending`, `syncing`, `completed`, `failed` |
