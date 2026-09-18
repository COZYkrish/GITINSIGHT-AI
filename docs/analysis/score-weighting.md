# Algorithmic Weighting for Developer Score Tiers

The PortfolioScore calculation uses a 4-pillar weighted arithmetic model:

```
Score = (Impact * 0.30) + (Craftsmanship * 0.30) + (Consistency * 0.25) + (Breadth * 0.15)
```

## Component Breakdowns
1. **Impact (30%)**:
   - Total stargazers across repositories
   - Fork count
   - Open source dependencies
2. **Craftsmanship (30%)**:
   - Presence of unit/e2e test files
   - Strict TypeScript configuration
   - Modular file organization and documentation
3. **Consistency (25%)**:
   - Consecutive active weeks
   - Regular distribution of commit timestamps
4. **Breadth (15%)**:
   - Mastery of front-end, back-end, database, and devops tooling.
