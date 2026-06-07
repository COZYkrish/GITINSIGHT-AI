import { Router, Response } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware'
import {
  generateDeveloperDNA,
  generatePortfolioScore,
  generateRecruiterReport,
  generateCareerReport,
  generateWrappedReport,
  generateMentorReport,
  generateLinkedInContent,
  generateResume,
  generateReadmeAnalysis,
  generateRepositoryCompare,
  generatePortfolioTimeline,
  generatePortfolioContent,
} from '../services/analysis.service'
import { DeveloperDNA } from '../models/DeveloperDNA'
import { PortfolioScore } from '../models/PortfolioScore'
import { RecruiterReport } from '../models/RecruiterReport'
import { CareerReport } from '../models/CareerReport'
import { WrappedReport } from '../models/WrappedReport'
import { MentorReport } from '../models/MentorReport'
import { GeneratedResume } from '../models/GeneratedResume'
import { ReadmeReport } from '../models/ReadmeReport'
import { PortfolioTimeline } from '../models/PortfolioTimeline'
import { User } from '../models/User'

const router = Router()
router.use(authMiddleware)

// ── Analysis triggers (POST = generate new) ──
router.post('/developer-dna', async (req: AuthRequest, res: Response) => {
  try {
    const result = await generateDeveloperDNA(req.userId!)
    // Mark onboarding complete if needed
    await User.findByIdAndUpdate(req.userId, { onboardingComplete: true })
    res.json(result)
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Analysis failed' })
  }
})

router.post('/portfolio-score', async (req: AuthRequest, res: Response) => {
  try {
    const result = await generatePortfolioScore(req.userId!)
    res.json(result)
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Analysis failed' })
  }
})

router.post('/recruiter', async (req: AuthRequest, res: Response) => {
  try {
    const result = await generateRecruiterReport(req.userId!)
    res.json(result)
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Analysis failed' })
  }
})

router.post('/career', async (req: AuthRequest, res: Response) => {
  try {
    const result = await generateCareerReport(req.userId!)
    res.json(result)
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Analysis failed' })
  }
})

router.post('/wrapped/:year', async (req: AuthRequest, res: Response) => {
  try {
    const year = parseInt(String(req.params.year)) || new Date().getFullYear()
    const result = await generateWrappedReport(req.userId!, year)
    res.json(result)
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Analysis failed' })
  }
})

router.post('/mentor', async (req: AuthRequest, res: Response) => {
  try {
    const result = await generateMentorReport(req.userId!)
    res.json(result)
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Analysis failed' })
  }
})

router.post('/linkedin', async (req: AuthRequest, res: Response) => {
  try {
    const { type, repositoryId } = req.body
    if (!type) { res.status(400).json({ error: 'type is required' }); return }
    const result = await generateLinkedInContent(req.userId!, type, repositoryId)
    res.json(result)
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Generation failed' })
  }
})

router.post('/resume', async (req: AuthRequest, res: Response) => {
  try {
    const { type } = req.body
    if (!type) { res.status(400).json({ error: 'type is required' }); return }
    const result = await generateResume(req.userId!, type)
    res.json(result)
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Generation failed' })
  }
})

router.post('/readme', async (req: AuthRequest, res: Response) => {
  try {
    const { repositoryId } = req.body
    if (!repositoryId) { res.status(400).json({ error: 'repositoryId is required' }); return }
    const result = await generateReadmeAnalysis(req.userId!, repositoryId)
    res.json(result)
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Analysis failed' })
  }
})

router.post('/compare', async (req: AuthRequest, res: Response) => {
  try {
    const { repoAId, repoBId } = req.body
    if (!repoAId || !repoBId) { res.status(400).json({ error: 'repoAId and repoBId are required' }); return }
    const result = await generateRepositoryCompare(req.userId!, repoAId, repoBId)
    res.json(result)
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Analysis failed' })
  }
})

router.post('/timeline', async (req: AuthRequest, res: Response) => {
  try {
    const result = await generatePortfolioTimeline(req.userId!)
    res.json(result)
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Timeline generation failed' })
  }
})

router.post('/portfolio-generator', async (req: AuthRequest, res: Response) => {
  try {
    const result = await generatePortfolioContent(req.userId!)
    res.json(result)
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Portfolio generation failed' })
  }
})

// ── Report retrieval (GET = fetch saved) ──
router.get('/developer-dna', async (req: AuthRequest, res: Response) => {
  const data = await DeveloperDNA.findOne({ userId: req.userId })
  res.json(data || null)
})

router.get('/portfolio-score', async (req: AuthRequest, res: Response) => {
  const data = await PortfolioScore.findOne({ userId: req.userId })
  res.json(data || null)
})

router.get('/recruiter', async (req: AuthRequest, res: Response) => {
  const data = await RecruiterReport.findOne({ userId: req.userId })
  res.json(data || null)
})

router.get('/career', async (req: AuthRequest, res: Response) => {
  const data = await CareerReport.findOne({ userId: req.userId })
  res.json(data || null)
})

router.get('/wrapped/:year', async (req: AuthRequest, res: Response) => {
  const year = parseInt(String(req.params.year)) || new Date().getFullYear()
  const data = await WrappedReport.findOne({ userId: req.userId, year })
  res.json(data || null)
})

router.get('/mentor', async (req: AuthRequest, res: Response) => {
  const data = await MentorReport.findOne({ userId: req.userId })
  res.json(data || null)
})

router.get('/resume/:type', async (req: AuthRequest, res: Response) => {
  const type = String(req.params.type) as 'ats' | 'fullstack' | 'frontend' | 'ai'
  const data = await GeneratedResume.findOne({ userId: req.userId, type })
  res.json(data || null)
})

router.get('/readme/:repositoryId', async (req: AuthRequest, res: Response) => {
  const data = await ReadmeReport.findOne({ userId: req.userId, repositoryId: req.params.repositoryId })
  res.json(data || null)
})

router.get('/timeline', async (req: AuthRequest, res: Response) => {
  const data = await PortfolioTimeline.findOne({ userId: req.userId })
  res.json(data || null)
})

export default router
