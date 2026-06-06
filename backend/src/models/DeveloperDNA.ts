import mongoose, { Schema, Document } from 'mongoose'

export interface IDeveloperDNA extends Document {
  userId: mongoose.Types.ObjectId
  archetype: string
  archetypeEmoji: string
  description: string
  strengths: string[]
  weaknesses: string[]
  recommendedRoles: string[]
  recommendedTechnologies: string[]
  recommendedProjects: string[]
  careerTrajectory: string
  personalityTraits: Array<{ trait: string; score: number }>
  compatibleArchetypes: string[]
  generatedAt: Date
  jobId?: string
}

const DeveloperDNASchema = new Schema<IDeveloperDNA>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    archetype: { type: String, required: true },
    archetypeEmoji: { type: String, default: '🧬' },
    description: { type: String, required: true },
    strengths: [String],
    weaknesses: [String],
    recommendedRoles: [String],
    recommendedTechnologies: [String],
    recommendedProjects: [String],
    careerTrajectory: String,
    personalityTraits: [{ trait: String, score: Number }],
    compatibleArchetypes: [String],
    generatedAt: { type: Date, default: Date.now },
    jobId: String,
  },
  { timestamps: true }
)

export const DeveloperDNA = mongoose.model<IDeveloperDNA>('DeveloperDNA', DeveloperDNASchema)
