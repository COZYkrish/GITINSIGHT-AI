# MongoDB Schema Versioning & Data Migration Strategy

## Versioning Pattern
Every core document in MongoDB contains a `schemaVersion: number` attribute:
```typescript
interface BaseDocument {
  schemaVersion: number;
  createdAt: Date;
  updatedAt: Date;
}
```
