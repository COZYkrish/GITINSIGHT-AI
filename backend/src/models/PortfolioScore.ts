import mongoose, { Schema, Document } from 'mongoose'

export interface IPortfolioScore extends Document {
  userId: mongoose.Types.ObjectId
  overallScore: number
  projectQuality: number
  documentation: number
  consistency: number
  technicalDiversity: number
  innovation: number
  breakdown: Record<string, unknown>
  suggestions: string[]
  aiExplanation: string
  generatedAt: Date
  jobId?: string
}

const PortfolioScoreSchema = new Schema<IPortfolioScore>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  overallScore: { type: Number, default: 0 },
  projectQuality: { type: Number, default: 0 },
  documentation: { type: Number, default: 0 },
  consistency: { type: Number, default: 0 },
  technicalDiversity: { type: Number, default: 0 },
  innovation: { type: Number, default: 0 },
  breakdown: { type: Schema.Types.Mixed, default: {} },
  suggestions: [String],
  aiExplanation: String,
  generatedAt: { type: Date, default: Date.now },
  jobId: String,
}, { timestamps: true })

export const PortfolioScore = mongoose.model<IPortfolioScore>('PortfolioScore', PortfolioScoreSchema)
