# GitHub Webhook Payload Structure & Event Ingestion

GitInsight AI supports real-time synchronization via GitHub Webhooks.

## Subscribed Events
- `push`: Triggered on commit push to default branch; increments commit counter and updates last active date.
- `star`: Triggered when repository is starred; updates star count and recalculates impact score.
- `fork`: Triggered on repo fork.

## Security Verification
Webhooks are cryptographically validated against `GITHUB_WEBHOOK_SECRET` using HMAC SHA-256 signatures (`x-hub-signature-256`).
