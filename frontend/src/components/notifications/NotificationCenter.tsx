import { motion } from 'framer-motion'
import { X, Bell, Check, CheckCheck } from 'lucide-react'
import { useNotificationStore } from '../../store/notificationStore'
import { formatDistanceToNow } from 'date-fns'

export function NotificationCenter() {
  const { notifications, markRead, markAllRead, setOpen } = useNotificationStore()

  const typeIcon: Record<string, string> = {
    sync_complete: '✅',
    analysis_complete: '🧠',
    export_ready: '📥',
    report_ready: '📊',
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      style={{
        position: 'fixed', top: 64, right: 20, width: 380, maxHeight: '70vh',
        background: 'rgba(8,8,8,0.95)', backdropFilter: 'blur(40px)',
        border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)',
        zIndex: 50, overflow: 'hidden', boxShadow: 'var(--shadow-elevated)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px', borderBottom: '1px solid var(--glass-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Bell size={16} color="var(--accent-blue)" />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9rem' }}>Notifications</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={markAllRead}
            style={{ background: 'none', border: 'none', color: 'var(--accent-blue)',
              fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <CheckCheck size={12} /> All read
          </button>
          <button onClick={() => setOpen(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
      </div>

      {/* List */}
      <div style={{ overflowY: 'auto', maxHeight: 'calc(70vh - 60px)' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            <Bell size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <p style={{ fontSize: '0.85rem' }}>No notifications yet</p>
          </div>
        ) : (
          notifications.map((n) => (
            <motion.div
              key={n._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => !n.isRead && markRead(n._id)}
              style={{
                padding: '14px 20px', borderBottom: '1px solid var(--glass-border)',
                background: n.isRead ? 'transparent' : 'rgba(59,130,246,0.05)',
                cursor: n.isRead ? 'default' : 'pointer',
                transition: 'background 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{typeIcon[n.type] || '🔔'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 2 }}>{n.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{n.message}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 6 }}>
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </div>
                </div>
                {!n.isRead && (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-blue)', flexShrink: 0, marginTop: 6 }} />
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  )
}
