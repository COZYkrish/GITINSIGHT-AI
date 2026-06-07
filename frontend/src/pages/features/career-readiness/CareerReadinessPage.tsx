import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, RefreshCw, ArrowRight, Clock, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react'
import api from '../../../services/api'
import type { CareerReport, CareerRole } from '../../../types'

/* ── helpers ─────────────────────────────────────────── */
function getVerdict(pct: number) {
  if (pct >= 80) return { label: 'HIRE-READY',   color: 'var(--ink)',         bg: 'var(--ink)',      text: 'var(--paper)' }
  if (pct >= 60) return { label: 'STRONG',        color: 'var(--ink)',         bg: 'var(--neutral-200)', text: 'var(--ink)' }
  if (pct >= 40) return { label: 'DEVELOPING',    color: 'var(--neutral-600)', bg: 'var(--neutral-100)', text: 'var(--ink)' }
  return             { label: 'EARLY STAGE',    color: 'var(--neutral-400)', bg: 'var(--neutral-100)', text: 'var(--neutral-600)' }
}

function getReadinessLabel(pct: number) {
  if (pct >= 75) return 'You are ready to apply to these roles right now.'
  if (pct >= 50) return 'You are on the right track — a few focused months will close the gap.'
  return 'Significant upskilling needed, but the roadmap is clear.'
}

/* ── Big Readiness Number ────────────────────────────── */
function ReadinessHero({ score }: { score: number }) {
  const radius = 90
  const stroke = 8
  const circ = 2 * Math.PI * radius
  const offset = circ - (score / 100) * circ

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
      {/* Ring */}
      <div style={{ position: 'relative', width: 200, height: 200, flexShrink: 0 }}>
        <svg width={200} height={200} style={{ transform: 'rotate(-90deg)', position: 'absolute', inset: 0 }}>
          <circle cx={100} cy={100} r={radius} fill="none" stroke="var(--muted)" strokeWidth={stroke} />
          <motion.circle
            cx={100} cy={100} r={radius}
            fill="none" stroke="var(--ink)" strokeWidth={stroke} strokeLinecap="square"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            style={{
              fontFamily: 'var(--font-serif-display)',
              fontWeight: 900,
              fontSize: '3.8rem',
              lineHeight: 1,
              letterSpacing: '-0.04em',
              color: 'var(--ink)',
            }}
          >
            {score}
          </motion.div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--neutral-400)', marginTop: 4 }}>
            overall
          </div>
        </div>
      </div>

      {/* Verdict text */}
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--neutral-400)', marginBottom: 12 }}>
          Career Readiness Verdict
        </div>
        <div style={{
          fontFamily: 'var(--font-serif-display)',
          fontWeight: 900,
          fontSize: 'clamp(1.8rem, 4vw, 3rem)',
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          color: 'var(--ink)',
          marginBottom: 16,
        }}>
          {score >= 75 ? <>You're ready<br /><span style={{ fontStyle: 'italic' }}>to apply.</span></> :
           score >= 50 ? <>You're on<br /><span style={{ fontStyle: 'italic' }}>the right track.</span></> :
           <>Keep<br /><span style={{ fontStyle: 'italic' }}>building.</span></>}
        </div>
        <p style={{
          fontFamily: 'var(--font-serif-body)',
          fontSize: '0.9rem',
          lineHeight: 1.7,
          color: 'var(--neutral-600)',
          maxWidth: '40ch',
          borderLeft: '3px solid var(--ink)',
          paddingLeft: 14,
        }}>
          {getReadinessLabel(score)}
        </p>
      </div>
    </div>
  )
}

/* ── Role Bar (horizontal stat) ──────────────────────── */
function RoleBar({ role, index, isSelected, onClick }: {
  role: CareerRole; index: number; isSelected: boolean; onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const v = getVerdict(role.matchPercentage)
  const active = isSelected || hovered

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '32px 1fr 140px 100px',
        alignItems: 'center',
        gap: 0,
        borderBottom: 'var(--border-thin)',
        cursor: 'pointer',
        background: isSelected ? 'var(--ink)' : hovered ? 'var(--neutral-100)' : 'transparent',
        transition: 'background 0.12s',
      }}
    >
      {/* Number */}
      <div style={{
        padding: '20px 0 20px 20px',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6rem',
        letterSpacing: '0.1em',
        color: isSelected ? 'rgba(255,255,255,0.4)' : 'var(--neutral-400)',
        borderRight: 'var(--border-muted)',
      }}>
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Name + bar */}
      <div style={{ padding: '20px 24px', borderRight: 'var(--border-muted)' }}>
        <div style={{
          fontFamily: 'var(--font-serif-display)',
          fontWeight: 700,
          fontSize: '1rem',
          color: isSelected ? 'var(--paper)' : 'var(--ink)',
          marginBottom: 10,
          lineHeight: 1,
          transition: 'color 0.12s',
        }}>
          {role.name}
        </div>
        {/* Track */}
        <div style={{ height: 5, background: isSelected ? 'rgba(255,255,255,0.15)' : 'var(--muted)', position: 'relative', overflow: 'hidden' }}>
          <motion.div
            style={{ height: '100%', background: isSelected ? 'var(--paper)' : 'var(--ink)', position: 'absolute', top: 0, left: 0 }}
            initial={{ width: 0 }}
            animate={{ width: `${role.matchPercentage}%` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 + index * 0.08 }}
          />
        </div>
      </div>

      {/* % number */}
      <div style={{
        padding: '20px',
        textAlign: 'center',
        fontFamily: 'var(--font-serif-display)',
        fontWeight: 900,
        fontSize: '1.6rem',
        letterSpacing: '-0.03em',
        color: isSelected ? 'var(--paper)' : 'var(--ink)',
        borderRight: 'var(--border-muted)',
        transition: 'color 0.12s',
      }}>
        {role.matchPercentage}<span style={{ fontSize: '0.8rem', fontWeight: 400, opacity: 0.5 }}>%</span>
      </div>

      {/* Verdict badge */}
      <div style={{ padding: '20px 16px', display: 'flex', justifyContent: 'flex-end' }}>
        <span style={{
          display: 'inline-block',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.55rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          padding: '4px 8px',
          background: isSelected ? 'rgba(255,255,255,0.12)' : v.bg,
          color: isSelected ? 'var(--paper)' : v.text,
          border: isSelected ? '1px solid rgba(255,255,255,0.2)' : 'var(--border-thin)',
          whiteSpace: 'nowrap',
        }}>
          {v.label}
        </span>
      </div>
    </motion.div>
  )
}

/* ── Role Detail ─────────────────────────────────────── */
function RoleDetail({ role }: { role: CareerRole }) {
  return (
    <motion.div
      key={role.name}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        borderTop: 'var(--border-thick)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 0,
      }}
    >
      {/* Hiring readiness + timeline */}
      <div style={{
        padding: '28px 28px',
        borderRight: 'var(--border-thin)',
        background: 'var(--ink)',
        color: 'var(--paper)',
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>
          Hiring Readiness
        </div>
        <div style={{
          fontFamily: 'var(--font-serif-display)',
          fontWeight: 800,
          fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
          lineHeight: 1.2,
          color: 'var(--paper)',
          marginBottom: 20,
        }}>
          {role.hiringReadiness}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.68rem',
          letterSpacing: '0.08em',
          color: 'rgba(255,255,255,0.45)',
          paddingTop: 16,
          borderTop: '1px solid rgba(255,255,255,0.12)',
        }}>
          <Clock size={12} strokeWidth={1.5} />
          {role.timeline}
        </div>
      </div>

      {/* Skill Gaps */}
      <div style={{ padding: '28px', borderRight: 'var(--border-thin)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <AlertTriangle size={13} strokeWidth={1.5} color="var(--red)" />
          <div className="uppercase-label">Skill Gaps</div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {role.skillGaps.map(s => (
            <span key={s} style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              letterSpacing: '0.06em',
              padding: '5px 10px',
              border: '1px solid var(--red)',
              color: 'var(--red)',
              background: 'rgba(204,0,0,0.04)',
            }}>
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Growth Opportunities */}
      <div style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <TrendingUp size={13} strokeWidth={1.5} color="var(--ink)" />
          <div className="uppercase-label">Growth Opportunities</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {role.growthOpportunities.map((g, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              padding: '8px 0',
              borderBottom: 'var(--border-muted)',
              fontFamily: 'var(--font-serif-body)',
              fontSize: '0.85rem',
              color: 'var(--neutral-700)',
              lineHeight: 1.5,
            }}>
              <CheckCircle2 size={13} strokeWidth={1.5} color="var(--neutral-400)" style={{ flexShrink: 0, marginTop: 2 }} />
              {g}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ── Main Page ───────────────────────────────────────── */
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

  return (
    <div className="page-container">

      {/* ── Header ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          marginBottom: 40,
          paddingBottom: 28,
          borderBottom: 'var(--border-thick)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <div className="uppercase-label" style={{ marginBottom: 10 }}>Role Analysis</div>
          <h1 style={{
            fontFamily: 'var(--font-serif-display)',
            fontWeight: 900,
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            letterSpacing: '-0.03em',
            lineHeight: 1,
            marginBottom: 8,
          }}>
            Career Readiness
          </h1>
          <p style={{ fontFamily: 'var(--font-serif-body)', fontStyle: 'italic', color: 'var(--neutral-600)', fontSize: '1rem' }}>
            AI-powered hiring readiness across {report?.roles.length ?? 4} engineering roles
          </p>
        </div>
        <button className="btn-primary" onClick={generate} disabled={isGenerating} style={{ alignSelf: 'flex-end' }}>
          {isGenerating
            ? <><RefreshCw size={15} style={{ animation: 'spin-slow 1s linear infinite' }} /> Analyzing...</>
            : <><Sparkles size={15} /> {report ? 'Reanalyze' : 'Analyze My Career'}</>}
        </button>
      </motion.div>

      {/* ── Loading ──────────────────────────────────── */}
      {isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: 'var(--border-thin)' }}>
          {[1, 2, 3].map(i => <div key={i} className="shimmer" style={{ height: 72 }} />)}
        </div>
      )}

      {/* ── Report ───────────────────────────────────── */}
      {!isLoading && report && (
        <div>

          {/* Overall Readiness — full-width banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              border: 'var(--border-thin)',
              padding: '40px 40px',
              marginBottom: 0,
              borderBottom: 'var(--border-thick)',
            }}
          >
            <ReadinessHero score={report.overallReadiness} />
          </motion.div>

          {/* Role table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '32px 1fr 140px 100px',
            borderBottom: 'var(--border-thick)',
            borderLeft: 'var(--border-thin)',
            borderRight: 'var(--border-thin)',
          }}>
            <div />
            <div style={{ padding: '10px 24px', fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--neutral-400)', borderRight: 'var(--border-muted)' }}>
              Role
            </div>
            <div style={{ padding: '10px 20px', fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--neutral-400)', textAlign: 'center', borderRight: 'var(--border-muted)' }}>
              Match %
            </div>
            <div style={{ padding: '10px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--neutral-400)', textAlign: 'right' }}>
              Verdict
            </div>
          </div>

          {/* Role rows */}
          <div style={{ border: 'var(--border-thin)', borderTop: 'none' }}>
            {report.roles.map((role, i) => (
              <RoleBar
                key={role.name}
                role={role}
                index={i}
                isSelected={selectedRole === i}
                onClick={() => setSelectedRole(i)}
              />
            ))}

            {/* Detail panel — inline below the table */}
            <AnimatePresence mode="wait">
              {report.roles[selectedRole] && (
                <RoleDetail key={selectedRole} role={report.roles[selectedRole]} />
              )}
            </AnimatePresence>
          </div>

          {/* AI Summary */}
          {report.aiSummary && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                marginTop: 0,
                border: 'var(--border-thin)',
                borderTop: 'none',
                padding: '28px 32px',
              }}
            >
              <div className="uppercase-label" style={{ marginBottom: 16 }}>AI Assessment</div>
              <p style={{
                fontFamily: 'var(--font-serif-body)',
                fontSize: '1rem',
                lineHeight: 1.85,
                color: 'var(--neutral-700)',
                maxWidth: '80ch',
              }}>
                {report.aiSummary}
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* ── Empty State ──────────────────────────────── */}
      {!isLoading && !report && (
        <div style={{
          border: 'var(--border-thin)',
          padding: '100px 40px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}>
          <div style={{
            fontFamily: 'var(--font-serif-display)',
            fontWeight: 900,
            fontSize: '5rem',
            lineHeight: 1,
            color: 'var(--muted)',
          }}>
            ?
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif-display)', fontWeight: 700, fontSize: '1.6rem' }}>
            Career Analysis Ready
          </h3>
          <p style={{
            fontFamily: 'var(--font-serif-body)',
            fontStyle: 'italic',
            color: 'var(--neutral-600)',
            maxWidth: '36ch',
            lineHeight: 1.7,
          }}>
            Discover your readiness across Frontend, Backend, Full Stack, and AI engineering roles.
          </p>
          <button className="btn-primary" onClick={generate} disabled={isGenerating} style={{ marginTop: 8 }}>
            <ArrowRight size={15} /> Analyze Career Readiness
          </button>
        </div>
      )}
    </div>
  )
}
