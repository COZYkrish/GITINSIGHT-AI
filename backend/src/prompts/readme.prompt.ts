export const VERSION = '1.0.0'

interface ReadmePromptContext {
  repoName: string
  language: string
  description: string
  existingReadme?: string
  topics: string[]
  stars: number
  homepage?: string
}

export function buildReadmePrompt(ctx: ReadmePromptContext): string {
  return `You are a technical documentation expert. Analyze this repository's README.

REPOSITORY: ${ctx.repoName}
Language: ${ctx.language}
Description: ${ctx.description || 'None provided'}
Stars: ${ctx.stars}
Live URL: ${ctx.homepage || 'Not deployed'}
Topics: ${ctx.topics.join(', ') || 'None'}

CURRENT README (${ctx.existingReadme ? `${ctx.existingReadme.length} chars` : 'MISSING'}):
${ctx.existingReadme ? ctx.existingReadme.slice(0, 2000) : 'No README found'}

Return ONLY this JSON:
{
  "score": 45,
  "healthScore": 50,
  "missingSections": ["Installation guide", "Usage examples", "Contributing guide", "License", "Screenshots"],
  "suggestions": [
    "Add a demo GIF or screenshot at the top",
    "Include a quick start guide with exact commands",
    "Add badges for build status, license, and npm version"
  ],
  "enhancedReadme": "# ${ctx.repoName}\\n\\nA complete enhanced README in markdown format..."
}`
}
