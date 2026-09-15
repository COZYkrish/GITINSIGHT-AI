# MongoDB Schema Overview

GitInsight AI utilizes MongoDB as its primary persistence engine via Mongoose ODM.

## Collection Directory

| Collection | Schema Model | Purpose |
|------------|--------------|---------|
| `users` | `User.ts` | User identities, OAuth tokens, and profile metadata |
| `repositories` | `Repository.ts` | Cloned metadata, languages, metrics, and star counts |
| `developerdnas` | `DeveloperDNA.ts` | Evaluated engineering archetype, skills, and traits |
| `portfolioscores` | `PortfolioScore.ts` | Multi-dimensional scoring across code quality, impact, etc. |
| `recruiterreports` | `RecruiterReport.ts` | Executive summary, red flags, badges, and hiring recommendations |
| `wrappedreports` | `WrappedReport.ts` | Yearly developer review metrics and celebration highlights |
| `careerreports` | `CareerReport.ts` | Market readiness, target seniority level, and skill gap roadmaps |
| `notifications` | `Notification.ts` | In-app user notifications for sync and analysis events |
| `aiusages` | `AIUsage.ts` | Token consumption logs and model cost tracking |
