import { Queue, Worker, Job } from 'bullmq'
import { env } from '../config/env'

// BullMQ uses its own bundled ioredis — pass connection URL string
// instead of an IORedis instance to avoid version conflicts.
const connection = { connection: { host: '', port: 0, lazyConnect: true } }

function getConnectionOpts() {
  // Parse redis URL → { host, port, password }
  try {
    const url = new URL(env.REDIS_URL)
    return {
      connection: {
        host: url.hostname,
        port: parseInt(url.port || '6379'),
        password: url.password || undefined,
        tls: url.protocol === 'rediss:' ? {} : undefined,
      }
    }
  } catch {
    return { connection: { host: 'localhost', port: 6379 } }
  }
}

// ── Queue definitions ──────────────────────────────────────────────────────
let analysisQueue: Queue | null = null
let wrappedQueue: Queue | null = null
let resumeQueue: Queue | null = null
let portfolioQueue: Queue | null = null

const defaultJobOptions = {
  attempts: 3,
  backoff: { type: 'exponential' as const, delay: 5000 },
  removeOnComplete: { age: 3600, count: 100 },
  removeOnFail: { age: 86400 },
}

export function getAnalysisQueue(): Queue | null {
  if (env.ENABLE_BACKGROUND_JOBS !== 'true') return null
  if (!analysisQueue) {
    try { analysisQueue = new Queue('analysis', { ...getConnectionOpts(), defaultJobOptions }) }
    catch { return null }
  }
  return analysisQueue
}

export function getWrappedQueue(): Queue | null {
  if (env.ENABLE_BACKGROUND_JOBS !== 'true') return null
  if (!wrappedQueue) {
    try { wrappedQueue = new Queue('wrapped', { ...getConnectionOpts(), defaultJobOptions: { ...defaultJobOptions, attempts: 2 } }) }
    catch { return null }
  }
  return wrappedQueue
}

export function getResumeQueue(): Queue | null {
  if (env.ENABLE_BACKGROUND_JOBS !== 'true') return null
  if (!resumeQueue) {
    try { resumeQueue = new Queue('resume', { ...getConnectionOpts(), defaultJobOptions }) }
    catch { return null }
  }
  return resumeQueue
}

export function getPortfolioQueue(): Queue | null {
  if (env.ENABLE_BACKGROUND_JOBS !== 'true') return null
  if (!portfolioQueue) {
    try { portfolioQueue = new Queue('portfolio', { ...getConnectionOpts(), defaultJobOptions }) }
    catch { return null }
  }
  return portfolioQueue
}

// ── Enqueue helpers ────────────────────────────────────────────────────────
export async function enqueueAnalysis(userId: string, type: string): Promise<string | null> {
  const q = getAnalysisQueue()
  if (!q) return null
  const job = await q.add(type, { userId, type }, { jobId: `${type}-${userId}-${Date.now()}` })
  return job.id ?? null
}

export async function enqueueWrapped(userId: string, year: number): Promise<string | null> {
  const q = getWrappedQueue()
  if (!q) return null
  const job = await q.add('wrapped', { userId, year }, { jobId: `wrapped-${userId}-${year}` })
  return job.id ?? null
}

export async function enqueueResume(userId: string, resumeType: string): Promise<string | null> {
  const q = getResumeQueue()
  if (!q) return null
  const job = await q.add('resume', { userId, resumeType }, { jobId: `resume-${userId}-${Date.now()}` })
  return job.id ?? null
}

export async function enqueuePortfolio(userId: string): Promise<string | null> {
  const q = getPortfolioQueue()
  if (!q) return null
  const job = await q.add('portfolio-generator', { userId }, { jobId: `portfolio-${userId}-${Date.now()}` })
  return job.id ?? null
}

// ── Job status helper ──────────────────────────────────────────────────────
export async function getJobStatus(jobId: string): Promise<{
  status: string
  progress: number
  result?: unknown
  error?: string
  queueName?: string
} | null> {
  const queues = [
    { name: 'analysis', q: getAnalysisQueue() },
    { name: 'wrapped', q: getWrappedQueue() },
    { name: 'resume', q: getResumeQueue() },
    { name: 'portfolio', q: getPortfolioQueue() },
  ]

  for (const { name, q } of queues) {
    if (!q) continue
    try {
      const job = await Job.fromId(q, jobId)
      if (!job) continue
      const state = await job.getState()
      const progress = typeof job.progress === 'number' ? job.progress : 0
      return {
        status: state,
        progress,
        result: state === 'completed' ? job.returnvalue : undefined,
        error: state === 'failed' ? (job.failedReason ?? 'Unknown error') : undefined,
        queueName: name,
      }
    } catch { continue }
  }
  return null
}
