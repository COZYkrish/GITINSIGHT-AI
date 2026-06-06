import { Router, Request, Response } from 'express'
import { FEATURES } from '../config/features'

const router = Router()

/**
 * GET /api/config/features
 * Returns the active feature flags (public — no auth required so the frontend
 * can conditionally render nav items before the user logs in).
 */
router.get('/features', (_req: Request, res: Response) => {
  res.json(FEATURES)
})

export default router
