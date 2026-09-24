# User Settings Schema & Payload Specification

## Settings Object Format
```typescript
interface UserSettings {
  emailNotifications: boolean;
  weeklyDigest: boolean;
  publicProfileEnabled: boolean;
  showRadarScore: boolean;
  preferredTheme: 'dark' | 'light' | 'cyberpunk' | 'newsprint';
}
```

Persisted as a subdocument within the `User` collection.
