# Redis Setup & Configuration Guide

## Local Installation Options

### 1. Via Docker (Recommended)
```bash
docker run -d --name gitinsight-redis -p 6379:6379 redis:7-alpine redis-server --appendonly yes
```

### 2. Native Windows (WSL2)
```bash
wsl
sudo apt-get install redis-server
sudo service redis-server start
```

## Production Recommendations
- Enable Redis persistence: AOF (`appendonly yes`) with `appendfsync everysec`.
- Allocate at least 256MB RAM with `maxmemory-policy noeviction` for BullMQ queue stability.
