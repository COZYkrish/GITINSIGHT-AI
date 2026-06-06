import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, User, GitBranch, Bell, Shield, Zap, LogOut, Trash2, ExternalLink, RefreshCw } from 'lucide-react'
import { GlassCard, GlowBadge } from '../../components/ui/GlassCard'
import { useAuthStore } from '../../store/authStore'
import { useGitHubStore } from '../../store/githubStore'
import api from '../../services/api'

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'github', label: 'GitHub', icon: GitBranch },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'ai', label: 'AI Usage', icon: Zap },
  { id: 'danger', label: 'Danger Zone', icon: Shield },
] as const

type Tab = typeof TABS[number]['id']

export function SettingsPage() {
  const [tab, setTab] = useState<Tab>('profile')
  const { user, logout } = useAuthStore()
  const { profile, sync, isSyncing } = useGitHubStore()
  const [monthlyUsage, setMonthlyUsage] = useState<{ totalTokens: number; byFeature: Record<string, number>; callCount: number } | null>(null)
  const [isLoadingUsage, setIsLoadingUsage] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  const loadAIUsage = async () => {
    setIsLoadingUsage(true)
    try {
      const { data } = await api.get('/api/user/ai-usage')
      setMonthlyUsage(data)
    } catch (e) { console.error(e) }
    setIsLoadingUsage(false)
  }

  const deleteAccount = async () => {
    if (!deleteConfirm) { setDeleteConfirm(true); return }
    await api.delete('/api/user/account')
    logout()
  }

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 32 }}>
        <div className="section-label">Account</div>
        <h1>Settings</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your account, GitHub connection, and AI preferences</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24 }}>
        {/* Tab Nav */}
        <div>
          <GlassCard style={{ padding: '8px' }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => { setTab(t.id); if (t.id === 'ai') loadAIUsage() }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', borderRadius: 9, marginBottom: 2,
                  background: tab === t.id ? 'var(--accent-blue-dim)' : 'transparent', border: 'none', cursor: 'pointer',
                  color: tab === t.id ? 'var(--accent-blue)' : 'var(--text-secondary)', fontWeight: tab === t.id ? 600 : 400, fontSize: '0.875rem',
                  textAlign: 'left', transition: 'all 0.15s ease' }}>
                <t.icon size={16} />
                {t.label}
              </button>
            ))}
          </GlassCard>
        </div>

        {/* Content */}
        <div>
          {tab === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <GlassCard>
                <div className="section-label" style={{ marginBottom: 20 }}>Profile Information</div>
                <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 24, padding: '16px 20px', background: 'var(--glass-bg)', borderRadius: 12 }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 700 }}>
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{user?.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{user?.email}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[{ label: 'Full Name', value: user?.name || '' }, { label: 'Email', value: user?.email || '' }].map(f => (
                    <div key={f.label}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>{f.label}</label>
                      <input className="glass-input" defaultValue={f.value} />
                    </div>
                  ))}
                  <button className="btn-primary" style={{ alignSelf: 'flex-start', padding: '10px 24px' }}>Save Changes</button>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {tab === 'github' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <GlassCard>
                <div className="section-label" style={{ marginBottom: 16 }}>GitHub Connection</div>
                {profile ? (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, padding: '16px', background: 'rgba(16,185,129,0.06)', borderRadius: 12, border: '1px solid rgba(16,185,129,0.3)' }}>
                      <img src={profile.avatarUrl} alt="" style={{ width: 48, height: 48, borderRadius: '50%' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700 }}>@{profile.username}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--accent-green)' }}>✓ Connected</div>
                      </div>
                      <a href={`https://github.com/${profile.username}`} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ fontSize: '0.8rem', display: 'flex', gap: 4 }}>
                        <ExternalLink size={13} /> View on GitHub
                      </a>
                    </div>
                    <div style={{ display: 'flex', gap: 24, marginBottom: 20, padding: '16px', background: 'var(--glass-bg)', borderRadius: 12 }}>
                      {[
                        { label: 'Repos', val: profile.publicRepos },
                        { label: 'Stars', val: profile.totalStars },
                        { label: 'Followers', val: profile.followers },
                        { label: 'Top Lang', val: profile.topLanguage },
                      ].map(({ label, val }) => (
                        <div key={label} style={{ textAlign: 'center' }}>
                          <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent-blue)' }}>{val}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{label}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <button className="btn-secondary" onClick={sync} disabled={isSyncing} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.875rem' }}>
                        <RefreshCw size={15} style={{ animation: isSyncing ? 'spin-slow 1s linear infinite' : 'none' }} />
                        {isSyncing ? 'Syncing...' : 'Sync Now'}
                      </button>
                      {profile.lastSyncedAt && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Last sync: {new Date(profile.lastSyncedAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>GitHub not connected</p>
                    <a href="/connect-github" className="btn-primary">Connect GitHub</a>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          )}

          {tab === 'ai' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <GlassCard>
                <div className="section-label" style={{ marginBottom: 16 }}>AI Token Usage (This Month)</div>
                {isLoadingUsage ? (
                  <div className="shimmer" style={{ height: 200 }} />
                ) : monthlyUsage ? (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                      {[
                        { label: 'Total Tokens', val: monthlyUsage.totalTokens.toLocaleString(), color: 'var(--accent-blue)' },
                        { label: 'API Calls', val: monthlyUsage.callCount, color: 'var(--accent-purple)' },
                        { label: 'Features Used', val: Object.keys(monthlyUsage.byFeature).length, color: 'var(--accent-cyan)' },
                      ].map(({ label, val, color }) => (
                        <div key={label} style={{ padding: '16px', background: 'var(--glass-bg)', borderRadius: 12, border: '1px solid var(--glass-border)', textAlign: 'center' }}>
                          <div style={{ fontSize: '1.5rem', fontWeight: 800, color, fontFamily: 'var(--font-mono)' }}>{val}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
                        </div>
                      ))}
                    </div>
                    <div className="section-label" style={{ marginBottom: 12 }}>Usage by Feature</div>
                    {Object.entries(monthlyUsage.byFeature).map(([feature, tokens]) => (
                      <div key={feature} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--glass-border)', fontSize: '0.875rem' }}>
                        <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{feature.replace(/_/g, ' ')}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)' }}>{tokens.toLocaleString()} tokens</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    <Zap size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                    <p>No AI usage data yet</p>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          )}

          {tab === 'danger' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <GlassCard style={{ border: '1px solid rgba(236,72,153,0.3)' }}>
                <div className="section-label" style={{ marginBottom: 16, color: 'var(--accent-pink)' }}>⚠️ Danger Zone</div>
                <div style={{ padding: '20px', background: 'rgba(236,72,153,0.05)', borderRadius: 12, border: '1px solid rgba(236,72,153,0.2)' }}>
                  <h4 style={{ marginBottom: 8, color: 'var(--accent-pink)' }}>Delete Account</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
                    This permanently deletes your account, all analysis reports, and synced GitHub data. This cannot be undone.
                  </p>
                  <button onClick={deleteAccount}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 8, border: '1px solid var(--accent-pink)', background: deleteConfirm ? 'rgba(236,72,153,0.2)' : 'transparent', color: 'var(--accent-pink)', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s ease' }}>
                    <Trash2 size={16} />
                    {deleteConfirm ? 'Click again to confirm deletion' : 'Delete My Account'}
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
