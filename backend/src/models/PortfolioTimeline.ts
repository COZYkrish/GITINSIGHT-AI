import mongoose, { Schema, Document } from 'mongoose'

export interface IPortfolioTimeline extends Document {
  userId: mongoose.Types.ObjectId
  milestones: Array<{
    year: number
    month: number
    title: string
    description: string
    type: 'project' | 'technology' | 'achievement'
    repositoryId?: mongoose.Types.ObjectId
    impact: string
  }>
  technologyEvolution: Array<{ year: number; technologies: string[] }>
  generatedAt: Date
}

const PortfolioTimelineSchema = new Schema<IPortfolioTimeline>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  milestones: [{
    year: Number,
    month: Number,
    title: String,
    description: String,
    type: { type: String, enum: ['project', 'technology', 'achievement'] },
    repositoryId: { type: Schema.Types.ObjectId, ref: 'Repository' },
    impact: String,
  }],
  technologyEvolution: [{ year: Number, technologies: [String] }],
  generatedAt: { type: Date, default: Date.now },
}, { timestamps: true })

export const PortfolioTimeline = mongoose.model<IPortfolioTimeline>('PortfolioTimeline', PortfolioTimelineSchema)
