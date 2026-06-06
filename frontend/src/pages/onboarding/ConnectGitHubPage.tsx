import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { GitBranch, Lock, Zap, ArrowRight } from 'lucide-react'
import api from '../../services/api'
import { useAuthStore } from '../../store/authStore'

const permissions = [
  { icon: '👤', label: 'Read your public profile' },
  { icon: '📁', label: 'Read your repositories' },
  { icon: '🔒', label: 'Read-only — we never write or delete' },
  { icon: '🛡️', label: 'Your token is encrypted at rest' },
]

export function ConnectGitHubPage() {
  const [isRedirecting, setIsRedirecting] = useState(false)
  const { user } = useAuthStore()

  const connect = async () => {
    setIsRedirecting(true)
    try {
      const { data } = await api.get('/api/auth/github')
      window.location.href = data.url
    } catch (err) {
      setIsRedirecting(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
      <div style={{ position: 'absolute', top: '30%', right: '20%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', maxWidth: 480, padding: '0 40px' }}>
        
        {/* GitHub icon with pulse */}
        <motion.div
          animate={{ boxShadow: ['0 0 20px rgba(59,130,246,0.3)', '0 0 60px rgba(59,130,246,0.6)', '0 0 20px rgba(59,130,246,0.3)'] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--glass-bg)', border: '2px solid var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
          <GitBranch size={36} color="var(--accent-blue)" />
        </motion.div>

        <div className="section-label" style={{ marginBottom: 12 }}>Step 2 of 3</div>
        <h1 style={{ marginBottom: 16 }}>Connect GitHub</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 40, lineHeight: 1.7 }}>
          Authorize GitInsight AI to read your GitHub profile and repositories. We need this to generate your AI intelligence reports.
        </p>

        {/* Permission list */}
        <div className="glass-card" style={{ textAlign: 'left', marginBottom: 32, padding: '20px 24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12, fontWeight: 600 }}>
            We'll request access to:
          </div>
          {permissions.map((p) => (
            <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--glass-border)' }}>
              <span style={{ fontSize: '1.1rem' }}>{p.icon}</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{p.label}</span>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 12, color: 'var(--text-muted)', fontSize: '0.78rem' }}>
            <Lock size={12} /> OAuth 2.0 · Industry standard security
          </div>
        </div>

        <button className="btn-primary" onClick={connect} disabled={isRedirecting}
          style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '16px' }}>
          <GitBranch size={20} />
          {isRedirecting ? 'Redirecting to GitHub...' : 'Authorize with GitHub'}
          <ArrowRight size={18} />
        </button>
      </motion.div>
    </div>
  )
}
