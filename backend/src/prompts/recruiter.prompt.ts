export const VERSION = '1.0.0'

interface RecruiterPromptContext {
  username: string
  bio?: string
  location?: string
  followers: number
  publicRepos: number
  totalStars: number
  languages: Array<{ name: string; percentage: number }>
  repositories: Array<{
    name: string
    language: string
    stars: number
    description: string
    hasReadme: boolean
    homepage: string
    topics: string[]
  }>
  accountAge: string
}

export function buildRecruiterPrompt(ctx: RecruiterPromptContext): string {
  return `You are a senior technical recruiter at a top tech company. Simulate a real hiring evaluation.

CANDIDATE GITHUB PROFILE:
Username: ${ctx.username}
Bio: ${ctx.bio || 'Not provided'}
Location: ${ctx.location || 'Not provided'}
Account Age: ${ctx.accountAge}
Followers: ${ctx.followers}
Public Repos: ${ctx.publicRepos}
Total Stars: ${ctx.totalStars}

TOP PROJECTS:
${ctx.repositories.slice(0, 10).map(r =>
  `- ${r.name} [${r.language}] ⭐${r.stars} | ${r.description || 'No description'} | Deployed: ${r.homepage ? 'Yes' : 'No'}`
).join('\n')}

SKILLS: ${ctx.languages.map(l => `${l.name} (${l.percentage.toFixed(0)}%)`).join(', ')}

Provide a complete recruiter evaluation. Return ONLY this JSON:
{
  "verdict": "Strong Hire",
  "hiringProbability": 78,
  "strengths": ["strength 1", "strength 2", "strength 3", "strength 4"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "technicalEval": {
    "score": 75,
    "notes": "Technical evaluation paragraph..."
  },
  "communicationEval": {
    "score": 60,
    "notes": "Communication/documentation evaluation..."
  },
  "portfolioEval": {
    "score": 70,
    "notes": "Portfolio presentation evaluation..."
  },
  "seniorPerspective": "What a senior engineer would say about this candidate...",
  "startupPerspective": "What a startup founder would say about this candidate...",
  "fullReport": "A comprehensive 3-4 paragraph recruiter report covering technical skills, project quality, career potential, and hiring recommendation."
}

Verdict options: "Strong Hire", "Hire", "Lean Hire", "No Hire", "Strong No Hire"`
}
