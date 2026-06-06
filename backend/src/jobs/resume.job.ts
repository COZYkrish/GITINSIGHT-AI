import { Worker, Job } from 'bullmq'
import { generateResume } from '../services/analysis.service'
import { createNotification } from '../services/notification.service'
import { env } from '../config/env'

type ResumeJobData = { userId: string; resumeType: 'ats' | 'fullstack' | 'frontend' | 'ai' }

function getConnectionOpts() {
  try {
    const url = new URL(env.REDIS_URL)
    return { host: url.hostname, port: parseInt(url.port || '6379'), password: url.password || undefined }
  } catch {
    return { host: 'localhost', port: 6379 }
  }
}

export function startResumeWorker() {
  const worker = new Worker<ResumeJobData>(
    'resume',
    async (job: Job<ResumeJobData>) => {
      const { userId, resumeType } = job.data
      console.log(`[resume.job] Generating ${resumeType} resume for user ${userId}`)
      await job.updateProgress(20)

      const result = await generateResume(userId, resumeType)
      await job.updateProgress(85)

      await createNotification(userId, 'report_ready', 'Your Resume is Ready! 📝',
        `Your AI-generated ${resumeType.toUpperCase()} resume is ready to download.`,
        { reportType: 'resume', resumeType })

      await job.updateProgress(100)
      return result
    },
    { connection: getConnectionOpts(), concurrency: 2 }
  )

  worker.on('completed', (job) => console.log(`[resume.job] ✅ Resume (${job.data.resumeType}) done for ${job.data.userId}`))
  worker.on('failed', (job, err) => console.error(`[resume.job] ❌ Resume failed:`, err.message))
  return worker
}
