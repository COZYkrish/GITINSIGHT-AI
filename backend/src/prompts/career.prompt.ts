export const VERSION = '1.0.0'

interface CareerPromptContext {
  username: string
  languages: Array<{ name: string; percentage: number }>
  repositories: Array<{ name: string; language: string; stars: number; topics: string[]; description: string }>
  totalStars: number
  accountAge: string
}

export function buildCareerPrompt(ctx: CareerPromptContext): string {
  return `You are a senior career coach specializing in software engineering.

Evaluate this developer's career readiness across multiple engineering roles.

DEVELOPER: ${ctx.username}
Skills: ${ctx.languages.map(l => `${l.name} (${l.percentage.toFixed(0)}%)`).join(', ')}
Account Age: ${ctx.accountAge}
Total Stars: ${ctx.totalStars}

PROJECTS: ${ctx.repositories.slice(0, 12).map(r => `${r.name}[${r.language}]`).join(', ')}

Return ONLY this JSON:
{
  "overallReadiness": 68,
  "roles": [
    {
      "name": "Frontend Developer",
      "matchPercentage": 75,
      "skillGaps": ["Testing", "Accessibility", "Performance optimization"],
      "hiringReadiness": "Ready for junior-mid level roles",
      "timeline": "3-6 months to senior readiness",
      "growthOpportunities": ["Build a design system", "Contribute to open source"]
    },
    {
      "name": "Backend Developer",
      "matchPercentage": 65,
      "skillGaps": ["Database optimization", "System design", "API security"],
      "hiringReadiness": "Junior level with gaps",
      "timeline": "6-12 months to mid-level",
      "growthOpportunities": ["Build a microservices project", "Learn cloud deployment"]
    },
    {
      "name": "Full Stack Developer",
      "matchPercentage": 70,
      "skillGaps": ["DevOps", "Testing", "System design"],
      "hiringReadiness": "Ready for full stack roles at startups",
      "timeline": "4-8 months to strong full stack",
      "growthOpportunities": ["Deploy a production app", "Add CI/CD pipeline"]
    },
    {
      "name": "AI/ML Engineer",
      "matchPercentage": 45,
      "skillGaps": ["Python", "ML frameworks", "Mathematics", "Data pipelines"],
      "hiringReadiness": "Not ready — significant gaps",
      "timeline": "12-18 months with focused learning",
      "growthOpportunities": ["Complete ML course", "Build an AI project"]
    }
  ]
}`
}
