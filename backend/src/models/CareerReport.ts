import mongoose, { Schema, Document } from 'mongoose'

export interface ICareerReport extends Document {
  userId: mongoose.Types.ObjectId
  roles: Array<{
    name: string
    matchPercentage: number
    skillGaps: string[]
    hiringReadiness: string
    timeline: string
    growthOpportunities: string[]
  }>
  overallReadiness: number
  generatedAt: Date
  jobId?: string
}

const CareerReportSchema = new Schema<ICareerReport>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  roles: [{
    name: String,
    matchPercentage: Number,
    skillGaps: [String],
    hiringReadiness: String,
    timeline: String,
    growthOpportunities: [String],
  }],
  overallReadiness: { type: Number, default: 0 },
  generatedAt: { type: Date, default: Date.now },
  jobId: String,
}, { timestamps: true })

export const CareerReport = mongoose.model<ICareerReport>('CareerReport', CareerReportSchema)
