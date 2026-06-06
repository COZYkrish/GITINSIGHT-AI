import { Worker, Job } from 'bullmq'
import { generateWrappedReport } from '../services/analysis.service'
import { createNotification } from '../services/notification.service'
import { env } from '../config/env'

type WrappedJobData = { userId: string; year: number }

function getConnectionOpts() {
  try {
    const url = new URL(env.REDIS_URL)
    return { host: url.hostname, port: parseInt(url.port || '6379'), password: url.password || undefined }
  } catch {
    return { host: 'localhost', port: 6379 }
  }
}

export function startWrappedWorker() {
  const worker = new Worker<WrappedJobData>(
    'wrapped',
    async (job: Job<WrappedJobData>) => {
      const { userId, year } = job.data
      console.log(`[wrapped.job] Processing Wrapped ${year} for user ${userId}`)
      await job.updateProgress(20)

      const result = await generateWrappedReport(userId, year)
      await job.updateProgress(80)

      await createNotification(userId, 'report_ready', `GitHub Wrapped ${year} Ready! 🎁`,
        `Your ${year} developer year in review is ready to view and share.`,
        { reportType: 'wrapped', year: String(year) })

      await job.updateProgress(100)
      return result
    },
    { connection: getConnectionOpts(), concurrency: 2 }
  )

  worker.on('completed', (job) => console.log(`[wrapped.job] ✅ Wrapped ${job.data.year} for ${job.data.userId} complete`))
  worker.on('failed', (job, err) => console.error(`[wrapped.job] ❌ Wrapped failed:`, err.message))
  return worker
}
