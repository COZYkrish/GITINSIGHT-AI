# Production Environment Variables & Secret Management

## Best Practices
- Never commit actual `.env` files to git (enforced by `.gitignore`).
- Store production secrets in Render or cloud secret managers.
- Rotate `JWT_SECRET` and `GITHUB_CLIENT_SECRET` every 90 days.
- Restrict MongoDB IP whitelist to backend service CIDRs.
