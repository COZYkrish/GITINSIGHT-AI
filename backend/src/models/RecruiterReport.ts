import mongoose, { Schema, Document } from 'mongoose'

export interface IRecruiterReport extends Document {
  userId: mongoose.Types.ObjectId
  verdict: string
  hiringProbability: number
  strengths: string[]
  weaknesses: string[]
  technicalEval: { score: number; notes: string }
  communicationEval: { score: number; notes: string }
  portfolioEval: { score: number; notes: string }
  seniorPerspective: string
  startupPerspective: string
  fullReport: string
  generatedAt: Date
  jobId?: string
}

const RecruiterReportSchema = new Schema<IRecruiterReport>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  verdict: String,
  hiringProbability: { type: Number, default: 0 },
  strengths: [String],
  weaknesses: [String],
  technicalEval: { score: Number, notes: String },
  communicationEval: { score: Number, notes: String },
  portfolioEval: { score: Number, notes: String },
  seniorPerspective: String,
  startupPerspective: String,
  fullReport: String,
  generatedAt: { type: Date, default: Date.now },
  jobId: String,
}, { timestamps: true })

export const RecruiterReport = mongoose.model<IRecruiterReport>('RecruiterReport', RecruiterReportSchema)
