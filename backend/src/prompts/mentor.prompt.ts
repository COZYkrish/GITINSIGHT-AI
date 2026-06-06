export const VERSION = '1.0.0'

interface MentorPromptContext {
  username: string
  languages: Array<{ name: string; percentage: number }>
  repositories: Array<{ name: string; language: string; stars: number; description: string; topics: string[] }>
  totalStars: number
  accountAge: string
}

export function buildMentorPrompt(ctx: MentorPromptContext): string {
  return `You are an elite senior software engineer and career mentor. Be direct, specific, and actionable.

MENTEE PROFILE:
Developer: ${ctx.username}
Experience: ${ctx.accountAge} on GitHub
Total Stars: ${ctx.totalStars}
Skills: ${ctx.languages.map(l => `${l.name} (${l.percentage.toFixed(0)}%)`).join(', ')}
Projects: ${ctx.repositories.slice(0, 10).map(r => r.name).join(', ')}

Return ONLY this JSON:
{
  "developerLevel": "Mid-Level Developer",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["area 1", "area 2", "area 3"],
  "feedback": "A direct, honest 2-3 paragraph mentor feedback. Be specific about what's impressive and what needs work.",
  "learningRoadmap": [
    {"phase": "Phase 1 - Foundation (0-3 months)", "duration": "3 months", "topics": ["Topic A", "Topic B", "Topic C"]},
    {"phase": "Phase 2 - Growth (3-6 months)", "duration": "3 months", "topics": ["Topic D", "Topic E"]},
    {"phase": "Phase 3 - Mastery (6-12 months)", "duration": "6 months", "topics": ["Topic F", "Topic G"]}
  ],
  "recommendedTech": ["Tech 1", "Tech 2", "Tech 3", "Tech 4", "Tech 5"],
  "recommendedProjects": [
    "Build a real-time chat app with WebSockets",
    "Create a CLI tool that solves a real problem",
    "Contribute to a popular open source project"
  ],
  "weeklyGoals": ["Goal 1", "Goal 2", "Goal 3", "Goal 4"],
  "monthlyRoadmap": ["Month 1: Focus on...", "Month 2: Build...", "Month 3: Deploy..."]
}

Developer level options: "Junior Developer", "Mid-Level Developer", "Senior Developer", "Staff Engineer"`
}
