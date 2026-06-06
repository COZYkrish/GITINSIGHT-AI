import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, RefreshCw, GraduationCap, BookOpen, Zap } from 'lucide-react'
import { GlassCard, GlowBadge, ProgressBar, ScoreGauge } from '../../../components/ui/GlassCard'
import api from '../../../services/api'
import { MentorReport } from '../../../types'

const LEVEL_COLORS: Record<string, string> = {
  'Junior Developer': 'var(--accent-cyan)',
  'Mid-Level Developer': 'var(--accent-blue)',
  'Senior Developer': 'var(--accent-purple)',
  'Staff Engineer': 'var(--accent-amber)',
}

export function AIMentorPage() {
  const [report, setReport] = useState<MentorReport | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [tab, setTab] = useState<'feedback' | 'roadmap' | 'goals'>('feedback')

  useEffect(() => {
    setIsLoading(true)
    api.get('/api/analysis/mentor').then(r => setReport(r.data)).catch(() => {}).finally(() => setIsLoading(false))
  }, [])

  const generate = async () => {
    setIsGenerating(true)
    try {
      const { data } = await api.post('/api/analysis/mentor')
      setReport(data)
    } catch (e) { console.error(e) }
    setIsGenerating(false)
  }

  const levelColor = report ? (LEVEL_COLORS[report.developerLevel] || 'var(--accent-blue)') : 'var(--accent-blue)'

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div className="section-label">AI Coaching</div>
          <h1>AI Mentor</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Personalized coaching from an elite senior engineer</p>
        </div>
        <button className="btn-primary" onClick={generate} disabled={isGenerating}>
          {isGenerating ? <><RefreshCw size={16} style={{ animation: 'spin-slow 1s linear infinite' }} /> Mentoring...</> : <><Sparkles size={16} /> {report ? 'New Session' : 'Start Mentoring'}</>}
        </button>
      </motion.div>

      {report ? (
        <div>
          {/* Level Banner */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card"
            style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 24, padding: '24px 32px',
              border: `1px solid ${levelColor}40`, background: `${levelColor}08`, flexWrap: 'wrap' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: `${levelColor}20`, border: `2px solid ${levelColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={32} color={levelColor} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>CURRENT LEVEL</div>
              <h2 style={{ color: levelColor, fontSize: '2rem', fontWeight: 900, marginBottom: 8 }}>{report.developerLevel}</h2>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {report.strengths.map(s => <GlowBadge key={s} color="green">{s}</GlowBadge>)}
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--glass-bg)', borderRadius: 12, padding: 4, width: 'fit-content', border: '1px solid var(--glass-border)' }}>
            {(['feedback', 'roadmap', 'goals'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{ padding: '8px 20px', borderRadius: 9, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
                  background: tab === t ? `linear-gradient(135deg, ${levelColor}, var(--accent-blue))` : 'transparent',
                  color: tab === t ? 'white' : 'var(--text-muted)', textTransform: 'capitalize', transition: 'all 0.2s ease' }}>
                {t}
              </button>
            ))}
          </div>

          {tab === 'feedback' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 20 }}>
              <GlassCard style={{ gridColumn: 'span 12' }}>
                <div className="section-label" style={{ marginBottom: 12 }}>💬 Mentor's Direct Feedback</div>
                <p style={{ lineHeight: 1.9, fontSize: '0.95rem', color: 'var(--text-secondary)', fontStyle: 'italic', borderLeft: `3px solid ${levelColor}`, paddingLeft: 20 }}>
                  "{report.feedback}"
                </p>
              </GlassCard>

              <GlassCard style={{ gridColumn: 'span 6' }}>
                <div className="section-label" style={{ marginBottom: 16 }}>⚡ Recommended Tech Stack</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {report.recommendedTech.map(t => <GlowBadge key={t} color="purple">{t}</GlowBadge>)}
                </div>
              </GlassCard>

              <GlassCard style={{ gridColumn: 'span 6' }}>
                <div className="section-label" style={{ marginBottom: 16 }}>🛠️ Build These Projects</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {report.recommendedProjects.map((p, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 14px', background: `${levelColor}08`, borderRadius: 10, border: `1px solid ${levelColor}25`, fontSize: '0.875rem' }}>
                      <span style={{ color: levelColor }}>→</span> {p}
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}

          {tab === 'roadmap' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {report.learningRoadmap.map((phase, i) => (
                <motion.div key={i} className="glass-card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${levelColor}20`, border: `1px solid ${levelColor}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.9rem', color: levelColor }}>
                      {i + 1}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 2 }}>{phase.phase}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>⏱ {phase.duration}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {phase.topics.map(t => <GlowBadge key={t} color="blue">{t}</GlowBadge>)}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {tab === 'goals' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 20 }}>
              <GlassCard style={{ gridColumn: 'span 6' }}>
                <div className="section-label" style={{ marginBottom: 16 }}>📅 Weekly Goals</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {report.weeklyGoals.map((g, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 14px', background: 'var(--glass-bg)', borderRadius: 10, border: '1px solid var(--glass-border)' }}>
                      <input type="checkbox" style={{ accentColor: levelColor, width: 16, height: 16, flexShrink: 0 }} />
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{g}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard style={{ gridColumn: 'span 6' }}>
                <div className="section-label" style={{ marginBottom: 16 }}>🗓️ Monthly Roadmap</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {report.monthlyRoadmap.map((m, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 16px', background: `${levelColor}08`, borderRadius: 10, border: `1px solid ${levelColor}20` }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: levelColor, flexShrink: 0, paddingTop: 2 }}>M{i+1}</span>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{m}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '100px 40px' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎓</div>
          <h3 style={{ marginBottom: 12 }}>Your AI Mentor Awaits</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 36, maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.7 }}>
            Get direct, honest feedback and a personalized learning roadmap from an AI senior engineer.
          </p>
          <button className="btn-primary" onClick={generate} disabled={isGenerating} style={{ fontSize: '1rem', padding: '16px 40px' }}>
            <GraduationCap size={18} /> Start Mentoring Session
          </button>
        </div>
      )}
    </div>
  )
}
