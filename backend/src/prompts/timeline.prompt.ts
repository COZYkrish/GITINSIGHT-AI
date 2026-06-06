export const VERSION = '1.0.0'

interface TimelinePromptContext {
  username: string
  repositories: Array<{
    name: string
    language: string
    stars: number
    description: string
    createdAt: string
    pushedAt: string
    topics: string[]
  }>
  languages: Array<{ name: string; percentage: number }>
}

export function buildTimelinePrompt(ctx: TimelinePromptContext): string {
  const sortedRepos = [...ctx.repositories].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )
  
  return `You are analyzing a developer's GitHub journey to create a compelling portfolio timeline.

DEVELOPER: ${ctx.username}

CHRONOLOGICAL REPOSITORY HISTORY:
${sortedRepos.map(r =>
  `${new Date(r.createdAt).getFullYear()}-${String(new Date(r.createdAt).getMonth() + 1).padStart(2, '0')}: ${r.name} [${r.language || 'Unknown'}] - ${r.description || 'No description'}`
).join('\n')}

Generate a developer evolution timeline. Return ONLY this JSON:
{
  "milestones": [
    {
      "year": 2023,
      "month": 3,
      "title": "First Web Project",
      "description": "Began the coding journey with a foundational web project",
      "type": "project",
      "impact": "Foundation"
    },
    {
      "year": 2024,
      "month": 1,
      "title": "Adopted React",
      "description": "Transitioned to modern frontend development with React ecosystem",
      "type": "technology",
      "impact": "Major skill unlock"
    }
  ],
  "technologyEvolution": [
    {"year": 2023, "technologies": ["HTML", "CSS", "JavaScript"]},
    {"year": 2024, "technologies": ["React", "Node.js", "MongoDB"]},
    {"year": 2025, "technologies": ["TypeScript", "Next.js", "AI/ML"]}
  ]
}

Create 5-10 meaningful milestones. Types: "project" | "technology" | "achievement"`
}
