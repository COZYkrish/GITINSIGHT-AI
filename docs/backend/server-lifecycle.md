# Server Bootstrap Lifecycle & Graceful Shutdown (`server.ts`)

```
[ START ] ---> [ CONNECT_MONGO ] ---> [ CONNECT_REDIS ] ---> [ START_WORKERS ] ---> [ LISTEN_PORT ]
                                                                                         |
                                                                (On SIGTERM / SIGINT)    v
                                                                             [ GRACEFUL_SHUTDOWN ]
```

On termination signals (`SIGTERM`, `SIGINT`), the server stops accepting incoming HTTP connections, flushes in-flight queue jobs, closes Mongoose and Redis connections, and cleanly exits with code 0.
