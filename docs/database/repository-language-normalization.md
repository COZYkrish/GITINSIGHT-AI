# Repository Language Breakdown Normalization Algorithms

## Calculation Algorithm
GitHub returns byte counts per language for each repository. GitInsight AI normalizes these counts to determine language affinity percentages across all user repositories:

```typescript
export function computeLanguageDistribution(languages: { name: string; bytes: number }[]): Record<string, number> {
  const totalBytes = languages.reduce((acc, curr) => acc + curr.bytes, 0);
  if (totalBytes === 0) return {};
  
  const distribution: Record<string, number> = {};
  for (const lang of languages) {
    const percentage = Number(((lang.bytes / totalBytes) * 100).toFixed(2));
    distribution[lang.name] = percentage;
  }
  return distribution;
}
```
