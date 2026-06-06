import { Router, Response, Request } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware'
import { User } from '../models/User'
import { getMonthlyUsage } from '../services/ai/tokenTracker'
import { FEATURES } from '../config/features'

const router = Router()

// Public: feature flags
router.get('/features', (_req: Request, res: Response) => {
  res.json(FEATURES)
})

// Authenticated user routes
router.get('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.userId).select('-passwordHash -githubAccessToken')
  res.json(user)
})

router.patch('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  const allowed = ['name', 'publicProfileEnabled', 'publicProfileSlug']
  const updates: Record<string, unknown> = {}
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key]
  }
  const user = await User.findByIdAndUpdate(req.userId, updates, { new: true }).select('-passwordHash -githubAccessToken')
  res.json(user)
})

router.get('/ai-usage', authMiddleware, async (req: AuthRequest, res: Response) => {
  const usage = await getMonthlyUsage(req.userId!)
  res.json(usage)
})

router.delete('/account', authMiddleware, async (req: AuthRequest, res: Response) => {
  await User.findByIdAndDelete(req.userId)
  res.json({ success: true })
})

export default router
