import mongoose, { Schema, Document } from 'mongoose'

export interface IRepository extends Document {
  userId: mongoose.Types.ObjectId
  githubId: number
  name: string
  fullName: string
  description?: string
  language?: string
  stars: number
  forks: number
  watchers: number
  topics: string[]
  hasReadme: boolean
  readmeContent?: string
  readmeLength: number
  createdAt: Date
  updatedAt: Date
  pushedAt: Date
  homepage?: string
  isPrivate: boolean
  isForked: boolean
  commitCount: number
  openIssues: number
  // AI-generated
  complexityScore?: number
  innovationScore?: number
  documentationScore?: number
  deploymentScore?: number
  aiSummary?: string
  evolutionMilestones?: Array<{ date: Date; title: string; description: string; type: string }>
}

const RepositorySchema = new Schema<IRepository>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    githubId: { type: Number, required: true },
    name: { type: String, required: true },
    fullName: { type: String, required: true },
    description: String,
    language: String,
    stars: { type: Number, default: 0 },
    forks: { type: Number, default: 0 },
    watchers: { type: Number, default: 0 },
    topics: [String],
    hasReadme: { type: Boolean, default: false },
    readmeContent: String,
    readmeLength: { type: Number, default: 0 },
    pushedAt: Date,
    homepage: String,
    isPrivate: { type: Boolean, default: false },
    isForked: { type: Boolean, default: false },
    commitCount: { type: Number, default: 0 },
    openIssues: { type: Number, default: 0 },
    complexityScore: Number,
    innovationScore: Number,
    documentationScore: Number,
    deploymentScore: Number,
    aiSummary: String,
    evolutionMilestones: [
      { date: Date, title: String, description: String, type: String }
    ],
  },
  { timestamps: true }
)

RepositorySchema.index({ userId: 1, githubId: 1 }, { unique: true })

export const Repository = mongoose.model<IRepository>('Repository', RepositorySchema)
