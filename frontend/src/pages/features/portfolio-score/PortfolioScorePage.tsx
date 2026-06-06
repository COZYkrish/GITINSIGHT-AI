import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, RefreshCw, Share2, Download, ArrowRight } from 'lucide-react'
import { GlassCard, GlowBadge, ScoreGauge, ProgressBar } from '../../../components/ui/GlassCard'
import { ScoreSphere } from '../../../components/three/ScoreSphere'
import api from '../../../services/api'
import { PortfolioScore } from '../../../types'

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
    { label: 'Project Quality', value: score.projectQuality, color: 'var(--accent-blue)' },
    { label: 'Documentation', value: score.documentation, color: 'var(--accent-purple)' },
    { label: 'Consistency', value: score.consistency, color: 'var(--accent-cyan)' },
    { label: 'Technical Diversity', value: score.technicalDiversity, color: 'var(--accent-green)' },
    { label: 'Innovation', value: score.innovation, color: 'var(--accent-pink)' },
  ] : []

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div className="section-label">AI Analysis</div>
          <h1>Portfolio Score</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Quantified assessment of your portfolio quality</p>
        </div>
        <button className="btn-primary" onClick={generate} disabled={isGenerating}>
          {isGenerating ? <><RefreshCw size={16} style={{ animation: 'spin-slow 1s linear infinite' }} /> Analyzing...</> : <><Sparkles size={16} /> {score ? 'Regenerate' : 'Generate Score'}</>}
        </button>
      </motion.div>

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {[1,2,3].map(i => <div key={i} className="shimmer" style={{ height: 300 }} />)}
        </div>
      ) : score ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 20 }}>
          {/* 3D Score Sphere */}
          <GlassCard style={{ gridColumn: 'span 5', textAlign: 'center', minHeight: 360 }} glow="blue">
            <div className="section-label" style={{ marginBottom: 12 }}>Overall Score</div>
            <div style={{ height: 260, position: 'relative' }}>
              <Suspense fallback={<div className="shimmer" style={{ height: 260 }} />}>
                <ScoreSphere score={score.overallScore} />
              </Suspense>
            </div>
            <div style={{ fontSize: '3rem', fontFamily: 'var(--font-mono)', fontWeight: 800, 
              background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {score.overallScore}<span style={{ fontSize: '1.5rem' }}>/100</span>
            </div>
          </GlassCard>

          {/* Score Breakdown */}
          <GlassCard style={{ gridColumn: 'span 7' }}>
            <div className="section-label" style={{ marginBottom: 20 }}>Score Breakdown</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {categories.map(cat => (
                <div key={cat.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.875rem' }}>{cat.label}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: cat.color, fontWeight: 700 }}>{cat.value}/100</span>
                  </div>
                  <ProgressBar value={cat.value} color={cat.color} height={8} />
                </div>
              ))}
            </div>
          </GlassCard>

          {/* AI Explanation */}
          <GlassCard style={{ gridColumn: 'span 12' }}>
            <div className="section-label" style={{ marginBottom: 12 }}>🧠 AI Analysis</div>
            <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)' }}>{score.aiExplanation}</p>
          </GlassCard>

          {/* Suggestions */}
          <GlassCard style={{ gridColumn: 'span 12' }}>
            <div className="section-label" style={{ marginBottom: 16 }}>💡 Improvement Suggestions</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
              {score.suggestions.map((s, i) => (
                <motion.div key={i} className="glass"
                  style={{ padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                  <span style={{ color: 'var(--accent-blue)', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{s}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '100px 40px' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>📊</div>
          <h3 style={{ marginBottom: 12 }}>No Portfolio Score Yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Generate your AI-powered portfolio assessment</p>
          <button className="btn-primary" onClick={generate} disabled={isGenerating}>
            <Sparkles size={16} /> Generate Portfolio Score
          </button>
        </div>
      )}
    </div>
  )
}
