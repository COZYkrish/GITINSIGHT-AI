# Docker Compose Local Multi-Container Environment

`docker-compose.yml` launches the complete GitInsight AI infrastructure in one command:

```bash
docker compose up -d
```

## Configured Services
- `backend`: Express API listening on port `5000`
- `frontend`: Vite React dev server listening on port `5173`
- `mongodb`: MongoDB daemon mapped to port `27017` with persistent named volume
- `redis`: Redis 7 alpine mapped to port `6379` with AOF persistence.
