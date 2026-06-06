import { useEffect, useRef, ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, Dna, BarChart2, UserCheck, Trophy, BookOpen, 
  Gift, GraduationCap, Briefcase, Link2, Clock, FileText, 
  Globe, Settings, ChevronRight, Zap, LogOut, RefreshCw, GitBranch
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useGitHubStore } from '../../store/githubStore'
import { useNotificationStore } from '../../store/notificationStore'
import { NotificationBell } from '../notifications/NotificationBell'
import { NotificationCenter } from '../notifications/NotificationCenter'
import { CommandPalette } from '../command/CommandPalette'

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/developer-dna', icon: Dna, label: 'Developer DNA', flag: 'ENABLE_DEVELOPER_DNA', accent: true },
  { path: '/portfolio-score', icon: BarChart2, label: 'Portfolio Score' },
  { path: '/ai-recruiter', icon: UserCheck, label: 'AI Recruiter' },
  { path: '/repository-ranking', icon: Trophy, label: 'Repo Ranking' },
  { path: '/readme-analyzer', icon: BookOpen, label: 'README Analyzer' },
  { path: '/github-wrapped', icon: Gift, label: 'GitHub Wrapped' },
  { path: '/ai-mentor', icon: GraduationCap, label: 'AI Mentor' },
  { path: '/career-readiness', icon: Briefcase, label: 'Career Readiness' },
  { path: '/linkedin-generator', icon: Link2, label: 'LinkedIn Generator' },
  { path: '/portfolio-timeline', icon: Clock, label: 'Timeline' },
  { path: '/resume-builder', icon: FileText, label: 'Resume Builder' },
  { path: '/portfolio-generator', icon: Globe, label: 'Portfolio Gen' },
  { path: '/repository-compare', icon: GitBranch, label: 'Repo Compare' },
]

interface AuthLayoutProps { children: ReactNode }

export function AuthLayout({ children }: AuthLayoutProps) {
  const { user, logout } = useAuthStore()
  const { profile, sync, isSyncing } = useGitHubStore()
  const { unreadCount, fetchUnread, isOpen } = useNotificationStore()
  const location = useLocation()
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    fetchUnread()
    pollRef.current = setInterval(fetchUnread, 30000)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [fetchUnread])

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <nav className="sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Zap size={18} color="white" />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.02em' }}>
                GitInsight AI
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Intelligence Platform
              </div>
            </div>
          </div>
        </div>

        {/* GitHub Profile Quick Info */}
        {profile && (
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src={profile.avatarUrl} alt={profile.username} 
                style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid var(--accent-blue)' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, truncate: true }}>@{profile.username}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {profile.publicRepos} repos · {profile.totalStars} ⭐
                </div>
              </div>
              <button onClick={sync} disabled={isSyncing}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
                title="Sync GitHub">
                <RefreshCw size={14} style={{ animation: isSyncing ? 'spin-slow 1s linear infinite' : 'none' }} />
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ flex: 1, padding: '12px 12px', overflowY: 'auto' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', 
            textTransform: 'uppercase', color: 'var(--text-muted)', padding: '8px 8px 4px' }}>
            Features
          </div>
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 10, marginBottom: 2,
                textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
                transition: 'all 0.15s ease',
                background: isActive ? 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.1))' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                borderLeft: isActive ? '2px solid var(--accent-blue)' : '2px solid transparent',
              })}>
              <item.icon size={16} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.accent && (
                <span style={{ fontSize: '0.6rem', padding: '2px 6px', borderRadius: 4,
                  background: 'var(--accent-purple-dim)', color: 'var(--accent-purple)', fontWeight: 700 }}>
                  AI
                </span>
              )}
            </NavLink>
          ))}
          <div style={{ margin: '12px 0 4px', borderTop: '1px solid var(--glass-border)' }} />
          <NavLink to="/settings"
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 10, marginBottom: 2,
              textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: isActive ? 'var(--glass-bg)' : 'transparent',
            })}>
            <Settings size={16} />
            Settings
          </NavLink>
        </div>

        {/* Bottom User */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
            borderRadius: 10, background: 'var(--glass-bg)' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8rem', fontWeight: 700 }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{user?.name}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email}
              </div>
            </div>
            <button onClick={logout}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main */}
      <div className="main-content">
        {/* Top Nav */}
        <header className="topnav" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {location.pathname.split('/').filter(Boolean).map((segment, i, arr) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {i > 0 && <ChevronRight size={12} color="var(--text-muted)" />}
                <span style={{
                  fontSize: '0.875rem',
                  color: i === arr.length - 1 ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontWeight: i === arr.length - 1 ? 600 : 400,
                  textTransform: 'capitalize',
                }}>
                  {segment.replace(/-/g, ' ')}
                </span>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px',
                background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                borderRadius: 8, cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.8rem',
              }}>
              <span>Search</span>
              <kbd style={{ fontSize: '0.7rem', padding: '1px 5px', borderRadius: 4,
                background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>⌘K</kbd>
            </button>
            <NotificationBell count={unreadCount} />
          </div>
        </header>

        {/* Page Content */}
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            style={{ flex: 1 }}
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>

      {/* Overlays */}
      {isOpen && <NotificationCenter />}
      <CommandPalette />
    </div>
  )
}
