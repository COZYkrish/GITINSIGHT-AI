# Analysis Scoring Breakdown & Confidence Modeling

## Score Tier Brackets

| Score Range | Tier Level | Description |
|-------------|------------|-------------|
| `85 - 100` | EXPERT | Exceptional architectural discipline, consistent high-velocity delivery |
| `70 - 84` | ADVANCED | Strong production foundations, solid test suites and code hygiene |
| `50 - 69` | INTERMEDIATE | Good functional code, expanding full-stack breadth |
| `0 - 49` | DEVELOPING | Early-stage projects, emerging development practices |

## Confidence Interval Calculation
Confidence scores (0.0 to 1.0) scale based on total available data:
- `< 5 repositories`: Confidence capped at 0.65
- `5 - 15 repositories`: Confidence scales to 0.85
- `> 15 repositories & 200+ commits`: Full confidence rating of 1.00
