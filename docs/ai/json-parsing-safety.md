# Robust JSON Extraction & Parsing Guide

LLMs may occasionally prepend conversational text or wrap responses in markdown code fences (` ```json `).

## Cleaning Protocol
```typescript
export const extractJSON = (rawText: string): unknown => {
  // Strip code fences
  const cleaned = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();

  // Find first { or [ and last } or ]
  const firstBrace = cleaned.search(/[{}\[]/);
  const lastBrace = Math.max(cleaned.lastIndexOf('}'), cleaned.lastIndexOf(']'));

  if (firstBrace !== -1 && lastBrace !== -1) {
    return JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
  }

  return JSON.parse(cleaned);
};
```
