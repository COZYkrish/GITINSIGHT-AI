# Portfolio Score Multi-Factor Weighting Sensitivity Analysis

## Factor Weight Matrix
The aggregate portfolio score (0 - 1000) reflects developer seniority and project delivery:

| Factor | Weight | Evaluation Method |
| :--- | :--- | :--- |
| **Commit Regularity** | 25% | Gini coefficient over 52 weeks |
| **Code Quality & CI** | 20% | GitHub Actions badge status & tests |
| **Project Complexity** | 25% | AST depth, lines of code, dependency count |
| **Ecosystem Reach** | 15% | Stargazers, forks, and package releases |
| **Documentation** | 15% | README length, API docs, changelog presence |
