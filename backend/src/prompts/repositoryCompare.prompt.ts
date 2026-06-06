export const VERSION = '1.0.0'

interface RepoCompareContext {
  repoA: { name: string; language: string; stars: number; description: string; topics: string[]; hasReadme: boolean; homepage: string; commitCount: number }
  repoB: { name: string; language: string; stars: number; description: string; topics: string[]; hasReadme: boolean; homepage: string; commitCount: number }
}

export function buildRepositoryComparePrompt(ctx: RepoCompareContext): string {
  return `You are a senior technical recruiter comparing two GitHub repositories.

REPOSITORY A: ${ctx.repoA.name}
Language: ${ctx.repoA.language}
Stars: ${ctx.repoA.stars}
Description: ${ctx.repoA.description || 'None'}
Topics: ${ctx.repoA.topics.join(', ')}
Has README: ${ctx.repoA.hasReadme}
Deployed: ${ctx.repoA.homepage ? 'Yes' : 'No'}
Commits: ${ctx.repoA.commitCount}

REPOSITORY B: ${ctx.repoB.name}
Language: ${ctx.repoB.language}
Stars: ${ctx.repoB.stars}
Description: ${ctx.repoB.description || 'None'}
Topics: ${ctx.repoB.topics.join(', ')}
Has README: ${ctx.repoB.hasReadme}
Deployed: ${ctx.repoB.homepage ? 'Yes' : 'No'}
Commits: ${ctx.repoB.commitCount}

Return ONLY this JSON:
{
  "winner": "A",
  "repositoryA": {
    "name": "${ctx.repoA.name}",
    "scores": {"complexity": 70, "innovation": 65, "documentation": 50, "recruiterValue": 75},
    "strengths": ["strength 1", "strength 2"],
    "weaknesses": ["weakness 1"]
  },
  "repositoryB": {
    "name": "${ctx.repoB.name}",
    "scores": {"complexity": 60, "innovation": 55, "documentation": 80, "recruiterValue": 65},
    "strengths": ["strength 1"],
    "weaknesses": ["weakness 1", "weakness 2"]
  },
  "complexityComparison": {"a": 70, "b": 60, "verdict": "A is more technically complex"},
  "innovationComparison": {"a": 65, "b": 55, "verdict": "A demonstrates more original thinking"},
  "documentationComparison": {"a": 50, "b": 80, "verdict": "B has significantly better documentation"},
  "recruiterValue": {"a": 75, "b": 65, "recommendation": "Use A on your resume — it demonstrates more technical depth"},
  "resumeValue": {"a": "Strong resume piece", "b": "Good supporting project"},
  "technicalDepth": {"a": 72, "b": 58, "verdict": "A shows deeper technical implementation"},
  "aiAnalysis": "A 2-3 paragraph comparative analysis of both repositories for a recruiter context."
}`
}
