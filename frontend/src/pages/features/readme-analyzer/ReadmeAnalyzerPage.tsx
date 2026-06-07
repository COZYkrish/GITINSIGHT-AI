import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { GlassCard, ScoreGauge, GlowBadge, ProgressBar } from '../../../components/ui/GlassCard'
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

export function ReadmeAnalyzerPage() {
  const { repositories, fetchRepositories } = useGitHubStore()
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null)
  const [report, setReport] = useState<ReadmeReport | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showEnhanced, setShowEnhanced] = useState(false)

  useEffect(() => { fetchRepositories() }, [fetchRepositories])
  useEffect(() => { if (repositories.length > 0 && !selectedRepo) setSelectedRepo(repositories[0]) }, [repositories])

  const analyze = async () => {
    if (!selectedRepo) return
    setIsGenerating(true)
    setReport(null)
    setShowEnhanced(false)
    try {
      const { data } = await api.post(`/api/analysis/readme`, { repositoryId: selectedRepo._id })
      setReport(data)
    } catch (e) { console.error(e) }
    setIsGenerating(false)
  }

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 32 }}>
        <div className="section-label">AI Documentation</div>
        <h1>README Analyzer</h1>
        <p style={{ color: 'var(--text-secondary)' }}>AI-powered README quality analysis and enhancement</p>
      </motion.div>

      {/* Repository Selector */}
      <GlassCard style={{ marginBottom: 24 }}>
        <div className="section-label" style={{ marginBottom: 12 }}>Select Repository</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
          {repositories.slice(0, 12).map(repo => (
            <button key={repo._id} onClick={() => { setSelectedRepo(repo); setReport(null) }}
              style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${selectedRepo?._id === repo._id ? 'var(--accent-blue)' : 'var(--glass-border)'}`,
                background: selectedRepo?._id === repo._id ? 'var(--accent-blue-dim)' : 'var(--glass-bg)',
                color: selectedRepo?._id === repo._id ? 'var(--accent-blue)' : 'var(--text-secondary)',
                cursor: 'pointer', fontSize: '0.85rem', fontWeight: selectedRepo?._id === repo._id ? 600 : 400,
                transition: 'all 0.15s ease' }}>
              {repo.name}
            </button>
          ))}
        </div>
        <button className="btn-primary" onClick={analyze} disabled={isGenerating || !selectedRepo}>
          {isGenerating ? <><RefreshCw size={16} style={{ animation: 'spin-slow 1s linear infinite' }} /> Analyzing...</> : <><Sparkles size={16} /> Analyze README</>}
        </button>
      </GlassCard>

      {report && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 20 }}>
          {/* Scores */}
          <GlassCard style={{ gridColumn: 'span 4', textAlign: 'center' }}>
            <div className="section-label" style={{ marginBottom: 16 }}>README Score</div>
            <ScoreGauge score={report.score} size={140} label="/100" color="var(--accent-blue)" />
          </GlassCard>

          <GlassCard style={{ gridColumn: 'span 4', textAlign: 'center' }}>
            <div className="section-label" style={{ marginBottom: 16 }}>Health Score</div>
            <ScoreGauge score={report.healthScore} size={140} label="/100" color={report.healthScore >= 70 ? 'var(--accent-green)' : 'var(--accent-amber)'} />
          </GlassCard>

          <GlassCard style={{ gridColumn: 'span 4' }}>
            <div className="section-label" style={{ marginBottom: 16 }}>Missing Sections</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {report.missingSections.length === 0 ? (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--accent-green)' }}>
                  <CheckCircle size={16} /> Complete README!
                </div>
              ) : report.missingSections.map(s => (
                <div key={s} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.85rem' }}>
                  <AlertCircle size={14} color="var(--accent-amber)" />
                  <span style={{ color: 'var(--text-secondary)' }}>{s}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Suggestions */}
          <GlassCard style={{ gridColumn: 'span 12' }}>
            <div className="section-label" style={{ marginBottom: 16 }}>💡 Improvement Suggestions</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
              {report.suggestions.map((s, i) => (
                <div key={i} style={{ padding: '12px 16px', background: 'var(--glass-bg)', borderRadius: 10,
                  border: '1px solid var(--glass-border)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>{i + 1}.</span> {s}
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Enhanced README */}
          <GlassCard style={{ gridColumn: 'span 12' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div className="section-label">✨ AI-Enhanced README</div>
              <button onClick={() => setShowEnhanced(!showEnhanced)}
                className="btn-ghost" style={{ fontSize: '0.8rem' }}>
                {showEnhanced ? 'Hide' : 'Show'} Enhanced README
              </button>
            </div>
            {showEnhanced && (
              <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', lineHeight: 1.7,
                color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                background: 'rgba(0,0,0,0.4)', padding: 20, borderRadius: 10, maxHeight: 500, overflowY: 'auto' }}>
                {report.enhancedReadme}
              </pre>
            )}
          </GlassCard>
        </motion.div>
      )}

      {!report && !isGenerating && (
        <div style={{ textAlign: 'center', padding: '80px 40px' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>📝</div>
          <h3 style={{ marginBottom: 12 }}>Select a repository to analyze</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Get AI-powered README quality scores and enhancement suggestions</p>
        </div>
      )}
    </div>
  )
}
