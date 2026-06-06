import { z } from 'zod'
import { geminiService } from './ai/gemini.service'
import { recordTokenUsage } from './ai/tokenTracker'
import { createNotification } from './notification.service'
import { buildDeveloperDNAPrompt } from '../prompts/developerDNA.prompt'
import { buildPortfolioPrompt } from '../prompts/portfolio.prompt'
import { buildRecruiterPrompt } from '../prompts/recruiter.prompt'
import { buildCareerPrompt } from '../prompts/career.prompt'
import { buildWrappedPrompt } from '../prompts/wrapped.prompt'
import { buildMentorPrompt } from '../prompts/mentor.prompt'
import { buildTimelinePrompt } from '../prompts/timeline.prompt'
import { buildPortfolioGeneratorPrompt } from '../prompts/portfolioGenerator.prompt'
import { buildReadmePrompt } from '../prompts/readme.prompt'
import { buildLinkedInPrompt } from '../prompts/linkedin.prompt'
import { buildResumePrompt } from '../prompts/resume.prompt'
import { buildRepositoryComparePrompt } from '../prompts/repositoryCompare.prompt'
import { DeveloperDNA } from '../models/DeveloperDNA'
import { PortfolioScore } from '../models/PortfolioScore'
import { RecruiterReport } from '../models/RecruiterReport'
import { CareerReport } from '../models/CareerReport'
import { WrappedReport } from '../models/WrappedReport'
import { MentorReport } from '../models/MentorReport'
import { PortfolioTimeline } from '../models/PortfolioTimeline'
import { ReadmeReport } from '../models/ReadmeReport'
import { LinkedInGeneration } from '../models/LinkedInGeneration'
import { GeneratedResume } from '../models/GeneratedResume'
import { getGitHubProfile, getRepositories } from './github.service'

// ──────────────────────────────────────────────
// Developer DNA
// ──────────────────────────────────────────────
const DNASchema = z.object({
  archetype: z.string(),
  archetypeEmoji: z.string().default('🧬'),
  description: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  recommendedRoles: z.array(z.string()),
  recommendedTechnologies: z.array(z.string()),
  recommendedProjects: z.array(z.string()),
  careerTrajectory: z.string(),
  personalityTraits: z.array(z.object({ trait: z.string(), score: z.number() })),
  compatibleArchetypes: z.array(z.string()),
})

const DNAFallback = {
  archetype: 'The Developer',
  archetypeEmoji: '💻',
  description: 'A dedicated software developer building meaningful projects.',
  strengths: ['Problem solving', 'Code writing', 'Learning'],
  weaknesses: ['Documentation', 'Testing'],
  recommendedRoles: ['Software Engineer', 'Full Stack Developer'],
  recommendedTechnologies: ['TypeScript', 'React', 'Node.js'],
  recommendedProjects: ['Build a portfolio site', 'Contribute to open source'],
  careerTrajectory: 'Growing developer with strong fundamentals.',
  personalityTraits: [{ trait: 'Builder', score: 80 }],
  compatibleArchetypes: ['The Product Engineer'],
}

export async function generateDeveloperDNA(userId: string) {
  const [profile, repos] = await Promise.all([getGitHubProfile(userId), getRepositories(userId)])
  if (!profile) throw new Error('GitHub profile not connected')

  const accountAge = profile.accountCreatedAt
    ? `${Math.floor((Date.now() - profile.accountCreatedAt.getTime()) / (1000 * 60 * 60 * 24 * 365))} years`
    : 'Unknown'

  const prompt = buildDeveloperDNAPrompt({
    username: profile.username,
    repositories: repos.map(r => ({
      name: r.name, language: r.language || 'Unknown', stars: r.stars,
      description: r.description || '', topics: r.topics, commitCount: r.commitCount,
    })),
    languages: profile.languages,
    totalStars: profile.totalStars,
    followers: profile.followers,
    accountAge,
  })

  const { data, tokens } = await geminiService.generateStructured(prompt, DNASchema, DNAFallback)
  await recordTokenUsage(userId, 'developer_dna', tokens)

  const result = await DeveloperDNA.findOneAndUpdate(
    { userId },
    { userId, ...data, generatedAt: new Date() },
    { upsert: true, new: true }
  )

  await createNotification(userId, 'analysis_complete', '🧬 Developer DNA Ready', 
    `Your archetype: ${data.archetype}`, { reportType: 'developer_dna' })

  return result
}

// ──────────────────────────────────────────────
// Portfolio Score
// ──────────────────────────────────────────────
const PortfolioSchema = z.object({
  overallScore: z.number(),
  projectQuality: z.number(),
  documentation: z.number(),
  consistency: z.number(),
  technicalDiversity: z.number(),
  innovation: z.number(),
  breakdown: z.record(z.string(), z.unknown()),
  suggestions: z.array(z.string()),
  aiExplanation: z.string(),
})

const PortfolioFallback = {
  overallScore: 50, projectQuality: 50, documentation: 40, consistency: 55,
  technicalDiversity: 60, innovation: 45, breakdown: {},
  suggestions: ['Add README files', 'Deploy projects', 'Add descriptions'],
  aiExplanation: 'Portfolio analysis unavailable. Please try again.',
}

export async function generatePortfolioScore(userId: string) {
  const [profile, repos] = await Promise.all([getGitHubProfile(userId), getRepositories(userId)])
  if (!profile) throw new Error('GitHub profile not connected')

  const prompt = buildPortfolioPrompt({
    username: profile.username,
    repositories: repos.map(r => ({
      name: r.name, language: r.language || 'Unknown', stars: r.stars, forks: r.forks,
      description: r.description || '', hasReadme: r.hasReadme,
      readmeLength: r.readmeLength, topics: r.topics,
      homepage: r.homepage || '', commitCount: r.commitCount,
      pushedAt: r.pushedAt?.toISOString() || '',
    })),
    languages: profile.languages,
    totalRepos: profile.publicRepos,
  })

  const { data, tokens } = await geminiService.generateStructured(prompt, PortfolioSchema, PortfolioFallback)
  await recordTokenUsage(userId, 'portfolio_score', tokens)

  const result = await PortfolioScore.findOneAndUpdate(
    { userId },
    { userId, ...data, generatedAt: new Date() },
    { upsert: true, new: true }
  )

  await createNotification(userId, 'analysis_complete', '📊 Portfolio Score Ready',
    `Your portfolio scored ${data.overallScore}/100`, { reportType: 'portfolio_score' })

  return result
}

// ──────────────────────────────────────────────
// Recruiter Report
// ──────────────────────────────────────────────
const RecruiterSchema = z.object({
  verdict: z.string(),
  hiringProbability: z.number(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  technicalEval: z.object({ score: z.number(), notes: z.string() }),
  communicationEval: z.object({ score: z.number(), notes: z.string() }),
  portfolioEval: z.object({ score: z.number(), notes: z.string() }),
  seniorPerspective: z.string(),
  startupPerspective: z.string(),
  fullReport: z.string(),
})

const RecruiterFallback = {
  verdict: 'Lean Hire', hiringProbability: 55,
  strengths: ['Shows initiative', 'Active on GitHub'],
  weaknesses: ['Limited documentation', 'Few deployed projects'],
  technicalEval: { score: 60, notes: 'Technical skills are present.' },
  communicationEval: { score: 50, notes: 'Documentation could be improved.' },
  portfolioEval: { score: 55, notes: 'Portfolio shows potential.' },
  seniorPerspective: 'Shows promise but needs more production experience.',
  startupPerspective: 'Could fit a small team with mentorship.',
  fullReport: 'Analysis temporarily unavailable. Please regenerate.',
}

export async function generateRecruiterReport(userId: string) {
  const [profile, repos] = await Promise.all([getGitHubProfile(userId), getRepositories(userId)])
  if (!profile) throw new Error('GitHub profile not connected')

  const accountAge = profile.accountCreatedAt
    ? `${Math.floor((Date.now() - profile.accountCreatedAt.getTime()) / (1000 * 60 * 60 * 24 * 365))} years`
    : 'Unknown'

  const prompt = buildRecruiterPrompt({
    username: profile.username, bio: profile.bio, location: profile.location,
    followers: profile.followers, publicRepos: profile.publicRepos,
    totalStars: profile.totalStars, languages: profile.languages,
    repositories: repos.map(r => ({
      name: r.name, language: r.language || 'Unknown', stars: r.stars,
      description: r.description || '', hasReadme: r.hasReadme,
      homepage: r.homepage || '', topics: r.topics,
    })),
    accountAge,
  })

  const { data, tokens } = await geminiService.generateStructured(prompt, RecruiterSchema, RecruiterFallback)
  await recordTokenUsage(userId, 'recruiter_report', tokens)

  const result = await RecruiterReport.findOneAndUpdate(
    { userId },
    { userId, ...data, generatedAt: new Date() },
    { upsert: true, new: true }
  )

  await createNotification(userId, 'analysis_complete', '🎯 Recruiter Report Ready',
    `Verdict: ${data.verdict} (${data.hiringProbability}% hiring probability)`, { reportType: 'recruiter' })

  return result
}

// ──────────────────────────────────────────────
// Career Report
// ──────────────────────────────────────────────
const CareerSchema = z.object({
  overallReadiness: z.number(),
  roles: z.array(z.object({
    name: z.string(), matchPercentage: z.number(),
    skillGaps: z.array(z.string()), hiringReadiness: z.string(),
    timeline: z.string(), growthOpportunities: z.array(z.string()),
  })),
})

const CareerFallback = {
  overallReadiness: 60,
  roles: [
    { name: 'Full Stack Developer', matchPercentage: 65, skillGaps: ['Testing', 'DevOps'],
      hiringReadiness: 'Junior level', timeline: '6 months', growthOpportunities: ['Deploy projects'] },
  ],
}

export async function generateCareerReport(userId: string) {
  const [profile, repos] = await Promise.all([getGitHubProfile(userId), getRepositories(userId)])
  if (!profile) throw new Error('GitHub profile not connected')

  const accountAge = profile.accountCreatedAt
    ? `${Math.floor((Date.now() - profile.accountCreatedAt.getTime()) / (1000 * 60 * 60 * 24 * 365))} years`
    : 'Unknown'

  const prompt = buildCareerPrompt({
    username: profile.username, languages: profile.languages,
    repositories: repos.map(r => ({
      name: r.name, language: r.language || '', stars: r.stars,
      description: r.description || '', topics: r.topics,
    })),
    totalStars: profile.totalStars, accountAge,
  })

  const { data, tokens } = await geminiService.generateStructured(prompt, CareerSchema, CareerFallback)
  await recordTokenUsage(userId, 'career_report', tokens)

  const result = await CareerReport.findOneAndUpdate(
    { userId },
    { userId, ...data, generatedAt: new Date() },
    { upsert: true, new: true }
  )

  await createNotification(userId, 'report_ready', '🚀 Career Readiness Report Ready',
    `Overall readiness: ${data.overallReadiness}%`, { reportType: 'career' })

  return result
}

// ──────────────────────────────────────────────
// Wrapped Report
// ──────────────────────────────────────────────
const WrappedSchema = z.object({
  projectsBuilt: z.number(),
  totalCommits: z.number(),
  starsEarned: z.number(),
  mostActiveMonth: z.string(),
  favoriteLanguage: z.string(),
  mostUsedFramework: z.string(),
  longestStreak: z.number(),
  developerPersonality: z.string(),
  highlights: z.array(z.object({ title: z.string(), description: z.string(), icon: z.string() })),
})

const WrappedFallback = {
  projectsBuilt: 5, totalCommits: 200, starsEarned: 10,
  mostActiveMonth: 'October', favoriteLanguage: 'JavaScript',
  mostUsedFramework: 'React', longestStreak: 7,
  developerPersonality: 'The Dedicated Builder',
  highlights: [{ title: 'Keep Building', description: 'A great year of development', icon: '🚀' }],
}

export async function generateWrappedReport(userId: string, year: number) {
  const [profile, repos] = await Promise.all([getGitHubProfile(userId), getRepositories(userId)])
  if (!profile) throw new Error('GitHub profile not connected')

  const prompt = buildWrappedPrompt({
    username: profile.username,
    year,
    repositories: repos.map(r => ({
      name: r.name, language: r.language || 'Unknown', stars: r.stars,
      createdAt: r.createdAt?.toISOString() || new Date().toISOString(),
      pushedAt: r.pushedAt?.toISOString() || new Date().toISOString(),
    })),
    languages: profile.languages,
    totalStars: profile.totalStars,
    followers: profile.followers,
    totalCommits: profile.totalContributions || 0,
    longestStreak: profile.longestStreak || 0,
  })

  const { data, tokens } = await geminiService.generateStructured(prompt, WrappedSchema, WrappedFallback)
  await recordTokenUsage(userId, 'wrapped_report', tokens)

  const result = await WrappedReport.findOneAndUpdate(
    { userId, year },
    { userId, year, ...data, generatedAt: new Date() },
    { upsert: true, new: true }
  )

  await createNotification(userId, 'report_ready', `🎉 GitHub Wrapped ${year} Ready`,
    `You built ${data.projectsBuilt} projects. You are: ${data.developerPersonality}`, { reportType: 'wrapped' })

  return result
}

// ──────────────────────────────────────────────
// Mentor Report
// ──────────────────────────────────────────────
const MentorSchema = z.object({
  developerLevel: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  feedback: z.string(),
  learningRoadmap: z.array(z.object({ phase: z.string(), duration: z.string(), topics: z.array(z.string()) })),
  recommendedTech: z.array(z.string()),
  recommendedProjects: z.array(z.string()),
  weeklyGoals: z.array(z.string()),
  monthlyRoadmap: z.array(z.string()),
})

const MentorFallback = {
  developerLevel: 'Mid-Level Developer', strengths: ['Problem solving', 'Building'],
  weaknesses: ['Testing', 'Documentation'],
  feedback: 'You are on a good path. Keep building projects and focusing on code quality.',
  learningRoadmap: [{ phase: 'Phase 1', duration: '3 months', topics: ['TypeScript', 'Testing'] }],
  recommendedTech: ['TypeScript', 'Docker', 'PostgreSQL'],
  recommendedProjects: ['Build a SaaS product', 'Contribute to open source'],
  weeklyGoals: ['Code daily', 'Read documentation'],
  monthlyRoadmap: ['Month 1: Master TypeScript', 'Month 2: Build a full project'],
}

export async function generateMentorReport(userId: string) {
  const [profile, repos] = await Promise.all([getGitHubProfile(userId), getRepositories(userId)])
  if (!profile) throw new Error('GitHub profile not connected')

  const accountAge = profile.accountCreatedAt
    ? `${Math.floor((Date.now() - profile.accountCreatedAt.getTime()) / (1000 * 60 * 60 * 24 * 365))} years`
    : 'Unknown'

  const prompt = buildMentorPrompt({
    username: profile.username, languages: profile.languages,
    repositories: repos.map(r => ({
      name: r.name, language: r.language || '', stars: r.stars,
      description: r.description || '', topics: r.topics,
    })),
    totalStars: profile.totalStars, accountAge,
  })

  const { data, tokens } = await geminiService.generateStructured(prompt, MentorSchema, MentorFallback)
  await recordTokenUsage(userId, 'mentor_report', tokens)

  const result = await MentorReport.findOneAndUpdate(
    { userId },
    { userId, ...data, generatedAt: new Date() },
    { upsert: true, new: true }
  )

  return result
}

// ──────────────────────────────────────────────
// LinkedIn Content
// ──────────────────────────────────────────────
export async function generateLinkedInContent(userId: string, type: string, repositoryId?: string) {
  const [profile, repos] = await Promise.all([getGitHubProfile(userId), getRepositories(userId)])
  if (!profile) throw new Error('GitHub profile not connected')

  const repo = repositoryId ? repos.find(r => r._id.toString() === repositoryId) : undefined

  const prompt = buildLinkedInPrompt({
    type, username: profile.username,
    repository: repo ? {
      name: repo.name, description: repo.description || '', language: repo.language || '',
      stars: repo.stars, topics: repo.topics, homepage: repo.homepage || '',
    } : undefined,
    languages: profile.languages, totalStars: profile.totalStars,
  })

  const LinkedInSchema = z.object({ type: z.string(), content: z.string(), tips: z.array(z.string()) })
  const { data, tokens } = await geminiService.generateStructured(
    prompt, LinkedInSchema, { type, content: 'Content generation failed. Please retry.', tips: [] }
  )
  await recordTokenUsage(userId, 'linkedin_generator', tokens)

  return LinkedInGeneration.create({
    userId, type, repositoryId, content: data.content, prompt,
  })
}

// ──────────────────────────────────────────────
// Resume Generation
// ──────────────────────────────────────────────
export async function generateResume(userId: string, type: string) {
  const [profile, repos] = await Promise.all([getGitHubProfile(userId), getRepositories(userId)])
  if (!profile) throw new Error('GitHub profile not connected')

  const user = await import('../models/User').then(m => m.User.findById(userId))

  const prompt = buildResumePrompt({
    type, username: profile.username, name: user?.name || profile.username,
    bio: profile.bio, location: profile.location, languages: profile.languages,
    repositories: repos.map(r => ({
      name: r.name, description: r.description || '', language: r.language || '',
      stars: r.stars, topics: r.topics, homepage: r.homepage || '',
    })),
    totalStars: profile.totalStars,
  })

  const ResumeSchema = z.object({
    resumeScore: z.number(),
    recruiterOptimization: z.array(z.string()),
    content: z.record(z.string(), z.unknown()),
  })

  const { data, tokens } = await geminiService.generateStructured(
    prompt, ResumeSchema,
    { resumeScore: 50, recruiterOptimization: [], content: {} }
  )
  await recordTokenUsage(userId, 'resume_builder', tokens)

  const resumeType = type as 'ats' | 'fullstack' | 'frontend' | 'ai'
  const result = await GeneratedResume.findOneAndUpdate(
    { userId, type: resumeType },
    { userId, type: resumeType, content: data.content, resumeScore: data.resumeScore, recruiterOptimization: data.recruiterOptimization, generatedAt: new Date() },
    { upsert: true, new: true }
  )

  await createNotification(userId, 'report_ready', '📄 Resume Generated',
    `Your ${type} resume is ready (Score: ${data.resumeScore}/100)`, { reportType: 'resume' })

  return result
}

// ──────────────────────────────────────────────
// Portfolio Timeline
// ──────────────────────────────────────────────
const TimelineSchema = z.object({
  milestones: z.array(z.object({
    year: z.number(), month: z.number(), title: z.string(),
    description: z.string(), type: z.enum(['project', 'technology', 'achievement']),
    impact: z.string(),
  })),
  technologyEvolution: z.array(z.object({
    year: z.number(), technologies: z.array(z.string()),
  })),
})

const TimelineFallback = {
  milestones: [
    { year: 2023, month: 1, title: 'Started Coding', description: 'Began the software development journey', type: 'achievement' as const, impact: 'Foundation' },
    { year: 2024, month: 6, title: 'Built First Full-Stack App', description: 'Deployed a complete web application', type: 'project' as const, impact: 'Major milestone' },
  ],
  technologyEvolution: [
    { year: 2023, technologies: ['HTML', 'CSS', 'JavaScript'] },
    { year: 2024, technologies: ['React', 'Node.js', 'MongoDB'] },
  ],
}

export async function generatePortfolioTimeline(userId: string) {
  const [profile, repos] = await Promise.all([getGitHubProfile(userId), getRepositories(userId)])
  if (!profile) throw new Error('GitHub profile not connected')

  const prompt = buildTimelinePrompt({
    username: profile.username,
    repositories: repos.map(r => ({
      name: r.name, language: r.language || '', stars: r.stars,
      description: r.description || '', topics: r.topics,
      createdAt: r.createdAt?.toISOString() || new Date().toISOString(),
      pushedAt: r.pushedAt?.toISOString() || new Date().toISOString(),
    })),
    languages: profile.languages,
  })

  const { data, tokens } = await geminiService.generateStructured(prompt, TimelineSchema, TimelineFallback)
  await recordTokenUsage(userId, 'portfolio_timeline', tokens)

  const result = await PortfolioTimeline.findOneAndUpdate(
    { userId },
    { userId, milestones: data.milestones, technologyEvolution: data.technologyEvolution, generatedAt: new Date() },
    { upsert: true, new: true }
  )

  return result
}

// ──────────────────────────────────────────────
// Portfolio Generator (Website Content)
// ──────────────────────────────────────────────
const PortfolioGenSchema = z.object({
  hero: z.object({ headline: z.string(), subheadline: z.string(), cta: z.string() }),
  about: z.object({ story: z.string(), highlights: z.array(z.string()) }),
  skills: z.object({ categories: z.array(z.object({ name: z.string(), skills: z.array(z.string()) })) }),
  projects: z.array(z.object({ name: z.string(), description: z.string(), techStack: z.array(z.string()), impact: z.string() })),
  contact: z.object({ tagline: z.string(), availability: z.string() }),
  githubBio: z.string(),
  professionalSummary: z.string(),
})

const PortfolioGenFallback = {
  hero: { headline: 'Building the Future with Code', subheadline: 'Full-stack developer passionate about meaningful software.', cta: 'View My Work' },
  about: { story: 'A dedicated developer building impactful software.', highlights: ['Problem solver', 'Team player', 'Continuous learner'] },
  skills: { categories: [{ name: 'Languages', skills: ['JavaScript', 'TypeScript', 'Python'] }] },
  projects: [{ name: 'Portfolio Project', description: 'A meaningful project showcasing my skills.', techStack: ['React', 'Node.js'], impact: 'Improves developer productivity' }],
  contact: { tagline: 'Open to new opportunities and collaborations.', availability: 'Available for freelance' },
  githubBio: 'Full-stack developer building impactful software.',
  professionalSummary: 'Passionate full-stack developer with experience building web applications.',
}

export async function generatePortfolioContent(userId: string) {
  const [profile, repos] = await Promise.all([getGitHubProfile(userId), getRepositories(userId)])
  if (!profile) throw new Error('GitHub profile not connected')

  const user = await import('../models/User').then(m => m.User.findById(userId))
  const dna = await import('../models/DeveloperDNA').then(m => m.DeveloperDNA.findOne({ userId }))

  const prompt = buildPortfolioGeneratorPrompt({
    name: user?.name || profile.username,
    username: profile.username,
    bio: profile.bio,
    languages: profile.languages,
    repositories: repos.map(r => ({
      name: r.name, description: r.description || '', language: r.language || '',
      stars: r.stars, topics: r.topics, homepage: r.homepage || '',
    })),
    totalStars: profile.totalStars,
    archetype: dna?.archetype,
  })

  const { data, tokens } = await geminiService.generateStructured(prompt, PortfolioGenSchema, PortfolioGenFallback)
  await recordTokenUsage(userId, 'portfolio_generator', tokens)

  return data
}
