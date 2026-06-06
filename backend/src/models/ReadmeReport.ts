import mongoose, { Schema, Document } from 'mongoose'

export interface IReadmeReport extends Document {
  userId: mongoose.Types.ObjectId
  repositoryId: mongoose.Types.ObjectId
  score: number
  missingSections: string[]
  healthScore: number
  suggestions: string[]
  enhancedReadme: string
  generatedAt: Date
}

const ReadmeReportSchema = new Schema<IReadmeReport>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  repositoryId: { type: Schema.Types.ObjectId, ref: 'Repository', required: true },
  score: { type: Number, default: 0 },
  missingSections: [String],
  healthScore: { type: Number, default: 0 },
  suggestions: [String],
  enhancedReadme: String,
  generatedAt: { type: Date, default: Date.now },
}, { timestamps: true })

export const ReadmeReport = mongoose.model<IReadmeReport>('ReadmeReport', ReadmeReportSchema)
