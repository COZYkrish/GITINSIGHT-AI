# Render Deployment Architecture (`render.yaml`)

GitInsight AI is configured as a multi-service blueprint on Render:

1. **Web Service (`gitinsight-api`)**:
   - Environment: `node`
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm run start`
   - Auto-deploys on commit to `main` branch.

2. **Background Worker (`gitinsight-worker`)**:
   - Dedicated BullMQ worker processing AI jobs without consuming HTTP server connections.

3. **Managed Redis (`gitinsight-redis`)**:
   - High-availability key-value store for queues.
