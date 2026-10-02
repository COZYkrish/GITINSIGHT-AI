# Frontend Bundle Optimization & Code Splitting

## Dynamic Route Imports
Pages are lazy-loaded via `React.lazy()`:
```typescript
const DashboardPage = React.lazy(() => import('./pages/dashboard/DashboardPage'));
const AIRecruiterPage = React.lazy(() => import('./pages/features/ai-recruiter/AIRecruiterPage'));
```

## Vendor Chunk Splitting
In `vite.config.ts`, heavy dependencies (`three`, `@react-three/fiber`, `recharts`, `lucide-react`) are partitioned into isolated vendor chunks to optimize browser caching.
