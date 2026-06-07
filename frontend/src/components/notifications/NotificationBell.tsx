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
        position: 'relative',
        background: 'transparent',
        border: 'none',
        padding: '6px',
        cursor: 'pointer',
        color: 'var(--neutral-500)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'color 0.1s',
      }}
      onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--ink)')}
      onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--neutral-500)')}
    >
      <Bell size={17} strokeWidth={1.5} />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 16,
              height: 16,
              background: 'var(--red)',
              fontSize: '0.55rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              borderRadius: 0,
            }}
          >
            {count > 9 ? '9+' : count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
