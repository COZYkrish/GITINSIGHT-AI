# Static Hosting Deployment Guide (Vercel / Netlify / Cloudflare Pages)

## Configuration
- Framework Preset: `Vite`
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

## Single Page App Rewrite
Create `vercel.json` in `frontend/` to rewrite all route paths to `index.html`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
