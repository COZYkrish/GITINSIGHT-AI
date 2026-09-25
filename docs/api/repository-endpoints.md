# API Reference: Repository Endpoints

## `GET /api/github/repositories`
Retrieves paginated list of synchronized user repositories.

### Query Parameters
- `page`: Page index (default: `1`)
- `limit`: Items per page (default: `10`, max: `50`)
- `language`: Filter by programming language (e.g. `TypeScript`)
- `sort`: Sort field (`stars`, `commits`, `name`, `updated`)
- `order`: `asc` or `desc` (default: `desc`)
