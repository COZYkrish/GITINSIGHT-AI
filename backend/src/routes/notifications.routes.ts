import { Router, Response } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware'
import { getUnreadNotifications, getAllNotifications, markAsRead, markAllAsRead } from '../services/notification.service'
import { Notification } from '../models/Notification'

const router = Router()
router.use(authMiddleware)

router.get('/', async (req: AuthRequest, res: Response) => {
  const notifications = await getAllNotifications(req.userId!)
  res.json(notifications)
})

router.get('/unread', async (req: AuthRequest, res: Response) => {
  const notifications = await getUnreadNotifications(req.userId!)
  res.json({ count: notifications.length, notifications })
})

router.patch('/:id/read', async (req: AuthRequest, res: Response) => {
  const notification = await markAsRead(String(req.params.id), req.userId!)
  res.json(notification)
})

router.patch('/read-all', async (req: AuthRequest, res: Response) => {
  await markAllAsRead(req.userId!)
  res.json({ success: true })
})

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  await Notification.findOneAndDelete({ _id: req.params.id, userId: req.userId })
  res.json({ success: true })
})

export default router
