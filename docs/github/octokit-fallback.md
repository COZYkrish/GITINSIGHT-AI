# Octokit and REST API Fallback Architecture

While GraphQL is the primary transport for repository ingestion, the service maintains Octokit REST client fallbacks:

```
[ Primary: GitHub GraphQL API v4 ]
                 |
                 v (On query complexity limit / partial schema failures)
[ Secondary: Octokit REST v3 Endpoints ]
```

## REST Fallback Use Cases
- Large repository commit lists exceeding 100 nodes per page
- Public repositories where OAuth user token does not have organization read permissions
- Webhook delivery signature validation
