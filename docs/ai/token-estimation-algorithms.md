# Token Estimation Algorithms & Pre-Request Budgeting

## Heuristic Estimator
```typescript
export function estimateTokenCount(text: string): number {
  const isCodeHeavy = text.includes('{') || text.includes('function') || text.includes('commit');
  const charsPerToken = isCodeHeavy ? 3.2 : 4.0;
  return Math.ceil(text.length / charsPerToken);
}
```
