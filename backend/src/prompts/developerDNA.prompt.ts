export const VERSION = '1.0.0'

interface DNAPromptContext {
  username: string
  repositories: Array<{
    name: string
    language: string
    stars: number
    description: string
    topics: string[]
    commitCount: number
  }>
  languages: Array<{ name: string; percentage: number }>
  totalStars: number
  followers: number
  accountAge: string
}

export function buildDeveloperDNAPrompt(ctx: DNAPromptContext): string {
  return `You are an elite software engineering career analyst with 20+ years of experience.

Analyze this GitHub developer profile and generate their unique Developer DNA archetype.

DEVELOPER PROFILE:
Username: ${ctx.username}
Account Age: ${ctx.accountAge}
Total Stars: ${ctx.totalStars}
Followers: ${ctx.followers}

REPOSITORIES (${ctx.repositories.length} total):
${ctx.repositories.slice(0, 15).map(r => 
  `- ${r.name} [${r.language || 'Unknown'}] ⭐${r.stars} | ${r.description || 'No description'} | Topics: ${r.topics.join(', ') || 'none'}`
).join('\n')}

LANGUAGE DISTRIBUTION:
${ctx.languages.map(l => `- ${l.name}: ${l.percentage.toFixed(1)}%`).join('\n')}

Generate a comprehensive Developer DNA analysis. Return ONLY this JSON:

{
  "archetype": "The AI Builder",
  "archetypeEmoji": "🤖",
  "description": "A 2-3 sentence description of this developer's unique identity and approach to building software.",
  "strengths": ["strength 1", "strength 2", "strength 3", "strength 4", "strength 5"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "recommendedRoles": ["role 1", "role 2", "role 3", "role 4"],
  "recommendedTechnologies": ["tech 1", "tech 2", "tech 3", "tech 4", "tech 5"],
  "recommendedProjects": ["project idea 1", "project idea 2", "project idea 3"],
  "careerTrajectory": "A paragraph about where this developer is headed and what their natural career path looks like.",
  "personalityTraits": [
    {"trait": "Problem Solver", "score": 85},
    {"trait": "Innovator", "score": 70},
    {"trait": "Collaborator", "score": 60},
    {"trait": "Builder", "score": 90},
    {"trait": "Learner", "score": 75}
  ],
  "compatibleArchetypes": ["The Full Stack Architect", "The Product Engineer"]
}

Archetypes to choose from: "The AI Builder", "The Product Engineer", "The Full Stack Architect", "The Startup Hacker", "The Problem Solver", "The Open Source Contributor", "The Systems Thinker", "The UI Craftsman", "The Data Scientist", "The DevOps Engineer"`
}
