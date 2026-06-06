import mongoose, { Schema, Document } from 'mongoose'

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId
  type: 'sync_complete' | 'analysis_complete' | 'export_ready' | 'report_ready'
  title: string
  message: string
  metadata?: { jobId?: string; reportType?: string; reportId?: string }
  isRead: boolean
  createdAt: Date
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['sync_complete', 'analysis_complete', 'export_ready', 'report_ready'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  metadata: { jobId: String, reportType: String, reportId: String },
  isRead: { type: Boolean, default: false },
}, { timestamps: true })

NotificationSchema.index({ userId: 1, isRead: 1 })

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema)
