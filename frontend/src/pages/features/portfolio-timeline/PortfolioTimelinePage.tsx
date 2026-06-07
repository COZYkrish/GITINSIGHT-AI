import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, RefreshCw, Clock, AlertTriangle } from 'lucide-react'
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

const TYPE_ICONS = { project: 'P', technology: 'T', achievement: 'A' }

export function PortfolioTimelinePage() {
  const [timeline, setTimeline] = useState<TimelineData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    api.get('/api/analysis/timeline')
      .then(r => setTimeline(r.data))
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  const generate = async () => {
    setIsGenerating(true)
    setError(null)
    try {
      const { data } = await api.post('/api/analysis/timeline')
      setTimeline(data)
    } catch (e: any) {
      console.error(e)
      setError(e?.response?.data?.error || 'Timeline generation failed.')
    }
    setIsGenerating(false)
  }

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  return (
    <div className="page-container">
      {/* ── Header ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          marginBottom: 32,
          paddingBottom: 24,
          borderBottom: 'var(--border-thick)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: 16
        }}
      >
        <div>
          <div className="uppercase-label" style={{ marginBottom: 10 }}>Developer Journey</div>
          <h1 style={{
            fontFamily: 'var(--font-serif-display)',
            fontWeight: 900,
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            letterSpacing: '-0.03em',
            lineHeight: 1,
            marginBottom: 8,
          }}>
            Portfolio Timeline
          </h1>
          <p style={{ fontFamily: 'var(--font-serif-body)', fontStyle: 'italic', color: 'var(--neutral-600)', fontSize: '1rem' }}>
            Your evolution as a developer — visualized chronologically.
          </p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-end' }}>
          <button className="btn-primary" onClick={generate} disabled={isGenerating}>
            {isGenerating ? <><RefreshCw size={15} style={{ animation: 'spin-slow 1s linear infinite' }} /> Building Timeline...</> : <><Clock size={15} /> {timeline ? 'Regenerate Timeline' : 'Generate Timeline'}</>}
          </button>
        </div>
      </motion.div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ padding: '14px 16px', border: '1px solid var(--red)', background: 'rgba(204,0,0,0.04)', color: 'var(--red)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertTriangle size={15} strokeWidth={1.5} />
              {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {timeline ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 32 }}>
          
          {/* ── Vertical Timeline ────────────────────── */}
          <div style={{ gridColumn: 'span 8' }}>
            <div className="uppercase-label" style={{ marginBottom: 24, paddingBottom: 16, borderBottom: 'var(--border-thin)' }}>
              Historical Record
            </div>
            
            <div style={{ position: 'relative', paddingLeft: 40 }}>
              {/* Vertical ink line */}
              <div style={{ position: 'absolute', left: 14, top: 8, bottom: 0, width: 2, background: 'var(--ink)' }} />

              {timeline.milestones.map((m, i) => {
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                    style={{ position: 'relative', marginBottom: 32 }}>
                    
                    {/* Timeline Node */}
                    <div style={{ position: 'absolute', left: -40, top: 4, width: 28, height: 28, background: 'var(--paper)', border: '2px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.8rem', zIndex: 2 }}>
                      {TYPE_ICONS[m.type]}
                    </div>

                    <div style={{ padding: '24px', border: 'var(--border-thin)', background: 'var(--neutral-100)' }}>
                      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--ink)' }}>
                          {MONTHS[m.month - 1]} {m.year}
                        </div>
                        <div style={{ border: '1px solid var(--ink)', padding: '2px 8px', fontSize: '0.65rem', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
                          {m.type}
                        </div>
                        <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-serif-body)', fontStyle: 'italic', color: 'var(--neutral-600)' }}>
                          {m.impact}
                        </span>
                      </div>
                      
                      <h4 style={{ fontFamily: 'var(--font-serif-display)', fontWeight: 700, fontSize: '1.25rem', marginBottom: 8, color: 'var(--ink)' }}>
                        {m.title}
                      </h4>
                      <p style={{ fontFamily: 'var(--font-serif-body)', fontSize: '0.95rem', color: 'var(--neutral-700)', lineHeight: 1.6 }}>
                        {m.description}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* ── Tech Evolution ────────────────────────── */}
          <div style={{ gridColumn: 'span 4' }}>
            <div className="uppercase-label" style={{ marginBottom: 24, paddingBottom: 16, borderBottom: 'var(--border-thin)' }}>
              Technology Epochs
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {timeline.technologyEvolution.map((ev, i) => (
                <motion.div key={ev.year} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <div style={{ border: 'var(--border-thin)', background: 'var(--paper)' }}>
                    <div style={{ padding: '12px 16px', borderBottom: 'var(--border-thin)', background: 'var(--ink)', color: 'var(--paper)', fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 700 }}>
                      YEAR {ev.year}
                    </div>
                    <div style={{ padding: '20px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {ev.technologies.map(t => (
                        <div key={t} style={{ border: '1px solid var(--border-muted)', background: 'var(--neutral-100)', padding: '4px 10px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--ink)' }}>
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ border: 'var(--border-thin)', textAlign: 'center', padding: '100px 40px', background: 'var(--neutral-100)' }}>
          <div style={{ fontFamily: 'var(--font-serif-display)', fontSize: '4rem', color: 'var(--muted)', lineHeight: 1, marginBottom: 16 }}>
            📅
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif-display)', fontWeight: 700, fontSize: '1.4rem', marginBottom: 12 }}>
            Build Your Developer Timeline
          </h3>
          <p style={{ fontFamily: 'var(--font-serif-body)', fontStyle: 'italic', color: 'var(--neutral-600)', maxWidth: 480, margin: '0 auto 32px' }}>
            See your journey from first commit to today — every milestone, technology breakthrough, and achievement mapped out.
          </p>
          <button className="btn-primary" onClick={generate} disabled={isGenerating} style={{ padding: '16px 40px', fontSize: '0.9rem', justifyContent: 'center', margin: '0 auto' }}>
            <Sparkles size={16} /> Generate Timeline
          </button>
        </div>
      )}
    </div>
  )
}
