import mongoose, { Schema, Document } from 'mongoose'

export interface IWrappedReport extends Document {
  userId: mongoose.Types.ObjectId
  year: number
  projectsBuilt: number
  totalCommits: number
  starsEarned: number
  mostActiveMonth: string
  favoriteLanguage: string
  mostUsedFramework: string
  longestStreak: number
  developerPersonality: string
  highlights: Array<{ title: string; description: string; icon: string }>
  generatedAt: Date
  jobId?: string
}

const WrappedReportSchema = new Schema<IWrappedReport>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  year: { type: Number, required: true },
  projectsBuilt: { type: Number, default: 0 },
  totalCommits: { type: Number, default: 0 },
  starsEarned: { type: Number, default: 0 },
  mostActiveMonth: String,
  favoriteLanguage: String,
  mostUsedFramework: String,
  longestStreak: { type: Number, default: 0 },
  developerPersonality: String,
  highlights: [{ title: String, description: String, icon: String }],
  generatedAt: { type: Date, default: Date.now },
  jobId: String,
}, { timestamps: true })

WrappedReportSchema.index({ userId: 1, year: 1 }, { unique: true })

export const WrappedReport = mongoose.model<IWrappedReport>('WrappedReport', WrappedReportSchema)
