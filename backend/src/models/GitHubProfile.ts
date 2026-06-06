import mongoose, { Schema, Document } from 'mongoose'

export interface IGitHubProfile extends Document {
  userId: mongoose.Types.ObjectId
  username: string
  avatarUrl: string
  bio?: string
  location?: string
  company?: string
  publicRepos: number
  followers: number
  following: number
  totalStars: number
  totalForks: number
  totalContributions: number
  longestStreak: number
  languages: Array<{ name: string; percentage: number; bytes: number }>
  topLanguage: string
  accountCreatedAt: Date
  lastSyncedAt: Date
}

const GitHubProfileSchema = new Schema<IGitHubProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    username: { type: String, required: true },
    avatarUrl: { type: String, default: '' },
    bio: String,
    location: String,
    company: String,
    publicRepos: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    totalStars: { type: Number, default: 0 },
    totalForks: { type: Number, default: 0 },
    totalContributions: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    languages: [{ name: String, percentage: Number, bytes: Number }],
    topLanguage: { type: String, default: '' },
    accountCreatedAt: Date,
    lastSyncedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

export const GitHubProfile = mongoose.model<IGitHubProfile>('GitHubProfile', GitHubProfileSchema)
