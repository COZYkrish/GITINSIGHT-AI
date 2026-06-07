import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Dna, BarChart2, UserCheck, Trophy, BookOpen,
  Gift, GraduationCap, Briefcase, Link2, Clock, FileText,
  Globe, Settings, ChevronRight, LogOut, RefreshCw, GitBranch
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useGitHubStore } from '../../store/githubStore'
import { useNotificationStore } from '../../store/notificationStore'
import { NotificationBell } from '../notifications/NotificationBell'
import { NotificationCenter } from '../notifications/NotificationCenter'
import { CommandPalette } from '../command/CommandPalette'

const navSections = [
  {
    label: 'Overview',
    items: [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { path: '/developer-dna', icon: Dna, label: 'Developer DNA', flag: true },
      { path: '/portfolio-score', icon: BarChart2, label: 'Portfolio Score' },
      { path: '/ai-recruiter', icon: UserCheck, label: 'AI Recruiter' },
      { path: '/career-readiness', icon: Briefcase, label: 'Career Readiness' },
      { path: '/github-wrapped', icon: Gift, label: 'GitHub Wrapped' },
    ],
  },
  {
    label: 'Repositories',
    items: [
      { path: '/repository-ranking', icon: Trophy, label: 'Repo Ranking' },
      { path: '/readme-analyzer', icon: BookOpen, label: 'README Analyzer' },
      { path: '/repository-compare', icon: GitBranch, label: 'Repo Compare' },
    ],
  },
  {
    label: 'Career Tools',
    items: [
      { path: '/ai-mentor', icon: GraduationCap, label: 'AI Mentor' },
      { path: '/linkedin-generator', icon: Link2, label: 'LinkedIn Generator' },
      { path: '/portfolio-timeline', icon: Clock, label: 'Timeline' },
      { path: '/resume-builder', icon: FileText, label: 'Resume Builder' },
      { path: '/portfolio-generator', icon: Globe, label: 'Portfolio Gen' },
    ],
  },
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

  // Derive page title from pathname
  const pageTitle = location.pathname.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') ?? 'dashboard'

  return (
    <div className="app-layout">
      {/* ── SIDEBAR ─────────────────────────────────────── */}
      <nav className="sidebar" style={{ display: 'flex', flexDirection: 'column', userSelect: 'none' }}>

        {/* Masthead / Logo */}
        <div style={{ borderBottom: 'var(--border-thick)', padding: '20px 20px 16px' }}>
          <div style={{
            fontFamily: 'var(--font-serif-display)',
            fontWeight: 900,
            fontSize: '1.05rem',
            letterSpacing: '-0.02em',
            color: 'var(--ink)',
            lineHeight: 1,
          }}>
            GitInsight AI
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.52rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--neutral-400)',
            marginTop: 5,
          }}>
            Intelligence Platform
          </div>
        </div>

        {/* GitHub Profile */}
        {profile && (
          <div style={{ borderBottom: 'var(--border-thin)', padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img
                src={profile.avatarUrl}
                alt={profile.username}
                style={{
                  width: 32, height: 32,
                  border: 'var(--border-thick)',
                  borderRadius: 0,
                  filter: 'grayscale(100%)',
                  transition: 'filter 0.2s',
                }}
                onMouseEnter={e => ((e.target as HTMLImageElement).style.filter = 'grayscale(0%)')}
                onMouseLeave={e => ((e.target as HTMLImageElement).style.filter = 'grayscale(100%)')}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--ink)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  @{profile.username}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.06em',
                  color: 'var(--neutral-500)',
                }}>
                  {profile.publicRepos} repos · {profile.totalStars} ★
                </div>
              </div>
              <button
                onClick={sync}
                disabled={isSyncing}
                title="Sync GitHub"
                style={{
                  background: 'none', border: 'none',
                  color: 'var(--neutral-400)', cursor: 'pointer',
                  padding: 4, display: 'flex', alignItems: 'center',
                }}
              >
                <RefreshCw
                  size={13}
                  strokeWidth={1.5}
                  style={{ animation: isSyncing ? 'spin-slow 1s linear infinite' : 'none' }}
                />
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {navSections.map(section => (
            <div key={section.label}>
              {/* Section label */}
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.55rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--neutral-400)',
                padding: '16px 16px 6px',
              }}>
                {section.label}
              </div>
              {section.items.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '9px 16px',
                    textDecoration: 'none',
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: isActive ? 700 : 500,
                    transition: 'all 0.1s',
                    background: isActive ? 'var(--ink)' : 'transparent',
                    color: isActive ? 'var(--paper)' : 'var(--neutral-600)',
                    borderLeft: isActive ? '0px' : '0px',
                    letterSpacing: isActive ? '0.02em' : '0',
                  })}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        size={15}
                        strokeWidth={isActive ? 2 : 1.5}
                        color={isActive ? 'var(--paper)' : 'var(--neutral-500)'}
                      />
                      <span style={{ flex: 1 }}>{item.label}</span>
                      {item.flag && (
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.5rem',
                          letterSpacing: '0.1em',
                          padding: '2px 5px',
                          border: isActive ? '1px solid var(--paper)' : 'var(--border-thin)',
                          color: isActive ? 'var(--paper)' : 'var(--ink)',
                          textTransform: 'uppercase',
                        }}>
                          AI
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
              <div style={{ height: 1, background: 'var(--muted)', margin: '8px 16px' }} />
            </div>
          ))}

          {/* Settings */}
          <NavLink
            to="/settings"
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '9px 16px',
              textDecoration: 'none',
              fontSize: '0.82rem',
              fontFamily: 'var(--font-sans)',
              fontWeight: isActive ? 700 : 500,
              background: isActive ? 'var(--ink)' : 'transparent',
              color: isActive ? 'var(--paper)' : 'var(--neutral-600)',
              transition: 'all 0.1s',
            })}
          >
            {({ isActive }) => (
              <>
                <Settings size={15} strokeWidth={1.5} color={isActive ? 'var(--paper)' : 'var(--neutral-500)'} />
                Settings
              </>
            )}
          </NavLink>
        </div>

        {/* Bottom user */}
        <div style={{ borderTop: 'var(--border-thick)', padding: '14px 16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px',
            background: 'var(--neutral-100)',
            border: 'var(--border-thin)',
          }}>
            <div style={{
              width: 28, height: 28,
              background: 'var(--ink)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-serif-display)',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--paper)',
              flexShrink: 0,
            }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--ink)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {user?.name}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                color: 'var(--neutral-500)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {user?.email}
              </div>
            </div>
            <button
              onClick={logout}
              style={{ background: 'none', border: 'none', color: 'var(--neutral-400)', cursor: 'pointer', padding: 4 }}
              title="Sign out"
            >
              <LogOut size={13} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── MAIN CONTENT ─────────────────────────────────── */}
      <div className="main-content">

        {/* Topnav */}
        <header className="topnav" style={{ justifyContent: 'space-between' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {location.pathname.split('/').filter(Boolean).map((segment, i, arr) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {i > 0 && <ChevronRight size={11} color="var(--neutral-400)" />}
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: i === arr.length - 1 ? 'var(--ink)' : 'var(--neutral-400)',
                  fontWeight: i === arr.length - 1 ? 700 : 400,
                }}>
                  {segment.replace(/-/g, ' ')}
                </span>
              </span>
            ))}
          </div>

          {/* Right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            <button
              onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                background: 'transparent',
                border: 'none',
                borderLeft: 'var(--border-thin)',
                cursor: 'pointer',
                color: 'var(--neutral-500)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.08em',
                height: '100%',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--neutral-100)')}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
            >
              Search
              <kbd style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                padding: '2px 6px',
                border: 'var(--border-thin)',
                background: 'var(--neutral-100)',
              }}>
                ⌘K
              </kbd>
            </button>
            <div style={{ borderLeft: 'var(--border-thin)', padding: '0 12px', height: '100%', display: 'flex', alignItems: 'center' }}>
              <NotificationBell count={unreadCount} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
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
