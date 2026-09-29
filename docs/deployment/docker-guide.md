# Docker Multi-Stage Build & Containerization Guide

The backend includes a production-grade multi-stage Docker build:

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY src ./src
RUN npm run build

# Stage 2: Runner
FROM node:20-alpine AS runner
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
USER node
EXPOSE 5000
CMD ["node", "dist/server.js"]
```

## Benefits
- Minimal image size (< 180MB)
- Excludes development dependencies and TypeScript compiler from production artifact
- Runs as non-root user (`node`) for security.
