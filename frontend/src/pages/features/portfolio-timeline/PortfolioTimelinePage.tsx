import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, RefreshCw, Clock } from 'lucide-react'
import { GlassCard, GlowBadge } from '../../../components/ui/GlassCard'
import api from '../../../services/api'

interface TimelineData {
  milestones: Array<{
    year: number
    month: number
    title: string
    description: string
    type: 'project' | 'technology' | 'achievement'
    impact: string
  }>
  technologyEvolution: Array<{ year: number; technologies: string[] }>
}

const TYPE_COLORS = { project: 'var(--accent-blue)', technology: 'var(--accent-purple)', achievement: 'var(--accent-amber)' }
const TYPE_ICONS = { project: '🚀', technology: '⚡', achievement: '🏆' }

export function PortfolioTimelinePage() {
  const [timeline, setTimeline] = useState<TimelineData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    api.get('/api/analysis/timeline').then(r => setTimeline(r.data)).catch(() => {}).finally(() => setIsLoading(false))
  }, [])

  const generate = async () => {
    setIsGenerating(true)
    try {
      const { data } = await api.post('/api/analysis/timeline')
      setTimeline(data)
    } catch (e) { console.error(e) }
    setIsGenerating(false)
  }

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div className="section-label">Developer Journey</div>
          <h1>Portfolio Timeline</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Your evolution as a developer — visualized chronologically</p>
        </div>
        <button className="btn-primary" onClick={generate} disabled={isGenerating}>
          {isGenerating ? <><RefreshCw size={16} style={{ animation: 'spin-slow 1s linear infinite' }} /> Building Timeline...</> : <><Clock size={16} /> {timeline ? 'Regenerate' : 'Generate Timeline'}</>}
        </button>
      </motion.div>

      {timeline ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 24 }}>
          {/* Vertical Timeline */}
          <div style={{ gridColumn: 'span 8' }}>
            <div className="section-label" style={{ marginBottom: 24 }}>Development Journey</div>
            <div style={{ position: 'relative', paddingLeft: 32 }}>
              {/* Vertical line */}
              <div style={{ position: 'absolute', left: 11, top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, var(--accent-blue), var(--accent-purple), var(--accent-cyan))', borderRadius: 1 }} />

              {timeline.milestones.map((m, i) => {
                const color = TYPE_COLORS[m.type]
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                    style={{ position: 'relative', marginBottom: 28 }}>
                    {/* Timeline dot */}
                    <div style={{ position: 'absolute', left: -32, top: 14, width: 24, height: 24, borderRadius: '50%', background: `${color}20`, border: `2px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
                      {TYPE_ICONS[m.type]}
                    </div>

                    <div className="glass-card" style={{ borderLeft: `3px solid ${color}` }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {MONTHS[m.month - 1]} {m.year}
                        </div>
                        <GlowBadge color={m.type === 'project' ? 'blue' : m.type === 'technology' ? 'purple' : 'amber' as 'amber' | 'blue' | 'purple'}>{m.type}</GlowBadge>
                        <span style={{ fontSize: '0.75rem', color, fontStyle: 'italic' }}>{m.impact}</span>
                      </div>
                      <h4 style={{ marginBottom: 6, fontSize: '1rem' }}>{m.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{m.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Tech Evolution */}
          <div style={{ gridColumn: 'span 4' }}>
            <div className="section-label" style={{ marginBottom: 20 }}>Technology Evolution</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {timeline.technologyEvolution.map((ev, i) => (
                <motion.div key={ev.year} className="glass-card"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-blue)', marginBottom: 10 }}>
                    {ev.year}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {ev.technologies.map(t => <GlowBadge key={t} color="cyan">{t}</GlowBadge>)}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '100px 40px' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>📅</div>
          <h3 style={{ marginBottom: 12 }}>Build Your Developer Timeline</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
            See your journey from first commit to today — every milestone, technology breakthrough, and achievement.
          </p>
          <button className="btn-primary" onClick={generate} disabled={isGenerating} style={{ fontSize: '1rem', padding: '16px 40px' }}>
            <Clock size={18} /> Generate My Timeline
          </button>
        </div>
      )}
    </div>
  )
}
