# Notification Center Polling & State Synchronization

The `<NotificationCenter />` component:
- Polls `GET /api/notifications` every 45 seconds when browser window is focused.
- Disables background polling when tab is blurred (`document.visibilityState === 'hidden'`).
- Immediately reflects read/unread toggles optimistically in UI.
