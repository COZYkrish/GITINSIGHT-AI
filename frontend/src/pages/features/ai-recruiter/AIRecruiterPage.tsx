import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, RefreshCw, User, Building2, TrendingUp, TrendingDown } from 'lucide-react'
import { GlassCard, ScoreGauge, GlowBadge, TypewriterText } from '../../../components/ui/GlassCard'
import api from '../../../services/api'
import { RecruiterReport } from '../../../types'

const verdictColors: Record<string, string> = {
  'Strong Hire': 'var(--accent-green)',
  'Hire': 'var(--accent-blue)',
  'Lean Hire': 'var(--accent-cyan)',
  'No Hire': 'var(--accent-amber)',
  'Strong No Hire': 'var(--accent-pink)',
}

export function AIRecruiterPage() {
  const [report, setReport] = useState<RecruiterReport | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showTyping, setShowTyping] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    api.get('/api/analysis/recruiter').then(r => setReport(r.data)).catch(() => {}).finally(() => setIsLoading(false))
  }, [])

  const generate = async () => {
    setIsGenerating(true)
    setShowTyping(false)
    try {
      const { data } = await api.post('/api/analysis/recruiter')
      setReport(data)
      setShowTyping(true)
    } catch (e) { console.error(e) }
    setIsGenerating(false)
  }

  const verdictColor = report ? (verdictColors[report.verdict] || 'var(--accent-blue)') : 'var(--accent-blue)'

  return (
    <div className="page-container">
      {/* Terminal-style header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 32 }}>
        <div style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: '16px 24px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-green)', marginBottom: 16 }}>
          <span style={{ color: 'var(--text-muted)' }}>gitinsight@recruiter:~$ </span>
          evaluate --candidate=current_user --mode=full_assessment
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="section-label">AI Simulation</div>
            <h1>AI Recruiter</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Hiring committee simulation powered by Gemini AI</p>
          </div>
          <button className="btn-primary" onClick={generate} disabled={isGenerating}>
            {isGenerating ? <><RefreshCw size={16} style={{ animation: 'spin-slow 1s linear infinite' }} /> Evaluating...</> : <><Sparkles size={16} /> {report ? 'Re-evaluate' : 'Start Evaluation'}</>}
          </button>
        </div>
      </motion.div>

      {report && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 20 }}>
          {/* Verdict Banner */}
          <div style={{ gridColumn: 'span 12' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              style={{ padding: '28px 32px', background: `rgba(0,0,0,0.6)`, border: `1px solid ${verdictColor}`,
                borderRadius: 'var(--radius-xl)', boxShadow: `0 0 40px ${verdictColor}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 8 }}>RECRUITER VERDICT</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: verdictColor, fontFamily: 'var(--font-display)' }}>
                  {report.verdict}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <ScoreGauge score={report.hiringProbability} size={120} label="%" color={verdictColor} />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Hiring Probability</div>
              </div>
            </motion.div>
          </div>

          {/* Strengths */}
          <GlassCard style={{ gridColumn: 'span 6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <TrendingUp size={16} color="var(--accent-green)" />
              <div className="section-label" style={{ marginBottom: 0 }}>Strengths</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {report.strengths.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 14px', background: 'rgba(16,185,129,0.06)', borderRadius: 8, border: '1px solid rgba(16,185,129,0.2)' }}>
                  <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>✓</span>
                  <span style={{ fontSize: '0.875rem' }}>{s}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Weaknesses */}
          <GlassCard style={{ gridColumn: 'span 6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <TrendingDown size={16} color="var(--accent-pink)" />
              <div className="section-label" style={{ marginBottom: 0 }}>Areas to Improve</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {report.weaknesses.map((w, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 14px', background: 'rgba(236,72,153,0.06)', borderRadius: 8, border: '1px solid rgba(236,72,153,0.2)' }}>
                  <span style={{ color: 'var(--accent-pink)', fontWeight: 700 }}>!</span>
                  <span style={{ fontSize: '0.875rem' }}>{w}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Evaluation Scores */}
          {[
            { label: '⚙️ Technical Evaluation', eval: report.technicalEval },
            { label: '💬 Communication', eval: report.communicationEval },
            { label: '🗂 Portfolio Eval', eval: report.portfolioEval },
          ].map(({ label, eval: ev }) => (
            <GlassCard key={label} style={{ gridColumn: 'span 4' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{label}</div>
                <ScoreGauge score={ev.score} size={56} color="var(--accent-blue)" />
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{ev.notes}</p>
            </GlassCard>
          ))}

          {/* Perspectives */}
          <GlassCard style={{ gridColumn: 'span 6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <User size={16} color="var(--accent-blue)" />
              <div className="section-label" style={{ marginBottom: 0 }}>Senior Engineer Perspective</div>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{report.seniorPerspective}</p>
          </GlassCard>

          <GlassCard style={{ gridColumn: 'span 6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Building2 size={16} color="var(--accent-purple)" />
              <div className="section-label" style={{ marginBottom: 0 }}>Startup Founder Perspective</div>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{report.startupPerspective}</p>
          </GlassCard>

          {/* Full Report */}
          <GlassCard style={{ gridColumn: 'span 12' }}>
            <div className="section-label" style={{ marginBottom: 16 }}>📋 Full Recruiter Report</div>
            <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {showTyping ? <TypewriterText text={report.fullReport} speed={15} /> : report.fullReport}
            </p>
          </GlassCard>
        </div>
      )}

      {!report && !isLoading && (
        <div style={{ textAlign: 'center', padding: '100px 40px' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎯</div>
          <h3 style={{ marginBottom: 12 }}>No Evaluation Yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Simulate how a real recruiter sees your profile</p>
          <button className="btn-primary" onClick={generate}>
            <Sparkles size={16} /> Start Evaluation
          </button>
        </div>
      )}
    </div>
  )
}
