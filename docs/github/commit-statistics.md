# Commit History Parsing & Statistical Aggregation

## Aggregated Dimensions
1. **Total Author Commits**: Counts commits where `author.user.id` matches the authenticated user ID.
2. **Weekly Distribution**: Maps commit timestamps to 7-day bins to identify weekend vs weekday coding cadence.
3. **Hourly Distribution**: Classifies commits into:
   - Morning (06:00 - 12:00)
   - Afternoon (12:00 - 18:00)
   - Evening (18:00 - 24:00)
   - Night Owl (00:00 - 06:00)
