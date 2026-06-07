import { motion } from 'framer-motion'
import { X, Bell, CheckCheck } from 'lucide-react'
import { useNotificationStore } from '../../store/notificationStore'
import { formatDistanceToNow } from 'date-fns'

export function NotificationCenter() {
  const { notifications, markRead, markAllRead, setOpen } = useNotificationStore()

  const typeLabel: Record<string, string> = {
    sync_complete:     'SYNC',
    analysis_complete: 'ANALYSIS',
    export_ready:      'EXPORT',
    report_ready:      'REPORT',
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      style={{
        position: 'fixed',
        top: 56,
        right: 0,
        width: 360,
        maxHeight: '70vh',
        background: 'var(--paper)',
        border: 'var(--border-thick)',
        borderTop: 'none',
        zIndex: 50,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 20px',
        borderBottom: 'var(--border-thick)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Bell size={14} strokeWidth={1.5} color="var(--ink)" />
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--ink)',
          }}>
            Notifications
          </span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            onClick={markAllRead}
            style={{
              background: 'none',
              border: 'var(--border-thin)',
              color: 'var(--neutral-500)',
              fontSize: '0.65rem',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 8px',
              transition: 'all 0.1s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--ink)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--paper)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--neutral-500)' }}
          >
            <CheckCheck size={11} strokeWidth={1.5} /> All read
          </button>
          <button
            onClick={() => setOpen(false)}
            style={{ background: 'none', border: 'none', color: 'var(--neutral-400)', cursor: 'pointer', padding: '4px 6px' }}
          >
            <X size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* List */}
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {notifications.length === 0 ? (
          <div style={{
            padding: '48px 24px',
            textAlign: 'center',
            color: 'var(--neutral-400)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            letterSpacing: '0.08em',
          }}>
            <Bell size={24} strokeWidth={1} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((n, i) => (
            <motion.div
              key={n._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => !n.isRead && markRead(n._id)}
              style={{
                padding: '14px 20px',
                borderBottom: 'var(--border-muted)',
                background: n.isRead ? 'transparent' : 'var(--neutral-100)',
                cursor: n.isRead ? 'default' : 'pointer',
                transition: 'background 0.1s',
                display: 'grid',
                gridTemplateColumns: '40px 1fr',
                gap: 12,
                alignItems: 'flex-start',
              }}
            >
              {/* Type badge */}
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '3px 4px',
                border: 'var(--border-thin)',
                background: n.isRead ? 'transparent' : 'var(--ink)',
                color: n.isRead ? 'var(--neutral-500)' : 'var(--paper)',
                textAlign: 'center',
                alignSelf: 'start',
                marginTop: 2,
              }}>
                {typeLabel[n.type] || 'NEW'}
              </div>

              <div>
                <div style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: 'var(--ink)',
                  marginBottom: 3,
                  lineHeight: 1.3,
                }}>
                  {n.title}
                </div>
                <div style={{
                  fontFamily: 'var(--font-serif-body)',
                  fontSize: '0.78rem',
                  color: 'var(--neutral-600)',
                  lineHeight: 1.5,
                  marginBottom: 4,
                }}>
                  {n.message}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.08em',
                  color: 'var(--neutral-400)',
                }}>
                  {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  )
}
