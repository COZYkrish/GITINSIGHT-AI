import mongoose, { Schema, Document } from 'mongoose'

export interface ILinkedInGeneration extends Document {
  userId: mongoose.Types.ObjectId
  type: string
  repositoryId?: mongoose.Types.ObjectId
  content: string
  prompt: string
  generatedAt: Date
}

const LinkedInGenerationSchema = new Schema<ILinkedInGeneration>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  repositoryId: { type: Schema.Types.ObjectId, ref: 'Repository' },
  content: String,
  prompt: String,
  generatedAt: { type: Date, default: Date.now },
}, { timestamps: true })

export const LinkedInGeneration = mongoose.model<ILinkedInGeneration>('LinkedInGeneration', LinkedInGenerationSchema)
