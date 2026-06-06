import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, RefreshCw, Briefcase } from 'lucide-react'
import { GlassCard, ScoreGauge, GlowBadge, ProgressBar } from '../../../components/ui/GlassCard'
import api from '../../../services/api'
import { CareerReport, CareerRole } from '../../../types'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'

const ROLE_COLORS = ['var(--accent-blue)', 'var(--accent-purple)', 'var(--accent-cyan)', 'var(--accent-green)']
const ROLE_EMOJIS = ['🖥️', '⚙️', '🔄', '🤖']

export function CareerReadinessPage() {
  const [report, setReport] = useState<CareerReport | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedRole, setSelectedRole] = useState(0)

  useEffect(() => {
    setIsLoading(true)
    api.get('/api/analysis/career').then(r => setReport(r.data)).catch(() => {}).finally(() => setIsLoading(false))
  }, [])

  const generate = async () => {
    setIsGenerating(true)
    try {
      const { data } = await api.post('/api/analysis/career')
      setReport(data)
    } catch (e) { console.error(e) }
    setIsGenerating(false)
  }

  const radarData = report?.roles.map(r => ({ role: r.name.replace(' Developer', '').replace('/', '/\n'), match: r.matchPercentage })) || []
  const activeRole = report?.roles[selectedRole]

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div className="section-label">Role Analysis</div>
          <h1>Career Readiness</h1>
          <p style={{ color: 'var(--text-secondary)' }}>AI-powered hiring readiness across 4 engineering roles</p>
        </div>
        <button className="btn-primary" onClick={generate} disabled={isGenerating}>
          {isGenerating ? <><RefreshCw size={16} style={{ animation: 'spin-slow 1s linear infinite' }} /> Analyzing...</> : <><Sparkles size={16} /> {report ? 'Reanalyze' : 'Analyze My Career'}</>}
        </button>
      </motion.div>

      {report ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 20 }}>
          {/* Overall Score */}
          <GlassCard style={{ gridColumn: 'span 4', textAlign: 'center' }} glow="blue">
            <div className="section-label" style={{ marginBottom: 16 }}>Overall Readiness</div>
            <ScoreGauge score={report.overallReadiness} size={160} label="%" color="var(--accent-blue)" />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 16 }}>
              {report.overallReadiness >= 75 ? '🟢 Ready to apply!' : report.overallReadiness >= 50 ? '🟡 Getting there' : '🔴 Needs work'}
            </p>
          </GlassCard>

          {/* Role Radar */}
          <GlassCard style={{ gridColumn: 'span 8' }}>
            <div className="section-label" style={{ marginBottom: 12 }}>Role Match Radar</div>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--glass-border)" />
                <PolarAngleAxis dataKey="role" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                <Radar name="Match" dataKey="match" stroke="var(--accent-blue)" fill="var(--accent-blue)" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* Role Cards */}
          {report.roles.map((role, i) => (
            <motion.div key={role.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              style={{ gridColumn: 'span 3' }}>
              <div className="glass-card" onClick={() => setSelectedRole(i)} style={{ cursor: 'pointer',
                borderColor: selectedRole === i ? ROLE_COLORS[i] : 'var(--glass-border)',
                background: selectedRole === i ? `${ROLE_COLORS[i]}08` : 'var(--glass-bg)',
                transition: 'all 0.2s ease' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{ROLE_EMOJIS[i]}</div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 8 }}>{role.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Match</span>
                  <span style={{ color: ROLE_COLORS[i], fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{role.matchPercentage}%</span>
                </div>
                <ProgressBar value={role.matchPercentage} color={ROLE_COLORS[i]} height={6} />
              </div>
            </motion.div>
          ))}

          {/* Role Detail */}
          {activeRole && (
            <motion.div key={selectedRole} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ gridColumn: 'span 12' }}>
              <GlassCard style={{ borderColor: ROLE_COLORS[selectedRole], background: `${ROLE_COLORS[selectedRole]}05` }}>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 24, alignItems: 'flex-start' }}>
                  <div>
                    <div className="section-label" style={{ marginBottom: 6 }}>{ROLE_EMOJIS[selectedRole]} {activeRole.name}</div>
                    <div style={{ fontWeight: 600, color: ROLE_COLORS[selectedRole], marginBottom: 8 }}>{activeRole.hiringReadiness}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>⏱ {activeRole.timeline}</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 12 }}>🔴 Skill Gaps</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {activeRole.skillGaps.map(s => <GlowBadge key={s} color="pink">{s}</GlowBadge>)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 12 }}>✅ Growth Opportunities</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {activeRole.growthOpportunities.map((g, i) => (
                        <div key={i} style={{ display: 'flex', gap: 8, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          <span style={{ color: ROLE_COLORS[selectedRole] }}>→</span> {g}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '100px 40px' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>🚀</div>
          <h3 style={{ marginBottom: 12 }}>Career Analysis Ready</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
            Discover your readiness across Frontend, Backend, Full Stack, and AI engineering roles.
          </p>
          <button className="btn-primary" onClick={generate} disabled={isGenerating} style={{ fontSize: '1rem', padding: '16px 40px' }}>
            <Briefcase size={18} /> Analyze Career Readiness
          </button>
        </div>
      )}
    </div>
  )
}
