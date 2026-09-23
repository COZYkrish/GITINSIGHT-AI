# GitHub Repository Pagination & Cursor Management

## Cursor-Based Pagination Pattern
GitHub GraphQL queries utilize cursor tokens (`after: $cursor`) to iterate through large repository catalogs:

```graphql
query GetUserRepos($login: String!, $cursor: String) {
  user(login: $login) {
    repositories(first: 50, after: $cursor, orderBy: {field: UPDATED_AT, direction: DESC}) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        name
      }
    }
  }
}
```

The sync worker iterates until `hasNextPage` is false, ensuring all repositories are indexed.
