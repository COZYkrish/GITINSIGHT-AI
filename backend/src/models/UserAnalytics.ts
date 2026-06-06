import mongoose, { Schema, Document } from 'mongoose'

export interface IUserAnalytics extends Document {
  userId: mongoose.Types.ObjectId
  event: string
  feature?: string
  metadata?: Record<string, unknown>
  timestamp: Date
}

const UserAnalyticsSchema = new Schema<IUserAnalytics>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: String, required: true },
  feature: String,
  metadata: { type: Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now },
})

UserAnalyticsSchema.index({ userId: 1, timestamp: -1 })

export const UserAnalytics = mongoose.model<IUserAnalytics>('UserAnalytics', UserAnalyticsSchema)
