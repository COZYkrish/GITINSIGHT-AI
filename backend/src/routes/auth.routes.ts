import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { registerUser, loginUser } from '../services/auth.service'
import { env } from '../config/env'
import { exchangeCodeForToken, fetchAndStoreGitHubData } from '../services/github.service'
import { User } from '../models/User'
import { generateToken } from '../services/auth.service'
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware'

const router = Router()

const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

router.post('/register', async (req: Request, res: Response) => {
  try {
    const body = RegisterSchema.parse(req.body)
    const { user, token } = await registerUser(body.name, body.email, body.password)
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, onboardingComplete: user.onboardingComplete }
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Registration failed'
    res.status(400).json({ error: msg })
  }
})

router.post('/login', async (req: Request, res: Response) => {
  try {
    const body = LoginSchema.parse(req.body)
    const { user, token } = await loginUser(body.email, body.password)
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, githubConnected: user.githubConnected, onboardingComplete: user.onboardingComplete }
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Login failed'
    res.status(401).json({ error: msg })
  }
})

import { Octokit } from '@octokit/rest'

// GitHub OAuth redirect (No auth required to start login)
router.get('/github', (req: Request, res: Response) => {
  const url = `https://github.com/login/oauth/authorize?client_id=${env.GITHUB_CLIENT_ID}&scope=read:user,repo,user:email`
  res.json({ url })
})

// GitHub OAuth callback
router.get('/github/callback', async (req: Request, res: Response) => {
  const { code } = req.query as { code: string }
  
  try {
    const accessToken = await exchangeCodeForToken(code)
    
    // Fetch GitHub user
    const octokit = new Octokit({ auth: accessToken })
    const { data: ghUser } = await octokit.users.getAuthenticated()
    
    // Check if user exists by githubId
    let user = await User.findOne({ githubId: ghUser.id.toString() })
    
    if (!user) {
      // Fallback: check by email
      const { data: emails } = await octokit.users.listEmailsForAuthenticatedUser()
      const primaryEmail = emails.find(e => e.primary)?.email || emails[0]?.email
      
      if (!primaryEmail) throw new Error('No email found on GitHub account')
      
      user = await User.findOne({ email: primaryEmail })
      
      if (!user) {
        // Create new user
        user = new User({
          name: ghUser.name || ghUser.login,
          email: primaryEmail,
          passwordHash: Math.random().toString(36).slice(-8),
          githubConnected: true,
          githubId: ghUser.id.toString(),
          githubAccessToken: accessToken
        })
        await user.save()
      } else {
        // Link existing account
        user.githubId = ghUser.id.toString()
        user.githubConnected = true
        user.githubAccessToken = accessToken
        await user.save()
      }
    } else {
      user.githubAccessToken = accessToken
      await user.save()
    }
    
    // Trigger sync in background
    fetchAndStoreGitHubData(user._id.toString(), accessToken).catch(e => console.error('Background sync failed:', e))
    
    const token = generateToken({ userId: user._id.toString(), email: user.email })
    res.redirect(`${env.FRONTEND_URL}/repository-sync?token=${token}`)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'OAuth failed'
    res.redirect(`${env.FRONTEND_URL}/login?error=${encodeURIComponent(msg)}`)
  }
})

// Get current user
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash -githubAccessToken')
    if (!user) { res.status(404).json({ error: 'User not found' }); return }
    res.json(user)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
