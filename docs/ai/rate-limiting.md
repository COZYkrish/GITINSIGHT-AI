# AI Token Budget Management & Rate Limiting Strategy

## User Tier Limits

| Tier | Daily Generation Quota | Max Tokens / Request |
|------|------------------------|----------------------|
| Free User | 10 AI Analyses / day | 8,000 tokens |
| Pro User | 100 AI Analyses / day | 32,000 tokens |
| Admin | Unlimited | 64,000 tokens |

## Throttling Middleware
Before dispatching a generation job, the `aiRateLimiter` middleware inspects the user's trailing 24-hour usage in `aiusages`. If the threshold is reached, an HTTP `429 Too Many Requests` is returned with reset time information.
