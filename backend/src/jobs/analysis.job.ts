import { Worker, Job } from 'bullmq'
import {
  generateDeveloperDNA,
  generatePortfolioScore,
  generateRecruiterReport,
  generateCareerReport,
  generatePortfolioTimeline,
  generateMentorReport,
} from '../services/analysis.service'
import { createNotification } from '../services/notification.service'
import { env } from '../config/env'

type AnalysisJobData = {
  userId: string
  type: 'developer_dna' | 'portfolio_score' | 'recruiter_report' | 'career_report' | 'timeline' | 'mentor_report'
}

function getConnectionOpts() {
  try {
    const url = new URL(env.REDIS_URL)
    return {
      host: url.hostname,
      port: parseInt(url.port || '6379'),
      password: url.password || undefined,
    }
  } catch {
    return { host: 'localhost', port: 6379 }
  }
}

export function startAnalysisWorker() {
  const worker = new Worker<AnalysisJobData>(
    'analysis',
    async (job: Job<AnalysisJobData>) => {
      const { userId, type } = job.data
      console.log(`[analysis.job] Processing ${type} for user ${userId}`)
      await job.updateProgress(10)

      let result: unknown
      switch (type) {
        case 'developer_dna':
          await job.updateProgress(20)
          result = await generateDeveloperDNA(userId)
          break
        case 'portfolio_score':
          await job.updateProgress(20)
          result = await generatePortfolioScore(userId)
          break
        case 'recruiter_report':
          await job.updateProgress(20)
          result = await generateRecruiterReport(userId)
          break
        case 'career_report':
          await job.updateProgress(20)
          result = await generateCareerReport(userId)
          break
        case 'timeline':
          await job.updateProgress(20)
          result = await generatePortfolioTimeline(userId)
          break
        case 'mentor_report':
          await job.updateProgress(20)
          result = await generateMentorReport(userId)
          break
        default:
          throw new Error(`Unknown analysis type: ${type}`)
      }

      await job.updateProgress(90)

      const typeLabels: Record<string, string> = {
        developer_dna: 'Developer DNA',
        portfolio_score: 'Portfolio Score',
        recruiter_report: 'AI Recruiter Report',
        career_report: 'Career Readiness',
        timeline: 'Portfolio Timeline',
        mentor_report: 'AI Mentor Report',
      }
      await createNotification(
        userId,
        'analysis_complete',
        `${typeLabels[type] ?? type} Ready`,
        `Your ${typeLabels[type] ?? type} analysis is complete and ready to view.`,
        { reportType: type }
      )

      await job.updateProgress(100)
      return result
    },
    {
      connection: getConnectionOpts(),
      concurrency: 3,
      limiter: { max: 10, duration: 60000 },
    }
  )

  worker.on('completed', (job) => {
    console.log(`[analysis.job] ✅ Job ${job.id} (${job.data.type}) completed`)
  })
  worker.on('failed', (job, err) => {
    console.error(`[analysis.job] ❌ Job ${job?.id} (${job?.data?.type}) failed:`, err.message)
  })

  return worker
}
