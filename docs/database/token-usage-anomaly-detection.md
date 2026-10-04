# AI Token Usage Auditing & Anomaly Detection

## Anomaly Criteria
- **Burst Spike Threshold**: >50,000 tokens consumed within 60s triggers temporary rate limiting.
- **Payload Variance**: Prompt input tokens exceeding 30,000 tokens per single request are logged for security review.
