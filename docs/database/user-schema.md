# MongoDB Schema: User Model (`User.ts`)

The `User` model represents the core developer identity authenticated via GitHub OAuth.

## Schema Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `githubId` | `String` | Yes | Unique immutable GitHub user identifier |
| `username` | `String` | Yes | GitHub login handle |
| `name` | `String` | No | Public display name |
| `email` | `String` | No | Verified primary GitHub email address |
| `avatarUrl` | `String` | No | GitHub CDN avatar profile image URI |
| `bio` | `String` | No | GitHub profile bio text |
| `accessToken` | `String` | Yes | Encrypted OAuth access token for GitHub API |
| `role` | `String` | Yes | Default: `user` (values: `user`, `admin`) |
| `lastSyncedAt`| `Date` | No | Timestamp of the most recent repository sync |
| `createdAt` | `Date` | Auto | Account registration timestamp |
| `updatedAt` | `Date` | Auto | Last document modification timestamp |

## Indexes
- `{ githubId: 1 }` (unique)
- `{ username: 1 }` (index for public lookups)
