# MongoDB Schema: RecruiterReport Model (`RecruiterReport.ts`)

AI-generated executive summary tailored for hiring managers, technical recruiters, and talent acquisition teams.

## Schema Structure
- `userId`: Reference to User
- `summary`: High-level 2-3 paragraph professional narrative
- `topStrengths`: Array of verified technical strengths backed by repo evidence
- `growthAreas`: Constructive areas for development
- `hiringBadges`: Array of earned achievement badges (e.g., "Full-Stack Shipper", "Open-Source Contributor")
- `seniorityRecommendation`: AI-recommended level (Junior, Mid, Senior, Lead, Staff)
- `interviewQuestions`: Custom technical questions based on the candidate's real code.
