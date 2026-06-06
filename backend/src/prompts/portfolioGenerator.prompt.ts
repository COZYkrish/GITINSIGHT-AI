export const VERSION = '1.0.0'

interface PortfolioGenPromptContext {
  name: string
  username: string
  bio?: string
  languages: Array<{ name: string; percentage: number }>
  repositories: Array<{ name: string; description: string; language: string; stars: number; homepage: string; topics: string[] }>
  totalStars: number
  archetype?: string
}

export function buildPortfolioGeneratorPrompt(ctx: PortfolioGenPromptContext): string {
  return `You are a professional portfolio writer and personal branding expert.

Generate complete portfolio website content for this developer.

DEVELOPER PROFILE:
Name: ${ctx.name}
GitHub: ${ctx.username}
Bio: ${ctx.bio || 'Software Developer'}
Archetype: ${ctx.archetype || 'Software Developer'}
Skills: ${ctx.languages.map(l => l.name).join(', ')}
Total GitHub Stars: ${ctx.totalStars}

TOP PROJECTS:
${ctx.repositories.slice(0, 6).map(r =>
  `- ${r.name}: ${r.description || 'No description'} [${r.language}] ⭐${r.stars}`
).join('\n')}

Return ONLY this JSON:
{
  "hero": {
    "headline": "Compelling 5-8 word headline",
    "subheadline": "One sentence that captures unique value",
    "cta": "View My Work"
  },
  "about": {
    "story": "2-3 paragraph compelling developer story that reads naturally",
    "highlights": ["Highlight 1", "Highlight 2", "Highlight 3"]
  },
  "skills": {
    "categories": [
      {"name": "Frontend", "skills": ["React", "TypeScript", "CSS"]},
      {"name": "Backend", "skills": ["Node.js", "MongoDB"]},
      {"name": "Tools", "skills": ["Git", "Docker", "VS Code"]}
    ]
  },
  "projects": [
    {
      "name": "Project Name",
      "description": "2-3 sentence compelling project description",
      "techStack": ["React", "Node.js"],
      "impact": "What problem does this solve or what value does it create"
    }
  ],
  "contact": {
    "tagline": "A warm closing statement",
    "availability": "Open to opportunities" 
  },
  "githubBio": "160-character GitHub bio",
  "professionalSummary": "3-4 sentence professional summary for resume/LinkedIn"
}`
}
