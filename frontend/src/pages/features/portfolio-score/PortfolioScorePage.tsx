import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, RefreshCw } from 'lucide-react'
import api from '../../../services/api'
import type { PortfolioScore } from '../../../types'

/* ── Animated Score Ring ────────────────────────────── */
function ScoreRing({ score }: { score: number }) {
  const size = 240
  const strokeWidth = 10
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  // Grade label
  const grade = score >= 85 ? 'A' : score >= 70 ? 'B' : score >= 55 ? 'C' : score >= 40 ? 'D' : 'F'
  const gradeLabel = score >= 85 ? 'Excellent' : score >= 70 ? 'Strong' : score >= 55 ? 'Moderate' : 'Needs Work'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        {/* Background ring */}
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'absolute', inset: 0 }}>
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke="var(--muted)"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke="var(--ink)"
            strokeWidth={strokeWidth}
            strokeLinecap="square"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>

        {/* Center content */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 0,
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: 'var(--font-serif-display)',
              fontWeight: 900,
              fontSize: '4.5rem',
              lineHeight: 1,
              letterSpacing: '-0.04em',
              color: 'var(--ink)',
            }}
          >
            {score}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--neutral-400)',
            }}
          >
            out of 100
          </motion.div>
        </div>
      </div>

      {/* Grade badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.4 }}
        style={{ display: 'flex', alignItems: 'center', gap: 12 }}
      >
        <div style={{
          width: 44, height: 44,
          background: 'var(--ink)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-serif-display)',
          fontWeight: 900,
          fontSize: '1.4rem',
          color: 'var(--paper)',
        }}>
          {grade}
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--font-serif-display)',
            fontWeight: 700,
            fontSize: '1rem',
            color: 'var(--ink)',
          }}>
            {gradeLabel}
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--neutral-500)',
          }}>
            Portfolio Grade
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/* ── Interactive Score Row ──────────────────────────── */
function ScoreRow({ label, value, index }: { label: string; value: number; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.4 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '16px 20px',
        borderBottom: 'var(--border-muted)',
        cursor: 'default',
        transition: 'background 0.12s',
        background: hovered ? 'var(--neutral-100)' : 'transparent',
      }}
    >
      {/* Label + value row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <span style={{
          fontFamily: 'var(--font-serif-body)',
          fontSize: '0.9rem',
          color: hovered ? 'var(--ink)' : 'var(--neutral-700)',
          fontWeight: hovered ? 600 : 400,
          transition: 'color 0.12s, font-weight 0.12s',
        }}>
          {label}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          fontWeight: 700,
          color: 'var(--ink)',
          letterSpacing: '0.05em',
        }}>
          {value}/100
        </span>
      </div>

      {/* Progress track */}
      <div style={{
        width: '100%',
        height: 6,
        background: 'var(--muted)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Base filled bar (always visible, thin) */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0, left: 0, bottom: 0,
            background: 'var(--neutral-400)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 + index * 0.08 }}
        />
        {/* Hover fill — ink, animates to value% */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              key="hover-fill"
              style={{
                position: 'absolute',
                top: 0, left: 0, bottom: 0,
                background: 'var(--ink)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${value}%` }}
              exit={{ width: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Percentage label on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              marginTop: 6,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--neutral-500)',
            }}>
              {value >= 80 ? '★ Strong signal' : value >= 60 ? '↑ Room to grow' : '! Needs attention'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Main Page ──────────────────────────────────────── */
export function PortfolioScorePage() {
  const [score, setScore] = useState<PortfolioScore | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const { data } = await api.get('/api/analysis/portfolio-score')
        setScore(data)
      } catch { /* not generated */ }
      setIsLoading(false)
    }
    load()
  }, [])

  const generate = async () => {
    setIsGenerating(true)
    try {
      const { data } = await api.post('/api/analysis/portfolio-score')
      setScore(data)
    } catch (e) { console.error(e) }
    setIsGenerating(false)
  }

  const categories = score ? [
    { label: 'Project Quality',    value: score.projectQuality },
    { label: 'Documentation',      value: score.documentation },
    { label: 'Consistency',        value: score.consistency },
    { label: 'Technical Diversity',value: score.technicalDiversity },
    { label: 'Innovation',         value: score.innovation },
  ] : []

  return (
    <div className="page-container">

      {/* ── Page Header ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          marginBottom: 32,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 16,
          paddingBottom: 24,
          borderBottom: 'var(--border-thick)',
        }}
      >
        <div>
          <div className="uppercase-label" style={{ marginBottom: 10 }}>AI Analysis</div>
          <h1 style={{
            fontFamily: 'var(--font-serif-display)',
            fontWeight: 900,
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
            marginBottom: 8,
          }}>
            Portfolio Score
          </h1>
          <p style={{ fontFamily: 'var(--font-serif-body)', fontStyle: 'italic', color: 'var(--neutral-600)', fontSize: '1rem' }}>
            Quantified assessment of your <em>portfolio quality</em>
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={generate}
          disabled={isGenerating}
          style={{ alignSelf: 'flex-start' }}
        >
          {isGenerating
            ? <><RefreshCw size={15} style={{ animation: 'spin-slow 1s linear infinite' }} /> Analyzing...</>
            : <><Sparkles size={15} /> {score ? 'Regenerate' : 'Generate Score'}</>
          }
        </button>
      </motion.div>

      {/* ── Loading ──────────────────────────────────── */}
      {isLoading && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: 'var(--border-thin)' }}>
          {[1, 2].map(i => <div key={i} className="shimmer" style={{ height: 360 }} />)}
        </div>
      )}

      {/* ── Score Layout ─────────────────────────────── */}
      {!isLoading && score && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 0 }}>

          {/* LEFT — Score Ring */}
          <div style={{
            gridColumn: 'span 5',
            border: 'var(--border-thin)',
            borderRight: 'none',
            padding: '48px 32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
          }}>
            <div className="uppercase-label" style={{ alignSelf: 'flex-start' }}>Overall Score</div>
            <ScoreRing score={score.overallScore} />
          </div>

          {/* RIGHT — Score Breakdown */}
          <div style={{
            gridColumn: 'span 7',
            border: 'var(--border-thin)',
          }}>
            {/* Header */}
            <div style={{
              padding: '14px 20px',
              borderBottom: 'var(--border-thick)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div className="uppercase-label">Score Breakdown</div>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--neutral-400)',
              }}>
                Hover a row to inspect
              </span>
            </div>

            {/* Rows */}
            {categories.map((cat, i) => (
              <ScoreRow key={cat.label} label={cat.label} value={cat.value} index={i} />
            ))}
          </div>

          {/* AI Explanation */}
          <div style={{
            gridColumn: 'span 12',
            border: 'var(--border-thin)',
            borderTop: 'none',
            padding: '28px 32px',
          }}>
            <div className="uppercase-label" style={{ marginBottom: 16 }}>AI Analysis</div>
            <p style={{
              fontFamily: 'var(--font-serif-body)',
              fontSize: '1rem',
              lineHeight: 1.85,
              color: 'var(--neutral-700)',
              maxWidth: '80ch',
            }}>
              {score.aiExplanation}
            </p>
          </div>

          {/* Suggestions */}
          <div style={{
            gridColumn: 'span 12',
            border: 'var(--border-thin)',
            borderTop: 'none',
          }}>
            <div style={{
              padding: '14px 20px',
              borderBottom: 'var(--border-thick)',
            }}>
              <div className="uppercase-label">Improvement Suggestions</div>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 0,
            }}>
              {score.suggestions.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  style={{
                    padding: '20px 24px',
                    borderRight: 'var(--border-muted)',
                    borderBottom: 'var(--border-muted)',
                    display: 'flex',
                    gap: 14,
                    alignItems: 'flex-start',
                    transition: 'background 0.12s',
                    cursor: 'default',
                  }}
                  whileHover={{ backgroundColor: 'var(--neutral-100)' }}
                >
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: 'var(--neutral-400)',
                    paddingTop: 2,
                    letterSpacing: '0.08em',
                    flexShrink: 0,
                  }}>
                    0{i + 1}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-serif-body)',
                    fontSize: '0.875rem',
                    color: 'var(--neutral-700)',
                    lineHeight: 1.7,
                  }}>
                    {s}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Empty State ──────────────────────────────── */}
      {!isLoading && !score && (
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
            fontSize: '5rem',
            fontWeight: 900,
            color: 'var(--muted)',
            lineHeight: 1,
          }}>
            —
          </div>
          <h3 style={{
            fontFamily: 'var(--font-serif-display)',
            fontWeight: 700,
            fontSize: '1.4rem',
          }}>
            No Portfolio Score Yet
          </h3>
          <p style={{
            fontFamily: 'var(--font-serif-body)',
            fontStyle: 'italic',
            color: 'var(--neutral-600)',
            maxWidth: '36ch',
          }}>
            Generate your AI-powered portfolio assessment — it takes under 60 seconds.
          </p>
          <button className="btn-primary" onClick={generate} disabled={isGenerating} style={{ marginTop: 8 }}>
            <Sparkles size={15} /> Generate Portfolio Score
          </button>
        </div>
      )}
    </div>
  )
}
