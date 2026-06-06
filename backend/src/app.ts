import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'
import { env } from './config/env'
import { errorMiddleware } from './middleware/error.middleware'
import authRoutes from './routes/auth.routes'
import githubRoutes from './routes/github.routes'
import analysisRoutes from './routes/analysis.routes'
import notificationRoutes from './routes/notifications.routes'
import userRoutes from './routes/user.routes'
import jobsRoutes from './routes/jobs.routes'
import configRoutes from './routes/config.routes'

const app = express()

// ── Security ──────────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false,
}))

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.startsWith('http://localhost:') || origin === env.FRONTEND_URL) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}))

// ── Rate Limiting ─────────────────────────────────────────────────────────
const globalLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: { error: 'Too many requests' } })
const authLimit  = rateLimit({ windowMs: 15 * 60 * 1000, max: 100,  message: { error: 'Too many auth attempts' } })
const aiLimit    = rateLimit({ windowMs: 60 * 60 * 1000, max: 500,  message: { error: 'AI analysis rate limit reached' } })

app.use(globalLimit)

// ── Body Parsing ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))
// app.use(mongoSanitize()) // Temporarily removed due to req.query getter error in newer node/express

// ── Health Check ──────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', version: '1.0.0', timestamp: new Date().toISOString() })
})

// ── Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',          authLimit,  authRoutes)
app.use('/api/github',                    githubRoutes)
app.use('/api/analysis',      aiLimit,    analysisRoutes)
app.use('/api/notifications',             notificationRoutes)
app.use('/api/user',                      userRoutes)
app.use('/api/jobs',                      jobsRoutes)
app.use('/api/config',                    configRoutes)

// ── 404 ───────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }))

// ── Error Handler ─────────────────────────────────────────────────────────
app.use(errorMiddleware)

export default app
