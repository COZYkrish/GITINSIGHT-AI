# Webhook HMAC SHA-256 Signature Verification & Timing Attacks

## Security Verification
Incoming GitHub webhooks (`X-Hub-Signature-256`) are verified using constant-time string comparison to prevent timing side-channel attacks:

```typescript
import crypto from 'crypto';

export function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}
```
