# Zustand State Management Architecture

State is partitioned into modular stores:
- `useAuthStore`: Holds active user, JWT token, and authentication status.
- `useRepoStore`: Synchronized repositories, search filters, and active pagination.
- `useAnalysisStore`: Cached Developer DNA, Recruiter Reports, and Radar metrics.
- `useNotificationStore`: In-app notification queue and unread badge count.
