# Content Security Policy & CORS Hardening

## CSP Directives
```typescript
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https://avatars.githubusercontent.com'],
      connectSrc: ["'self'", 'https://api.github.com'],
    },
  })
);
```
