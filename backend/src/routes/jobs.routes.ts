import { Router, Request, Response } from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import { getJobStatus } from '../jobs/queue.setup'

const router = Router()

/**
 * GET /api/jobs/:jobId
 * Returns the current status and progress of a BullMQ job.
 */
router.get('/:jobId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params as { jobId: string }
    const status = await getJobStatus(jobId)
    if (!status) {
      return res.status(404).json({ error: 'Job not found' })
    }
    return res.json(status)
  } catch (err) {
    console.error('[jobs.routes] getJobStatus error:', err)
    return res.status(500).json({ error: 'Failed to get job status' })
  }
})

export default router
