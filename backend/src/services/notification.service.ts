import { Notification } from '../models/Notification'

type NotificationType = 'sync_complete' | 'analysis_complete' | 'export_ready' | 'report_ready'

export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  metadata?: Record<string, string>
): Promise<void> {
  try {
    await Notification.create({ userId, type, title, message, metadata })
  } catch (err) {
    console.warn('⚠️  Failed to create notification:', err)
  }
}

export async function getUnreadNotifications(userId: string) {
  return Notification.find({ userId, isRead: false }).sort({ createdAt: -1 }).limit(20)
}

export async function getAllNotifications(userId: string) {
  return Notification.find({ userId }).sort({ createdAt: -1 }).limit(50)
}

export async function markAsRead(notificationId: string, userId: string) {
  return Notification.findOneAndUpdate({ _id: notificationId, userId }, { isRead: true }, { new: true })
}

export async function markAllAsRead(userId: string) {
  return Notification.updateMany({ userId, isRead: false }, { isRead: true })
}
