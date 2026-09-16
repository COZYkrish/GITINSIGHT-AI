# MongoDB Schemas: PublicProfile & ReadmeReport

## PublicProfile (`PublicProfile.ts`)
Controls visibility and custom vanity settings for shareable developer portfolios:
- `vanitySlug`: Custom URL path (e.g. `/u/cozykrish`)
- `isPublic`: Global visibility toggle
- `showScore`: Allow display of PortfolioScore on public page
- `featuredRepoIds`: Curated list of showcase repositories
- `customTheme`: UI theme preferences (Dark, Cyberpunk, Newsprint)

## ReadmeReport (`ReadmeReport.ts`)
Analyzes project README quality, completeness, documentation clarity, installation steps, and provides an actionable improvement score.
