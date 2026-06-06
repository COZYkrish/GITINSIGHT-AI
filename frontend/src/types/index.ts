export interface User {
  id: string
  name: string
  email: string
  githubConnected: boolean
  onboardingComplete: boolean
  publicProfileEnabled: boolean
  publicProfileSlug?: string
}

export interface GitHubProfile {
  userId: string
  username: string
  avatarUrl: string
  bio?: string
  location?: string
  company?: string
  publicRepos: number
  followers: number
  following: number
  totalStars: number
  totalForks: number
  totalContributions: number
  languages: Array<{ name: string; percentage: number; bytes: number }>
  topLanguage: string
  accountCreatedAt: string
  lastSyncedAt: string
}

export interface Repository {
  _id: string
  userId: string
  githubId: number
  name: string
  fullName: string
  description?: string
  language?: string
  stars: number
  forks: number
  watchers: number
  topics: string[]
  hasReadme: boolean
  readmeContent?: string
  pushedAt: string
  homepage?: string
  isPrivate: boolean
  isForked: boolean
  commitCount: number
  openIssues: number
  complexityScore?: number
  innovationScore?: number
  documentationScore?: number
  deploymentScore?: number
  aiSummary?: string
}

export interface DeveloperDNA {
  _id: string
  userId: string
  archetype: string
  archetypeEmoji: string
  description: string
  strengths: string[]
  weaknesses: string[]
  recommendedRoles: string[]
  recommendedTechnologies: string[]
  recommendedProjects: string[]
  careerTrajectory: string
  personalityTraits: Array<{ trait: string; score: number }>
  compatibleArchetypes: string[]
  generatedAt: string
}

export interface PortfolioScore {
  overallScore: number
  projectQuality: number
  documentation: number
  consistency: number
  technicalDiversity: number
  innovation: number
  breakdown: Record<string, unknown>
  suggestions: string[]
  aiExplanation: string
  generatedAt: string
}

export interface RecruiterReport {
  verdict: string
  hiringProbability: number
  strengths: string[]
  weaknesses: string[]
  technicalEval: { score: number; notes: string }
  communicationEval: { score: number; notes: string }
  portfolioEval: { score: number; notes: string }
  seniorPerspective: string
  startupPerspective: string
  fullReport: string
  generatedAt: string
}

export interface CareerRole {
  name: string
  matchPercentage: number
  skillGaps: string[]
  hiringReadiness: string
  timeline: string
  growthOpportunities: string[]
}

export interface CareerReport {
  overallReadiness: number
  roles: CareerRole[]
  generatedAt: string
}

export interface Notification {
  _id: string
  userId: string
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
  metadata?: Record<string, string>
}

export interface WrappedReport {
  year: number
  projectsBuilt: number
  totalCommits: number
  starsEarned: number
  mostActiveMonth: string
  favoriteLanguage: string
  mostUsedFramework: string
  longestStreak: number
  developerPersonality: string
  highlights: Array<{ title: string; description: string; icon: string }>
  generatedAt: string
}

export interface MentorReport {
  developerLevel: string
  strengths: string[]
  weaknesses: string[]
  feedback: string
  learningRoadmap: Array<{ phase: string; duration: string; topics: string[] }>
  recommendedTech: string[]
  recommendedProjects: string[]
  weeklyGoals: string[]
  monthlyRoadmap: string[]
  generatedAt: string
}

export interface GeneratedResume {
  type: string
  content: Record<string, unknown>
  resumeScore: number
  recruiterOptimization: string[]
  generatedAt: string
}

export interface FeatureFlags {
  ENABLE_DEVELOPER_DNA: boolean
  ENABLE_RESUME_BUILDER: boolean
  ENABLE_PORTFOLIO_GENERATOR: boolean
  ENABLE_SOCIAL_SHARING: boolean
  ENABLE_GITHUB_WRAPPED: boolean
  ENABLE_REPO_COMPARE: boolean
  ENABLE_PUBLIC_PROFILES: boolean
  ENABLE_BACKGROUND_JOBS: boolean
}
