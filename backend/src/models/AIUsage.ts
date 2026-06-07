import mongoose, { Schema, Document } from 'mongoose'

// Using a plain object type to avoid conflicts with Document.model property
export interface IAIUsage {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  feature: string
  aiModel: string    // renamed from 'model' to avoid Document conflict
  promptTokens: number
  completionTokens: number
  totalTokens: number
  success: boolean
  timestamp: Date
}

const AIUsageSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  feature: { type: String, required: true },
  aiModel: { type: String, default: 'gemini-2.5-flash' },
  promptTokens: { type: Number, default: 0 },
  completionTokens: { type: Number, default: 0 },
  totalTokens: { type: Number, default: 0 },
  success: { type: Boolean, default: true },
  timestamp: { type: Date, default: Date.now },
})

AIUsageSchema.index({ userId: 1, timestamp: -1 })

export const AIUsage = mongoose.model('AIUsage', AIUsageSchema)
