export const VERSION = '1.0.0'

interface LinkedInPromptContext {
  type: string
  username: string
  repository?: { name: string; description: string; language: string; stars: number; topics: string[]; homepage: string }
  languages: Array<{ name: string; percentage: number }>
  totalStars: number
}

export function buildLinkedInPrompt(ctx: LinkedInPromptContext): string {
  const repoInfo = ctx.repository ? `
FEATURED PROJECT: ${ctx.repository.name}
Description: ${ctx.repository.description}
Tech Stack: ${ctx.repository.language}
Stars: ${ctx.repository.stars}
Live URL: ${ctx.repository.homepage || 'Not deployed'}
Topics: ${ctx.repository.topics.join(', ')}` : ''

  return `You are a professional LinkedIn content writer and personal branding expert.

Generate ${ctx.type} content for a software developer.

DEVELOPER: ${ctx.username}
Skills: ${ctx.languages.slice(0, 5).map(l => l.name).join(', ')}
Total Stars: ${ctx.totalStars}
${repoInfo}

Content type: ${ctx.type}

Types and their formats:
- "linkedin_post": 150-300 word LinkedIn post about projects/growth, 3-5 hashtags, engaging hook
- "resume_bullet": 3-5 ATS-optimized bullet points with metrics and action verbs
- "portfolio_description": 2-3 paragraph professional portfolio bio
- "project_summary": 1-2 paragraph project description for portfolio
- "github_bio": 160 character GitHub bio
- "professional_summary": 3-4 sentence professional summary for resume

Return ONLY this JSON:
{
  "type": "${ctx.type}",
  "content": "The generated content here",
  "tips": ["Tip 1 for improving this content", "Tip 2"]
}`
}
