import app from './app'
import { env } from './config/env'
import { connectDatabase } from './config/database'
import { connectRedis } from './config/redis'
import { startAnalysisWorker } from './jobs/analysis.job'
import { startWrappedWorker } from './jobs/wrapped.job'
import { startResumeWorker } from './jobs/resume.job'
import { startPortfolioWorker } from './jobs/portfolio.job'

async function bootstrap() {
  console.log('🚀 Starting GitInsight AI Backend...')
  
  // ── Database ──────────────────────────────────────────
  await connectDatabase()
  
  // ── Redis + BullMQ Workers ────────────────────────────
  const redisConnected = await connectRedis()
  
  if (redisConnected && env.ENABLE_BACKGROUND_JOBS) {
    console.log('🔄 Starting BullMQ job workers...')
    try {
      startAnalysisWorker()
      startWrappedWorker()
      startResumeWorker()
      startPortfolioWorker()
      console.log('✅ All job workers started')
    } catch (err) {
      console.warn('⚠️  Failed to start some workers:', err)
    }
  } else {
    console.log('ℹ️  Background jobs disabled — analyses will run synchronously')
  }
  
  // ── HTTP Server ───────────────────────────────────────
  const PORT = parseInt(env.PORT)
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`)
    console.log(`🌐 Frontend: ${env.FRONTEND_URL}`)
    console.log(`📊 Environment: ${env.NODE_ENV}`)
    console.log(`🤖 AI: Gemini 1.5 Pro`)
    console.log(`⚡ Jobs: ${redisConnected ? 'BullMQ/Redis' : 'Synchronous fallback'}`)
  })
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...')
  process.exit(0)
})

bootstrap().catch((err) => {
  console.error('❌ Bootstrap failed:', err)
  process.exit(1)
})
