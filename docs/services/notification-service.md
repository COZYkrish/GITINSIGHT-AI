# Notification Service Architecture (`notification.service.ts`)

Handles asynchronous in-app notifications.

## Capabilities
- `createNotification(userId, type, title, message, link)`: Persists alert in MongoDB.
- `markAsRead(notificationId, userId)`: Updates read flag.
- `markAllAsRead(userId)`: Batch marks all notifications.
- `getUnreadCount(userId)`: Returns unread badge counter.
