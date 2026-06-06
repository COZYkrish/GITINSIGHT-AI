import mongoose, { Schema, Document } from 'mongoose'

export interface IMentorReport extends Document {
  userId: mongoose.Types.ObjectId
  developerLevel: string
  strengths: string[]
  weaknesses: string[]
  feedback: string
  learningRoadmap: Array<{ phase: string; duration: string; topics: string[] }>
  recommendedTech: string[]
  recommendedProjects: string[]
  weeklyGoals: string[]
  monthlyRoadmap: string[]
  generatedAt: Date
}

const MentorReportSchema = new Schema<IMentorReport>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  developerLevel: String,
  strengths: [String],
  weaknesses: [String],
  feedback: String,
  learningRoadmap: [{ phase: String, duration: String, topics: [String] }],
  recommendedTech: [String],
  recommendedProjects: [String],
  weeklyGoals: [String],
  monthlyRoadmap: [String],
  generatedAt: { type: Date, default: Date.now },
}, { timestamps: true })

export const MentorReport = mongoose.model<IMentorReport>('MentorReport', MentorReportSchema)
