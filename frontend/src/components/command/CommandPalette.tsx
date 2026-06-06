import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Search, LayoutDashboard, Dna, BarChart2, UserCheck, Trophy, 
         BookOpen, Gift, GraduationCap, Briefcase, Link2, Clock, 
         FileText, Globe, Settings, GitBranch, X } from 'lucide-react'
import { useGitHubStore } from '../../store/githubStore'

const commands = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, category: 'Navigate' },
  { id: 'dna', label: 'Developer DNA', path: '/developer-dna', icon: Dna, category: 'Navigate' },
  { id: 'portfolio', label: 'Portfolio Score', path: '/portfolio-score', icon: BarChart2, category: 'Navigate' },
  { id: 'recruiter', label: 'AI Recruiter', path: '/ai-recruiter', icon: UserCheck, category: 'Navigate' },
  { id: 'ranking', label: 'Repository Ranking', path: '/repository-ranking', icon: Trophy, category: 'Navigate' },
  { id: 'readme', label: 'README Analyzer', path: '/readme-analyzer', icon: BookOpen, category: 'Navigate' },
  { id: 'wrapped', label: 'GitHub Wrapped', path: '/github-wrapped', icon: Gift, category: 'Navigate' },
  { id: 'mentor', label: 'AI Mentor', path: '/ai-mentor', icon: GraduationCap, category: 'Navigate' },
  { id: 'career', label: 'Career Readiness', path: '/career-readiness', icon: Briefcase, category: 'Navigate' },
  { id: 'linkedin', label: 'LinkedIn Generator', path: '/linkedin-generator', icon: Link2, category: 'Navigate' },
  { id: 'timeline', label: 'Portfolio Timeline', path: '/portfolio-timeline', icon: Clock, category: 'Navigate' },
  { id: 'resume', label: 'Resume Builder', path: '/resume-builder', icon: FileText, category: 'Navigate' },
  { id: 'portfolio-gen', label: 'Portfolio Generator', path: '/portfolio-generator', icon: Globe, category: 'Navigate' },
  { id: 'compare', label: 'Compare Repositories', path: '/repository-compare', icon: GitBranch, category: 'Navigate' },
  { id: 'settings', label: 'Settings', path: '/settings', icon: Settings, category: 'Navigate' },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const { repositories } = useGitHubStore()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(prev => !prev)
        setQuery('')
        setSelected(0)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  const repoCommands = repositories.slice(0, 5).map(r => ({
    id: `repo-${r._id}`, label: r.name, path: `/repository/${r._id}`,
    icon: GitBranch, category: 'Repositories',
  }))

  const allCommands = [...commands, ...repoCommands]
  const filtered = query
    ? allCommands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))
    : allCommands

  const grouped = filtered.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = []
    acc[cmd.category].push(cmd)
    return acc
  }, {} as Record<string, typeof allCommands>)

  const flat = Object.values(grouped).flat()

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, flat.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
    if (e.key === 'Enter' && flat[selected]) {
      navigate(flat[selected].path)
      setOpen(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100 }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed', top: '15vh', left: '50%', transform: 'translateX(-50%)',
              width: '100%', maxWidth: 600,
              background: 'rgba(8,8,8,0.98)', backdropFilter: 'blur(50px)',
              border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)',
              zIndex: 101, overflow: 'hidden', boxShadow: 'var(--shadow-elevated)',
            }}
          >
            {/* Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px',
              borderBottom: '1px solid var(--glass-border)' }}>
              <Search size={18} color="var(--text-muted)" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => { setQuery(e.target.value); setSelected(0) }}
                onKeyDown={handleKeyDown}
                placeholder="Search pages, repositories, actions..."
                style={{
                  flex: 1, background: 'none', border: 'none', outline: 'none',
                  color: 'var(--text-primary)', fontSize: '0.95rem', fontFamily: 'var(--font-body)',
                }}
              />
              <button onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            {/* Results */}
            <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '8px' }}>
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                  <div style={{ padding: '8px 12px 4px', fontSize: '0.7rem', fontWeight: 600,
                    letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    {category}
                  </div>
                  {items.map(cmd => {
                    const idx = flat.indexOf(cmd)
                    const isSelected = idx === selected
                    return (
                      <div key={cmd.id}
                        onClick={() => { navigate(cmd.path); setOpen(false) }}
                        onMouseEnter={() => setSelected(idx)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                          background: isSelected ? 'rgba(59,130,246,0.1)' : 'transparent',
                          transition: 'background 0.1s ease',
                        }}
                      >
                        <cmd.icon size={16} color={isSelected ? 'var(--accent-blue)' : 'var(--text-muted)'} />
                        <span style={{ fontSize: '0.875rem', color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                          {cmd.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ))}
              {flat.length === 0 && (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  No results for "{query}"
                </div>
              )}
            </div>

            <div style={{ padding: '10px 20px', borderTop: '1px solid var(--glass-border)',
              display: 'flex', gap: 16, fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span>↑↓ navigate</span>
              <span>↵ open</span>
              <span>esc close</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
