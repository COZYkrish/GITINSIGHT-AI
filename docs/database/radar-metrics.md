# DeveloperDNA Radar Chart Metric Computation

The radar chart displayed in the frontend dashboard visually maps 5 orthogonal developer competencies:

```
           Code Quality (0-100)
                  /                 /    Velocity (0-100)  Consistency (0-100)
         \          /
          \        /
  Collaboration  Architecture
    (0-100)       (0-100)
```

## Weights & Formulas
1. **Consistency**: `(activeWeeksInYear / 52) * 60 + (activeDaysPerWeekRatio) * 40`
2. **Architecture**: Derived from repo modularity, directory structure depth, and Gemini AI analysis.
3. **Velocity**: `log10(commitsPerMonth + 1) * 35` bounded by 100.
4. **Code Quality**: Gemini code review of sample pull requests, lint config presence, and test coverage.
