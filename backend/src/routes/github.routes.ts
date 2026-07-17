import { Router, Response } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware'
import { getGitHubProfile, getRepositories, fetchAndStoreGitHubData, isCacheValid } from '../services/github.service'
import { User } from '../models/User'
import { createNotification } from '../services/notification.service'

const router = Router()
router.use(authMiddleware)

router.get('/profile', async (req: AuthRequest, res: Response) => {
  try {
    const profile = await getGitHubProfile(req.userId!)
    if (!profile) { res.status(404).json({ error: 'GitHub not connected' }); return }
    res.json(profile)
  } catch { res.status(500).json({ error: 'Failed to fetch profile' }) }
})

router.get('/repositories', async (req: AuthRequest, res: Response) => {
  try {
    const repos = await getRepositories(req.userId!)
    res.json(repos)
  } catch { res.status(500).json({ error: 'Failed to fetch repositories' }) }
})

router.post('/sync', async (req: AuthRequest, res: Response) => {
  // try {
  //   const user = await User.findById(req.userId)
  //   if (!user?.githubAccessToken) { res.status(400).json({ error: 'GitHub not connected' }); return }

  //   const result = await fetchAndStoreGitHubData(req.userId!, user.githubAccessToken)
  //   await createNotification(req.userId!, 'sync_complete', '✅ GitHub Synced',
  //     `Discovered ${result.repoCount} repositories`)

  res.json({ success: true, repoCount: result.repoCount })
} catch (err: unknown) {
  const msg = err instanceof Error ? err.message : 'Sync failed'
  res.status(500).json({ error: msg })
}
})

router.get('/cache-status', async (req: AuthRequest, res: Response) => {
  try {
    const profile = await getGitHubProfile(req.userId!)
    const valid = await isCacheValid(req.userId!)
    res.json({
      lastSyncedAt: profile?.lastSyncedAt,
      isValid: valid,
      ageHours: profile?.lastSyncedAt
        ? Math.round((Date.now() - profile.lastSyncedAt.getTime()) / (1000 * 60 * 60) * 10) / 10
        : null,
    })
  } catch { res.status(500).json({ error: 'Failed to check cache' }) }
})

export default router
