import { Bell } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNotificationStore } from '../../store/notificationStore'

interface NotificationBellProps { count: number }

export function NotificationBell({ count }: NotificationBellProps) {
  const { setOpen, isOpen } = useNotificationStore()

  return (
    <button
      onClick={() => setOpen(!isOpen)}
      style={{
        position: 'relative', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
        borderRadius: 10, padding: '8px', cursor: 'pointer', color: 'var(--text-secondary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s ease',
      }}
    >
      <Bell size={18} />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            style={{
              position: 'absolute', top: -4, right: -4,
              width: 18, height: 18, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
              fontSize: '0.65rem', fontWeight: 700, display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: 'white',
            }}
          >
            {count > 9 ? '9+' : count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
