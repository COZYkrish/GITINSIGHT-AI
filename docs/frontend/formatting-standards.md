# Frontend Formatting Standards & Localization

1. **Number Formatting**: All commit counts, star totals, and user counts pass through `formatNumber` to ensure comma separation (e.g. `1,420`).
2. **Score Presentation**: Radar chart scores and portfolio scores are bounded integers between 0 and 100 via `formatScore`.
3. **Byte Counts**: Repository language byte sizes format automatically to human-readable units (B, KB, MB, GB).
