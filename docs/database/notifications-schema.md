# MongoDB Schemas: MentorReport & Notification

## 1. MentorReport (`MentorReport.ts`)
Provides ongoing personalized technical mentorship advice:
- Code hygiene recommendations
- Refactoring targets identified across repositories
- Architecture reading recommendations
- Habit coaching (commit sizing, PR descriptions, test coverage)

## 2. Notification (`Notification.ts`)
In-app alerts delivered to developers:
- `type`: `SYNC_COMPLETE`, `ANALYSIS_READY`, `SCORE_UPDATED`, `SYSTEM_ALERT`
- `title`: Alert headline
- `message`: Short notification body
- `read`: Boolean flag
- `link`: Optional redirect path
