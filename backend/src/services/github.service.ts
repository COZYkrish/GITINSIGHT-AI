import axios from 'axios'
import { Octokit } from '@octokit/rest'
import { env } from '../config/env'
import { GitHubProfile } from '../models/GitHubProfile'
import { Repository } from '../models/Repository'
import { User } from '../models/User'

const CACHE_TTL_HOURS = 24

export async function exchangeCodeForToken(code: string): Promise<string> {
  const response = await axios.post(
    'https://github.com/login/oauth/access_token',
    {
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    },
    { headers: { Accept: 'application/json' } }
  )
  
  if (response.data.error) throw new Error(response.data.error_description)
  return response.data.access_token
}

export async function fetchAndStoreGitHubData(userId: string, accessToken: string) {
  const octokit = new Octokit({ auth: accessToken })

  // Fetch user profile
  const { data: ghUser } = await octokit.users.getAuthenticated()
  
  // Fetch all repos
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const repos: any[] = []
  let page = 1
  while (true) {
    const { data } = await octokit.repos.listForAuthenticatedUser({
      per_page: 100,
      page,
      sort: 'updated',
    })
    repos.push(...data)
    if (data.length < 100) break
    page++
  }

  // Calculate language stats
  const langMap: Record<string, number> = {}
  let totalBytes = 0
  for (const repo of repos.slice(0, 30)) {
    if (repo.language) {
      langMap[repo.language] = (langMap[repo.language] || 0) + (repo.size || 1)
      totalBytes += repo.size || 1
    }
  }
  
  const languages = Object.entries(langMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: totalBytes > 0 ? (bytes / totalBytes) * 100 : 0,
    }))

  const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0)
  const totalForks = repos.reduce((sum, r) => sum + (r.forks_count || 0), 0)

  // Fetch true contributions & streak using GraphQL
  let totalContributions = 0
  let longestStreak = 0
  try {
    const query = `
      query($userName:String!) {
        user(login: $userName){
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                }
              }
            }
          }
        }
      }
    `
    const res: any = await octokit.graphql(query, { userName: ghUser.login })
    const calendar = res?.user?.contributionsCollection?.contributionCalendar
    if (calendar) {
      totalContributions = calendar.totalContributions
      let currentStreak = 0
      for (const week of calendar.weeks) {
        for (const day of week.contributionDays) {
          if (day.contributionCount > 0) {
            currentStreak++
            if (currentStreak > longestStreak) longestStreak = currentStreak
          } else {
            currentStreak = 0
          }
        }
      }
    }
  } catch (err) {
    console.warn('⚠️ Failed to fetch GraphQL contribution calendar', err)
  }

  // Upsert GitHub profile
  await GitHubProfile.findOneAndUpdate(
    { userId },
    {
      userId,
      username: ghUser.login,
      avatarUrl: ghUser.avatar_url,
      bio: ghUser.bio,
      location: ghUser.location,
      company: ghUser.company,
      publicRepos: ghUser.public_repos,
      followers: ghUser.followers,
      following: ghUser.following,
      totalStars,
      totalForks,
      totalContributions,
      longestStreak,
      languages,
      topLanguage: languages[0]?.name || '',
      accountCreatedAt: new Date(ghUser.created_at),
      lastSyncedAt: new Date(),
    },
    { upsert: true, new: true }
  )

  // Store repositories
  for (const repo of repos) {
    await Repository.findOneAndUpdate(
      { userId, githubId: repo.id },
      {
        userId,
        githubId: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        watchers: repo.watchers_count,
        topics: repo.topics || [],
        hasReadme: false,
        readmeLength: 0,
        pushedAt: repo.pushed_at ? new Date(repo.pushed_at) : new Date(),
        homepage: repo.homepage,
        isPrivate: repo.private,
        isForked: repo.fork,
        openIssues: repo.open_issues_count,
      },
      { upsert: true, new: true }
    )
  }

  // Update user flags
  await User.findByIdAndUpdate(userId, {
    githubConnected: true,
    githubId: ghUser.id.toString(),
    githubAccessToken: accessToken,
  })

  return { profile: ghUser, repoCount: repos.length }
}

export async function isCacheValid(userId: string): Promise<boolean> {
  const profile = await GitHubProfile.findOne({ userId })
  if (!profile?.lastSyncedAt) return false
  
  const hoursElapsed = (Date.now() - profile.lastSyncedAt.getTime()) / (1000 * 60 * 60)
  return hoursElapsed < CACHE_TTL_HOURS
}

export async function getGitHubProfile(userId: string) {
  return GitHubProfile.findOne({ userId })
}

export async function getRepositories(userId: string) {
  return Repository.find({ userId }).sort({ stars: -1 })
}
