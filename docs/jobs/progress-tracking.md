# Job Progress Tracking & Status Polling

Clients monitor background analysis jobs via:
1. **Polling Endpoint**: `GET /api/jobs/status/:jobId` returns job status (`waiting`, `active`, `completed`, `failed`), progress percentage (0-100), and completed payload.
2. **In-App Notifications**: On job completion, a notification entity is added to the user's feed.
