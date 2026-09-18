# Google Gemini Model Fallback Logic

To guarantee zero downtime when upstream Gemini API rate limits or transient errors occur, the backend employs multi-tier model fallbacks:

```
[ Primary: gemini-1.5-pro ]
          | (On 429 / 503 error)
          v
[ Fallback 1: gemini-1.5-flash ]
          | (On second failure)
          v
[ Fallback 2: Cached Heuristic Generation / Graceful Queue Delay ]
```

## Retry Rules
- Initial backoff: 1,500ms
- Multiplier: 2.0x
- Maximum retries: 3 attempts
