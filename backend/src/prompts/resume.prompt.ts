export const VERSION = '1.0.0'

interface ResumePromptContext {
  type: string
  username: string
  name: string
  bio?: string
  location?: string
  languages: Array<{ name: string; percentage: number }>
  repositories: Array<{
    name: string
    description: string
    language: string
    stars: number
    topics: string[]
    homepage: string
  }>
  totalStars: number
}

export function buildResumePrompt(ctx: ResumePromptContext): string {
  return `You are an expert resume writer specializing in software engineering resumes. 
Generate a ${ctx.type.toUpperCase()} resume optimized for ATS systems and technical recruiters.

DEVELOPER PROFILE:
Name: ${ctx.name}
GitHub: ${ctx.username}
Bio: ${ctx.bio || 'Software Developer'}
Location: ${ctx.location || 'Remote'}
Skills: ${ctx.languages.map(l => l.name).join(', ')}
GitHub Stars: ${ctx.totalStars}

TOP PROJECTS:
${ctx.repositories.slice(0, 6).map(r =>
  `- ${r.name}: ${r.description || 'No description'} [${r.language}] ⭐${r.stars} ${r.homepage ? '| Deployed' : ''}`
).join('\n')}

Resume type: ${ctx.type} (ats=ATS-optimized, fullstack=Full Stack, frontend=Frontend, ai=AI Engineer)

Return ONLY this JSON:
{
  "resumeScore": 72,
  "recruiterOptimization": ["Use more action verbs", "Add metrics to project descriptions", "Quantify impact"],
  "content": {
    "header": {
      "name": "${ctx.name}",
      "title": "Software Engineer",
      "email": "developer@email.com",
      "github": "github.com/${ctx.username}",
      "location": "${ctx.location || 'Remote'}"
    },
    "summary": "2-3 sentence professional summary tailored to ${ctx.type} role",
    "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6", "Skill 7", "Skill 8"],
    "projects": [
      {
        "name": "Project Name",
        "description": "What it does and the impact",
        "tech": ["Tech 1", "Tech 2"],
        "bullets": [
          "Built X feature using Y technology, resulting in Z improvement",
          "Implemented Z system that handles X requests per second"
        ],
        "github": "github.com/${ctx.username}/project",
        "live": "live-url or null"
      }
    ],
    "education": [
      {
        "degree": "Self-Taught / Online Courses",
        "institution": "Various platforms",
        "year": "2023-Present"
      }
    ]
  }
}`
}
