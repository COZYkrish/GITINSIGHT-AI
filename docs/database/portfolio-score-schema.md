# MongoDB Schema: PortfolioScore Model (`PortfolioScore.ts`)

Composite numerical evaluation scored from 0 to 100 representing overall GitHub portfolio strength.

## Key Fields
- `overallScore`: Weighted integer (0 - 100)
- `tier`: One of `EXPERT`, `ADVANCED`, `INTERMEDIATE`, `DEVELOPING`
- `breakdown`:
  - `codeImpact`: 30% weight (Stars, forks, community dependencies)
  - `codeCraftsmanship`: 30% weight (Typing, tests, architecture)
  - `consistency`: 25% weight (Active days, streak stability)
  - `breadth`: 15% weight (Languages, framework diversity)
- `historicalTrends`: Array of previous scores over time for trajectory analysis.
