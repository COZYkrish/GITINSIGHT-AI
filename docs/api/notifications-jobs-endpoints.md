# API Reference: Notifications & Job Queue Routes

## Notifications Endpoints (`notifications.routes.ts`)
- `GET /api/notifications`: Retrieves latest 20 notifications for the user
- `PATCH /api/notifications/:id/read`: Marks a single notification as read
- `POST /api/notifications/mark-all-read`: Marks all unread alerts as read

## Jobs Endpoints (`jobs.routes.ts`)
- `GET /api/jobs/status/:jobId`: Returns current BullMQ job status and progress percentage.
