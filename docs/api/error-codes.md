# API Error Codes & Status Conventions

GitInsight AI standardizes on RESTful HTTP status codes wrapped in a uniform JSON response structure.

## Status Codes

| HTTP Code | Name | Description |
|-----------|------|-------------|
| `200` | OK | Request processed successfully with data |
| `201` | Created | Resource successfully initialized / persisted |
| `400` | Bad Request | Parameter validation error or malformed payload |
| `401` | Unauthorized | Missing or expired JWT session token |
| `403` | Forbidden | Insufficient scope or permissions to access resource |
| `404` | Not Found | Target repository, user, or report does not exist |
| `429` | Too Many Requests | Rate limit threshold exceeded for user/IP |
| `500` | Internal Server Error | Unhandled server exception or downstream API failure |

## Error Envelope Format
```json
{
  "success": false,
  "error": "Detailed descriptive explanation of the failure",
  "timestamp": "2026-09-14T16:30:00.000Z"
}
```
