export const VERSION = '1.0.0'

interface PortfolioPromptContext {
  username: string
  repositories: Array<{
    name: string
    language: string
    stars: number
    forks: number
    description: string
    hasReadme: boolean
    readmeLength: number
    topics: string[]
    homepage: string
    commitCount: number
    pushedAt: string
  }>
  languages: Array<{ name: string; percentage: number }>
  totalRepos: number
}

export function buildPortfolioPrompt(ctx: PortfolioPromptContext): string {
  return `You are a senior software engineer and technical recruiter evaluating a developer's GitHub portfolio.

Score this portfolio on a scale of 0-100 across multiple dimensions.

DEVELOPER: ${ctx.username}
TOTAL REPOS: ${ctx.totalRepos}

REPOSITORIES:
${ctx.repositories.slice(0, 20).map(r =>
  `- ${r.name} [${r.language}] ⭐${r.stars} 🍴${r.forks}
    Description: ${r.description || 'None'}
    README: ${r.hasReadme ? `Yes (${r.readmeLength} chars)` : 'Missing'}
    Deployed: ${r.homepage ? 'Yes' : 'No'}
    Topics: ${r.topics.join(', ') || 'none'}
    Last Push: ${r.pushedAt}`
).join('\n\n')}

LANGUAGES: ${ctx.languages.map(l => `${l.name} ${l.percentage.toFixed(0)}%`).join(', ')}

Return ONLY this JSON:
{
  "overallScore": 72,
  "projectQuality": 75,
  "documentation": 60,
  "consistency": 70,
  "technicalDiversity": 80,
  "innovation": 65,
  "breakdown": {
    "hasDeployedProjects": true,
    "readmeQuality": "moderate",
    "codeOrganization": "good",
    "projectVariety": "high",
    "consistentActivity": true
  },
  "suggestions": [
    "Add README files to 5 repositories missing documentation",
    "Deploy at least 3 more projects to demonstrate full-stack ability",
    "Add project descriptions and topics to improve discoverability"
  ],
  "aiExplanation": "A 2-3 paragraph expert analysis of the portfolio's strengths and areas for improvement."
}`
}
