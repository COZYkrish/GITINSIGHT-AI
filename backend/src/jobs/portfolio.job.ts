import { Worker, Job } from 'bullmq'
import { generatePortfolioContent } from '../services/analysis.service'
import { createNotification } from '../services/notification.service'
import { env } from '../config/env'

type PortfolioJobData = { userId: string }

function getConnectionOpts() {
  try {
    const url = new URL(env.REDIS_URL)
    return { host: url.hostname, port: parseInt(url.port || '6379'), password: url.password || undefined }
  } catch {
    return { host: 'localhost', port: 6379 }
  }
}

export function startPortfolioWorker() {
  const worker = new Worker<PortfolioJobData>(
    'portfolio',
    async (job: Job<PortfolioJobData>) => {
      const { userId } = job.data
      console.log(`[portfolio.job] Generating portfolio content for user ${userId}`)
      await job.updateProgress(20)

      const result = await generatePortfolioContent(userId)
      await job.updateProgress(85)

      await createNotification(userId, 'report_ready', 'Portfolio Content Ready! 🌐',
        'Your AI-generated portfolio website content is ready.',
        { reportType: 'portfolio_generator' })

      await job.updateProgress(100)
      return result
    },
    { connection: getConnectionOpts(), concurrency: 2 }
  )

  worker.on('completed', (job) => console.log(`[portfolio.job] ✅ Portfolio content done for ${job.data.userId}`))
  worker.on('failed', (job, err) => console.error(`[portfolio.job] ❌ Portfolio failed:`, err.message))
  return worker
}
