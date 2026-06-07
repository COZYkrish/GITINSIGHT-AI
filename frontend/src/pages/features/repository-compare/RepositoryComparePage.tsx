import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, RefreshCw, GitBranch, ArrowLeftRight, Trophy } from 'lucide-react'
import { GlassCard, GlowBadge, ScoreGauge, ProgressBar } from '../../../components/ui/GlassCard'
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

export function RepositoryComparePage() {
  const { repositories, fetchRepositories } = useGitHubStore()
  const [repoA, setRepoA] = useState<Repository | null>(null)
  const [repoB, setRepoB] = useState<Repository | null>(null)
  const [result, setResult] = useState<CompareResult | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => { fetchRepositories() }, [fetchRepositories])
  useEffect(() => {
    if (repositories.length >= 2 && !repoA && !repoB) {
      setRepoA(repositories[0])
      setRepoB(repositories[1])
    }
  }, [repositories])

  const compare = async () => {
    if (!repoA || !repoB) return
    setIsGenerating(true)
    try {
      const { data } = await api.post('/api/analysis/compare', { repoAId: repoA._id, repoBId: repoB._id })
      setResult(data)
    } catch (e) { console.error(e) }
    setIsGenerating(false)
  }

  const metrics = result ? [
    { label: 'Complexity', a: result.complexityComparison.a, b: result.complexityComparison.b, verdict: result.complexityComparison.verdict },
    { label: 'Innovation', a: result.innovationComparison.a, b: result.innovationComparison.b, verdict: result.innovationComparison.verdict },
    { label: 'Documentation', a: result.documentationComparison.a, b: result.documentationComparison.b, verdict: result.documentationComparison.verdict },
    { label: 'Recruiter Value', a: result.recruiterValue.a, b: result.recruiterValue.b, verdict: result.recruiterValue.recommendation },
    { label: 'Technical Depth', a: result.technicalDepth.a, b: result.technicalDepth.b, verdict: result.technicalDepth.verdict },
  ] : []

  const RepoSelector = ({ label, selected, onChange }: { label: string; selected: Repository | null; onChange: (r: Repository) => void }) => (
    <div>
      <div className="section-label" style={{ marginBottom: 8 }}>{label}</div>
      <select value={selected?._id || ''} onChange={e => { const r = repositories.find(r => r._id === e.target.value); if (r) onChange(r) }}
        className="glass-input" style={{ paddingLeft: 14 }}>
        {repositories.map(r => <option key={r._id} value={r._id} style={{ background: '#111' }}>{r.name}</option>)}
      </select>
    </div>
  )

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 32 }}>
        <div className="section-label">AI Comparison</div>
        <h1>Repository Compare</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Head-to-head AI analysis of two repositories for recruiter impact</p>
      </motion.div>

      {/* Selector */}
      <GlassCard style={{ marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 20, alignItems: 'end' }}>
          <RepoSelector label="Repository A" selected={repoA} onChange={setRepoA} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, paddingBottom: 4 }}>
            <ArrowLeftRight size={24} color="var(--accent-blue)" />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>vs</span>
          </div>
          <RepoSelector label="Repository B" selected={repoB} onChange={setRepoB} />
        </div>
        <button className="btn-primary" onClick={compare} disabled={isGenerating || !repoA || !repoB} style={{ marginTop: 20, width: '100%', justifyContent: 'center' }}>
          {isGenerating ? <><RefreshCw size={16} style={{ animation: 'spin-slow 1s linear infinite' }} /> Comparing...</> : <><Sparkles size={16} /> Compare Repositories</>}
        </button>
      </GlassCard>

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 20 }}>
          {/* Winner Banner */}
          <div style={{ gridColumn: 'span 12' }}>
            <div style={{ padding: '24px 32px', background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.08))', border: '1px solid var(--accent-blue)', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', gap: 20 }}>
              <Trophy size={40} color="var(--accent-amber)" />
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>WINNER FOR RECRUITER IMPACT</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--accent-amber)' }}>
                  {result.winner === 'A' ? result.repositoryA.name : result.repositoryB.name}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>{result.recruiterValue.recommendation}</div>
              </div>
            </div>
          </div>

          {/* Metric Bars */}
          <GlassCard style={{ gridColumn: 'span 12' }}>
            <div className="section-label" style={{ marginBottom: 20 }}>Head-to-Head Metrics</div>
            {metrics.map(m => (
              <div key={m.label} style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{m.label}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: 300, textAlign: 'right' }}>{m.verdict}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr', gap: 8, alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                      <span>{result.repositoryA.name}</span><span style={{ color: 'var(--accent-blue)' }}>{m.a}</span>
                    </div>
                    <ProgressBar value={m.a} color="var(--accent-blue)" height={8} />
                  </div>
                  <div style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>vs</div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                      <span>{result.repositoryB.name}</span><span style={{ color: 'var(--accent-purple)' }}>{m.b}</span>
                    </div>
                    <ProgressBar value={m.b} color="var(--accent-purple)" height={8} />
                  </div>
                </div>
              </div>
            ))}
          </GlassCard>

          {/* Side by side strengths */}
          {[result.repositoryA, result.repositoryB].map((repo, i) => (
            <GlassCard key={i} style={{ gridColumn: 'span 6' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: i === 0 ? 'var(--accent-blue)' : 'var(--accent-purple)' }} />
                <div className="section-label" style={{ marginBottom: 0 }}>{repo.name}</div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-green)', marginBottom: 6, fontWeight: 600 }}>Strengths</div>
                {repo.strengths.map(s => <div key={s} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', padding: '4px 0' }}>✓ {s}</div>)}
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-pink)', marginBottom: 6, fontWeight: 600 }}>Weaknesses</div>
                {repo.weaknesses.map(w => <div key={w} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', padding: '4px 0' }}>✗ {w}</div>)}
              </div>
            </GlassCard>
          ))}

          {/* AI Analysis */}
          <GlassCard style={{ gridColumn: 'span 12' }}>
            <div className="section-label" style={{ marginBottom: 12 }}>🧠 AI Comparative Analysis</div>
            <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)' }}>{result.aiAnalysis}</p>
          </GlassCard>
        </motion.div>
      )}
    </div>
  )
}
