import { create } from 'zustand'
import { GitHubProfile, Repository } from '../types'
import api from '../services/api'

interface GitHubState {
  profile: GitHubProfile | null
  repositories: Repository[]
  isSyncing: boolean
  lastSyncedAt: string | null
  fetchProfile: () => Promise<void>
  fetchRepositories: () => Promise<void>
  sync: () => Promise<void>
}

export const useGitHubStore = create<GitHubState>((set) => ({
  profile: null,
  repositories: [],
  isSyncing: false,
  lastSyncedAt: null,

  fetchProfile: async () => {
    try {
      const { data } = await api.get('/api/github/profile')
      set({ profile: data, lastSyncedAt: data?.lastSyncedAt })
    } catch { /* not connected */ }
  },

  fetchRepositories: async () => {
    try {
      const { data } = await api.get('/api/github/repositories')
      set({ repositories: data })
    } catch { /* ignore */ }
  },

  sync: async () => {
    set({ isSyncing: true })
    try {
      await api.post('/api/github/sync')
      const [profileRes, reposRes] = await Promise.all([
        api.get('/api/github/profile'),
        api.get('/api/github/repositories'),
      ])
      set({ profile: profileRes.data, repositories: reposRes.data, lastSyncedAt: profileRes.data.lastSyncedAt })
    } finally {
      set({ isSyncing: false })
    }
  },
}))
