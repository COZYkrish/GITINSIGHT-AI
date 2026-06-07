import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, RefreshCw, CheckCircle2, AlertTriangle, ArrowRight, FileText, ChevronDown } from 'lucide-react'
import api from '../../../services/api'
import { useGitHubStore } from '../../../store/githubStore'
import type { Repository } from '../../../types'

interface ReadmeReport {
  score: number
  healthScore: number
  missingSections: string[]
  suggestions: string[]
  enhancedReadme: string
}

/* ── Animated Score Ring ────────────────────────────── */
function SmallScoreRing({ score, label }: { score: number; label: string }) {
  const size = 120
  const strokeWidth = 6
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div className="uppercase-label">{label}</div>
      <div style={{ position: 'relative', width: size, height: size }}>
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
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 0,
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            style={{
              fontFamily: 'var(--font-serif-display)',
              fontWeight: 900,
              fontSize: '2.5rem',
              lineHeight: 1,
              letterSpacing: '-0.04em',
              color: 'var(--ink)',
            }}
          >
            {score}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

/* ── Main Page ───────────────────────────────────────── */
export function ReadmeAnalyzerPage() {
  const { repositories, fetchRepositories } = useGitHubStore()
  const [selectedRepoId, setSelectedRepoId] = useState<string>('')
  const [report, setReport] = useState<ReadmeReport | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showEnhanced, setShowEnhanced] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { 
    fetchRepositories() 
  }, [fetchRepositories])

  useEffect(() => { 
    if (repositories.length > 0 && !selectedRepoId) {
      setSelectedRepoId(repositories[0]._id)
    }
  }, [repositories, selectedRepoId])

  const selectedRepo = repositories.find(r => r._id === selectedRepoId)

  const analyze = async () => {
    if (!selectedRepo) return
    setIsGenerating(true)
    setReport(null)
    setShowEnhanced(false)
    setError(null)
    try {
      const { data } = await api.post(`/api/analysis/readme`, { repositoryId: selectedRepo._id })
      setReport(data)
    } catch (e: any) {
      console.error(e)
      setError(e?.response?.data?.error || 'Failed to analyze README. The repository might be empty or unavailable.')
    }
    setIsGenerating(false)
  }

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
          gap: 16,
        }}
      >
        <div>
          <div className="uppercase-label" style={{ marginBottom: 10 }}>Documentation Analysis</div>
          <h1 style={{
            fontFamily: 'var(--font-serif-display)',
            fontWeight: 900,
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            letterSpacing: '-0.03em',
            lineHeight: 1,
            marginBottom: 8,
          }}>
            README Analyzer
          </h1>
          <p style={{ fontFamily: 'var(--font-serif-body)', fontStyle: 'italic', color: 'var(--neutral-600)', fontSize: '1rem' }}>
            AI-powered evaluation and generation for your project documentation
          </p>
        </div>
      </motion.div>

      {/* ── Control Panel (Repository Selector) ──────── */}
      <div style={{
        border: 'var(--border-thin)',
        padding: '24px 32px',
        marginBottom: 32,
        background: 'var(--neutral-100)',
      }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--neutral-500)',
              marginBottom: 10,
            }}>
              Select Repository ({repositories.length} total)
            </label>
            <div style={{ position: 'relative' }}>
              <select
                className="np-input"
                value={selectedRepoId}
                onChange={(e) => {
                  setSelectedRepoId(e.target.value)
                  setReport(null)
                  setError(null)
                }}
                style={{
                  width: '100%',
                  appearance: 'none',
                  paddingRight: 40,
                  cursor: 'pointer',
                  background: 'var(--paper)',
                }}
              >
                <option value="" disabled>Select a repository...</option>
                {repositories.map(repo => (
                  <option key={repo._id} value={repo._id}>
                    {repo.name} {repo.description ? `— ${repo.description.substring(0, 40)}...` : ''}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--ink)' }} />
            </div>
          </div>
          <button
            className="btn-primary"
            onClick={analyze}
            disabled={isGenerating || !selectedRepoId}
            style={{ padding: '16px 28px', height: 48 }}
          >
            {isGenerating ? <><RefreshCw size={15} style={{ animation: 'spin-slow 1s linear infinite' }} /> Analyzing...</> : <><Sparkles size={15} /> Analyze README</>}
          </button>
        </div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{
                marginTop: 20,
                padding: '14px 16px',
                border: '1px solid var(--red)',
                background: 'rgba(204,0,0,0.04)',
                color: 'var(--red)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}>
                <AlertTriangle size={15} strokeWidth={1.5} />
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Report Results ───────────────────────────── */}
      {report && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 0, border: 'var(--border-thin)' }}
        >
          {/* Top Row: Scores & Health */}
          <div style={{ gridColumn: 'span 4', padding: '32px 24px', borderRight: 'var(--border-thin)', borderBottom: 'var(--border-thick)' }}>
            <SmallScoreRing score={report.score} label="Overall Score" />
          </div>
          <div style={{ gridColumn: 'span 4', padding: '32px 24px', borderRight: 'var(--border-thin)', borderBottom: 'var(--border-thick)' }}>
            <SmallScoreRing score={report.healthScore} label="Health Score" />
          </div>

          <div style={{ gridColumn: 'span 4', padding: '32px 24px', borderBottom: 'var(--border-thick)', background: 'var(--ink)', color: 'var(--paper)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>
              Missing Sections
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {report.missingSections.length === 0 ? (
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', color: 'var(--paper)', fontFamily: 'var(--font-serif-body)' }}>
                  <CheckCircle2 size={16} strokeWidth={1.5} /> Complete README!
                </div>
              ) : report.missingSections.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: '0.85rem', fontFamily: 'var(--font-serif-body)', color: 'rgba(255,255,255,0.8)' }}>
                  <AlertTriangle size={14} color="var(--red)" strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          <div style={{ gridColumn: 'span 12', borderBottom: 'var(--border-thick)' }}>
            <div style={{ padding: '16px 24px', borderBottom: 'var(--border-thin)' }}>
              <div className="uppercase-label">Improvement Suggestions</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 0 }}>
              {report.suggestions.map((s, i) => (
                <div key={i} style={{
                  padding: '24px',
                  borderRight: 'var(--border-muted)',
                  borderBottom: 'var(--border-muted)',
                  display: 'flex',
                  gap: 16,
                  alignItems: 'flex-start',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-serif-display)',
                    fontSize: '1.4rem',
                    fontWeight: 900,
                    color: 'var(--ink)',
                    lineHeight: 1,
                    opacity: 0.2,
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontFamily: 'var(--font-serif-body)', fontSize: '0.95rem', color: 'var(--neutral-700)', lineHeight: 1.6 }}>
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced README Viewer */}
          <div style={{ gridColumn: 'span 12', background: 'var(--neutral-100)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: showEnhanced ? 'var(--border-thin)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FileText size={16} strokeWidth={1.5} color="var(--ink)" />
                <span className="uppercase-label">AI-Enhanced README</span>
              </div>
              <button
                onClick={() => setShowEnhanced(!showEnhanced)}
                className="btn-secondary"
                style={{ fontSize: '0.7rem', padding: '8px 16px' }}
              >
                {showEnhanced ? 'Hide Content' : 'View Generated Content'}
              </button>
            </div>
            
            <AnimatePresence>
              {showEnhanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <pre style={{
                    margin: 0,
                    padding: '32px 40px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    lineHeight: 1.7,
                    color: 'var(--ink)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    maxHeight: 600,
                    overflowY: 'auto',
                    borderTop: '1px solid var(--border-muted)',
                  }}>
                    {report.enhancedReadme}
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </motion.div>
      )}

      {/* ── Empty State ──────────────────────────────── */}
      {!report && !isGenerating && !error && (
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
            fontSize: '4rem',
            fontWeight: 900,
            color: 'var(--muted)',
            lineHeight: 1,
          }}>
            ¶
          </div>
          <h3 style={{
            fontFamily: 'var(--font-serif-display)',
            fontWeight: 700,
            fontSize: '1.4rem',
          }}>
            Ready for Analysis
          </h3>
          <p style={{
            fontFamily: 'var(--font-serif-body)',
            fontStyle: 'italic',
            color: 'var(--neutral-600)',
            maxWidth: '36ch',
          }}>
            Select a repository above to receive a full quality breakdown and an AI-enhanced README generated for you.
          </p>
        </div>
      )}
    </div>
  )
}
