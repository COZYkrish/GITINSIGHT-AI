# GitInsight AI — System Architecture Overview

GitInsight AI is an intelligent developer analytics platform that extracts GitHub activity, evaluates engineering competence through LLM models, and generates developer portfolios, recruiter summaries, and career progression maps.

## High-Level Topology

```
+------------------+         +--------------------+         +-------------------+
|  React 19 Client | <=====> | Express Backend API| <=====> |   MongoDB Store   |
|  (Vite + Tailwind|  HTTPS  |   (Node 20+ / TS)  |  Mongoose| (User/Repos/DNA)  |
+------------------+         +--------------------+         +-------------------+
                                    ||       ||
                     BullMQ Jobs /  ||       || REST / GraphQL
                     Redis 7+       ||       ||
                                    \/       \/
                             +----------+  +-------------------+
                             |  Worker  |  | GitHub API &      |
                             |  Engine  |  | Google Gemini AI  |
                             +----------+  +-------------------+
```

## Key Layers
1. **Frontend**: Interactive SPA built on Vite, React 19, Recharts for radar analytics, and Three.js for interactive canvas visuals.
2. **Backend**: Express REST API with TypeScript, Mongoose models, and middleware security (Helmet, MongoSanitize, CORS, rate limits).
3. **Queue / Worker Layer**: BullMQ redis-backed asynchronous job processing for deep analysis pipelines.
4. **AI Engine**: Google Gemini Generative AI multi-tier analysis for developer DNA, recruiter reports, and GitHub Wrapped summaries.
