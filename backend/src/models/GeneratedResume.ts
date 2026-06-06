import mongoose, { Schema, Document } from 'mongoose'

export interface IGeneratedResume extends Document {
  userId: mongoose.Types.ObjectId
  type: 'ats' | 'fullstack' | 'frontend' | 'ai'
  content: {
    header: Record<string, unknown>
    summary: string
    skills: string[]
    experience: Array<Record<string, unknown>>
    projects: Array<Record<string, unknown>>
    education: Array<Record<string, unknown>>
  }
  resumeScore: number
  recruiterOptimization: string[]
  generatedAt: Date
  jobId?: string
}

const GeneratedResumeSchema = new Schema<IGeneratedResume>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['ats', 'fullstack', 'frontend', 'ai'], required: true },
  content: { type: Schema.Types.Mixed, default: {} },
  resumeScore: { type: Number, default: 0 },
  recruiterOptimization: [String],
  generatedAt: { type: Date, default: Date.now },
  jobId: String,
}, { timestamps: true })

export const GeneratedResume = mongoose.model<IGeneratedResume>('GeneratedResume', GeneratedResumeSchema)
