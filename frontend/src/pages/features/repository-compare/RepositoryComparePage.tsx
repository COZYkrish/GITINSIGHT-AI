import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, RefreshCw, AlertTriangle, Trophy, CheckCircle2, XCircle, ArrowLeftRight } from 'lucide-react'
import api from '../../../services/api'
import { useGitHubStore } from '../../../store/githubStore'
import type { Repository } from '../../../types'

interface CompareResult {
  winner: 'A' | 'B'
  repositoryA: { name: string; scores: Record<string, number>; strengths: string[]; weaknesses: string[] }
  repositoryB: { name: string; scores: Record<string, number>; strengths: string[]; weaknesses: string[] }
  complexityComparison: { a: number; b: number; verdict: string }
  innovationComparison: { a: number; b: number; verdict: string }
  documentationComparison: { a: number; b: number; verdict: string }
  recruiterValue: { a: number; b: number; recommendation: string }
  resumeValue: { a: string; b: string }
  technicalDepth: { a: number; b: number; verdict: string }
  aiAnalysis: string
}

/* ── Interactive Progress Row ───────────────────────── */
function MetricRow({ label, valA, valB, nameA, nameB, verdict }: { label: string; valA: number; valB: number; nameA: string; nameB: string; verdict: string }) {
  const [hovered, setHovered] = useState(false)
  const winner = valA > valB ? 'A' : valB > valA ? 'B' : 'TIE'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '24px 20px',
        borderBottom: 'var(--border-muted)',
        background: hovered ? 'var(--neutral-100)' : 'transparent',
        transition: 'background 0.12s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{
          fontFamily: 'var(--font-serif-display)',
          fontSize: '1.2rem',
          fontWeight: 700,
          color: 'var(--ink)'
        }}>{label}</span>
        <span style={{
          fontFamily: 'var(--font-serif-body)',
          fontStyle: 'italic',
          fontSize: '0.9rem',
          color: 'var(--neutral-600)',
          maxWidth: 300,
          textAlign: 'right'
        }}>{verdict}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr', gap: 16, alignItems: 'center' }}>
        {/* Repo A Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--neutral-500)', letterSpacing: '0.05em' }}>
              {nameA}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: winner === 'A' ? 700 : 400, color: winner === 'A' ? 'var(--ink)' : 'var(--neutral-500)' }}>
              {valA}
            </span>
          </div>
          <div style={{ height: 6, background: 'var(--muted)', position: 'relative' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${valA}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{ position: 'absolute', top: 0, left: 0, bottom: 0, background: winner === 'A' ? 'var(--ink)' : 'var(--neutral-400)' }}
            />
          </div>
        </div>

        <div style={{ textAlign: 'center', fontFamily: 'var(--font-serif-display)', fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--neutral-400)' }}>
          vs
        </div>

        {/* Repo B Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--neutral-500)', letterSpacing: '0.05em' }}>
              {nameB}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: winner === 'B' ? 700 : 400, color: winner === 'B' ? 'var(--ink)' : 'var(--neutral-500)' }}>
              {valB}
            </span>
          </div>
          <div style={{ height: 6, background: 'var(--muted)', position: 'relative' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${valB}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{ position: 'absolute', top: 0, left: 0, bottom: 0, background: winner === 'B' ? 'var(--ink)' : 'var(--neutral-400)' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}


/* ── Main Page ───────────────────────────────────────── */
export function RepositoryComparePage() {
  const { repositories, fetchRepositories } = useGitHubStore()
  const [repoAId, setRepoAId] = useState<string>('')
  const [repoBId, setRepoBId] = useState<string>('')
  const [result, setResult] = useState<CompareResult | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { fetchRepositories() }, [fetchRepositories])
  useEffect(() => {
    if (repositories.length >= 2 && !repoAId && !repoBId) {
      setRepoAId(repositories[0]._id)
      setRepoBId(repositories[1]._id)
    }
  }, [repositories, repoAId, repoBId])

  const repoA = repositories.find(r => r._id === repoAId)
  const repoB = repositories.find(r => r._id === repoBId)

  const compare = async () => {
    if (!repoA || !repoB) return
    if (repoA._id === repoB._id) {
      setError('Please select two different repositories to compare.')
      return
    }

    setIsGenerating(true)
    setError(null)
    setResult(null)
    try {
      const { data } = await api.post('/api/analysis/compare', { repoAId: repoA._id, repoBId: repoB._id })
      setResult(data)
    } catch (e: any) {
      console.error(e)
      setError(e?.response?.data?.error || 'Failed to compare repositories.')
    }
    setIsGenerating(false)
  }

  const metrics = result ? [
    { label: 'Complexity', a: result.complexityComparison.a, b: result.complexityComparison.b, verdict: result.complexityComparison.verdict },
    { label: 'Innovation', a: result.innovationComparison.a, b: result.innovationComparison.b, verdict: result.innovationComparison.verdict },
    { label: 'Documentation', a: result.documentationComparison.a, b: result.documentationComparison.b, verdict: result.documentationComparison.verdict },
    { label: 'Technical Depth', a: result.technicalDepth.a, b: result.technicalDepth.b, verdict: result.technicalDepth.verdict },
    { label: 'Recruiter Value', a: result.recruiterValue.a, b: result.recruiterValue.b, verdict: result.recruiterValue.recommendation },
  ] : []

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
        }}
      >
        <div className="uppercase-label" style={{ marginBottom: 10 }}>AI Comparison</div>
        <h1 style={{
          fontFamily: 'var(--font-serif-display)',
          fontWeight: 900,
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          letterSpacing: '-0.03em',
          lineHeight: 1,
          marginBottom: 8,
        }}>
          Repository Compare
        </h1>
        <p style={{ fontFamily: 'var(--font-serif-body)', fontStyle: 'italic', color: 'var(--neutral-600)', fontSize: '1rem' }}>
          Head-to-head AI analysis of two repositories for recruiter impact.
        </p>
      </motion.div>

      {/* ── Selectors ─────────────────────────────────── */}
      <div style={{
        border: 'var(--border-thin)',
        padding: '32px',
        marginBottom: 32,
        background: 'var(--neutral-100)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 24, alignItems: 'center' }}>
          
          {/* Repo A */}
          <div>
            <label className="uppercase-label" style={{ display: 'block', marginBottom: 10 }}>Repository A</label>
            <select className="np-input" value={repoAId} onChange={(e) => { setRepoAId(e.target.value); setResult(null); setError(null) }} style={{ width: '100%', cursor: 'pointer', background: 'var(--paper)' }}>
              {repositories.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, paddingTop: 20 }}>
            <ArrowLeftRight size={20} color="var(--ink)" />
            <span style={{ fontFamily: 'var(--font-serif-display)', fontStyle: 'italic', color: 'var(--neutral-500)', fontSize: '0.85rem' }}>vs</span>
          </div>

          {/* Repo B */}
          <div>
            <label className="uppercase-label" style={{ display: 'block', marginBottom: 10 }}>Repository B</label>
            <select className="np-input" value={repoBId} onChange={(e) => { setRepoBId(e.target.value); setResult(null); setError(null) }} style={{ width: '100%', cursor: 'pointer', background: 'var(--paper)' }}>
              {repositories.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
            </select>
          </div>
        </div>

        {/* Action Row */}
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <button
            className="btn-primary"
            onClick={compare}
            disabled={isGenerating || !repoAId || !repoBId}
            style={{ width: '100%', justifyContent: 'center', height: 48 }}
          >
            {isGenerating ? <><RefreshCw size={15} style={{ animation: 'spin-slow 1s linear infinite' }} /> Comparing...</> : <><Sparkles size={15} /> Compare Repositories</>}
          </button>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                <div style={{ padding: '14px 16px', border: '1px solid var(--red)', background: 'rgba(204,0,0,0.04)', color: 'var(--red)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <AlertTriangle size={15} strokeWidth={1.5} />
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Report Results ───────────────────────────── */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 0, border: 'var(--border-thin)' }}>
          
          {/* Winner Banner */}
          <div style={{ gridColumn: 'span 12', background: 'var(--ink)', color: 'var(--paper)', borderBottom: 'var(--border-thick)', padding: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <Trophy size={48} strokeWidth={1.5} color="var(--paper)" />
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
                  Winner for Recruiter Impact
                </div>
                <div style={{ fontFamily: 'var(--font-serif-display)', fontWeight: 900, fontSize: '2.5rem', lineHeight: 1 }}>
                  {result.winner === 'A' ? result.repositoryA.name : result.repositoryB.name}
                </div>
                <div style={{ fontFamily: 'var(--font-serif-body)', fontSize: '1rem', color: 'rgba(255,255,255,0.8)', marginTop: 12, maxWidth: '60ch' }}>
                  {result.recruiterValue.recommendation}
                </div>
              </div>
            </div>
          </div>

          {/* Side by Side Strengths/Weaknesses */}
          {[result.repositoryA, result.repositoryB].map((repo, i) => (
            <div key={i} style={{ gridColumn: 'span 6', borderRight: i === 0 ? 'var(--border-thin)' : 'none', borderBottom: 'var(--border-thick)' }}>
              <div style={{ padding: '20px 24px', borderBottom: 'var(--border-thin)', background: 'var(--neutral-100)' }}>
                <div className="uppercase-label">{repo.name}</div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 0 }}>
                {/* Strengths */}
                <div style={{ padding: '24px', borderBottom: 'var(--border-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <CheckCircle2 size={14} color="var(--ink)" />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Strengths</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {repo.strengths.map(s => (
                      <div key={s} style={{ fontFamily: 'var(--font-serif-body)', fontSize: '0.9rem', color: 'var(--neutral-700)' }}>• {s}</div>
                    ))}
                  </div>
                </div>

                {/* Weaknesses */}
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <XCircle size={14} color="var(--red)" />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--red)' }}>Weaknesses</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {repo.weaknesses.map(w => (
                      <div key={w} style={{ fontFamily: 'var(--font-serif-body)', fontSize: '0.9rem', color: 'var(--neutral-600)' }}>— {w}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Head-to-Head Metrics */}
          <div style={{ gridColumn: 'span 12', borderBottom: 'var(--border-thick)' }}>
            <div style={{ padding: '20px 24px', borderBottom: 'var(--border-thin)', background: 'var(--neutral-100)' }}>
              <div className="uppercase-label">Head-to-Head Metrics</div>
            </div>
            <div>
              {metrics.map(m => (
                <MetricRow key={m.label} label={m.label} valA={m.a} valB={m.b} nameA={result.repositoryA.name} nameB={result.repositoryB.name} verdict={m.verdict} />
              ))}
            </div>
          </div>

          {/* AI Analysis Paragraph */}
          <div style={{ gridColumn: 'span 12', padding: '32px' }}>
            <div className="uppercase-label" style={{ marginBottom: 16 }}>AI Comparative Analysis</div>
            <p style={{ fontFamily: 'var(--font-serif-body)', fontSize: '1rem', lineHeight: 1.85, color: 'var(--neutral-700)', maxWidth: '80ch' }}>
              {result.aiAnalysis}
            </p>
          </div>

        </motion.div>
      )}

      {/* ── Empty State ──────────────────────────────── */}
      {!result && !isGenerating && !error && (
        <div style={{ border: 'var(--border-thin)', padding: '100px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ fontFamily: 'var(--font-serif-display)', fontSize: '4rem', fontWeight: 900, color: 'var(--muted)', lineHeight: 1 }}>
            ±
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif-display)', fontWeight: 700, fontSize: '1.4rem' }}>
            Ready to Compare
          </h3>
          <p style={{ fontFamily: 'var(--font-serif-body)', fontStyle: 'italic', color: 'var(--neutral-600)', maxWidth: '40ch' }}>
            Select two repositories above to run a head-to-head AI analysis. Discover which project makes a stronger impact on technical recruiters.
          </p>
        </div>
      )}
    </div>
  )
}
