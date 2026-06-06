export const VERSION = '1.0.0'

interface WrappedPromptContext {
  username: string
  year: number
  repositories: Array<{ name: string; language: string; stars: number; createdAt: string; pushedAt: string }>
  languages: Array<{ name: string; percentage: number }>
  totalStars: number
  followers: number
  totalCommits: number
  longestStreak: number
}

export function buildWrappedPrompt(ctx: WrappedPromptContext): string {
  const yearRepos = ctx.repositories.filter(r => new Date(r.createdAt).getFullYear() === ctx.year)
  
  return `You are creating a "GitHub Wrapped" — a Spotify Wrapped-style year in review for a developer.

DEVELOPER: ${ctx.username}
YEAR: ${ctx.year}
NEW PROJECTS THIS YEAR: ${yearRepos.length}
ALL REPOS: ${ctx.repositories.length}
TOTAL STARS: ${ctx.totalStars}
FOLLOWERS: ${ctx.followers}
REAL COMMIT COUNT: ${ctx.totalCommits}
REAL LONGEST STREAK: ${ctx.longestStreak}
LANGUAGES: ${ctx.languages.map(l => `${l.name} ${l.percentage.toFixed(0)}%`).join(', ')}

PROJECTS BUILT IN ${ctx.year}: ${yearRepos.map(r => r.name).join(', ') || 'None found'}

Return ONLY this JSON. 
IMPORTANT: You MUST use the exact REAL COMMIT COUNT and REAL LONGEST STREAK provided above. Do NOT guess or hardcode.

{
  "projectsBuilt": ${yearRepos.length},
  "totalCommits": ${ctx.totalCommits},
  "starsEarned": ${ctx.totalStars},
  "mostActiveMonth": "October",
  "favoriteLanguage": "${ctx.languages[0]?.name || 'JavaScript'}",
  "mostUsedFramework": "React",
  "longestStreak": ${ctx.longestStreak},
  "developerPersonality": "The Midnight Architect — you do your best work when the world sleeps",
  "highlights": [
    {"title": "Most Ambitious Project", "description": "Brief about the most complex project", "icon": "🚀"},
    {"title": "Biggest Achievement", "description": "What stands out most this year", "icon": "⭐"},
    {"title": "Growth Moment", "description": "The biggest skill leap this year", "icon": "📈"},
    {"title": "Community Impact", "description": "How this developer impacted others", "icon": "🌍"}
  ]
}

Make the developerPersonality creative, unique, and memorable. Be specific and analytical based on the actual data.`
}
