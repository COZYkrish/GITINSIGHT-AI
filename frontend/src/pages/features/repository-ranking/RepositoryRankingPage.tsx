import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, RefreshCw, Star, GitBranch, ExternalLink } from 'lucide-react'
import { GlassCard, GlowBadge, ScoreGauge } from '../../../components/ui/GlassCard'
import { useGitHubStore } from '../../../store/githubStore'
import { Repository } from '../../../types'

export function RepositoryRankingPage() {
  const { repositories, fetchRepositories } = useGitHubStore()
  const [sorted, setSorted] = useState<Repository[]>([])

  useEffect(() => {
    fetchRepositories()
  }, [fetchRepositories])

  useEffect(() => {
    const s = [...repositories].sort((a, b) => {
      const scoreA = (a.complexityScore || 0) + (a.innovationScore || 0) + a.stars * 2
      const scoreB = (b.complexityScore || 0) + (b.innovationScore || 0) + b.stars * 2
      return scoreB - scoreA
    })
    setSorted(s)
  }, [repositories])

  const podiumColors = ['#f59e0b', '#94a3b8', '#92400e']
  const podiumLabels = ['🥇 1st', '🥈 2nd', '🥉 3rd']

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 32 }}>
        <div className="section-label">AI Ranking</div>
        <h1>Repository Ranking</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Your strongest projects ranked by AI quality metrics</p>
      </motion.div>

      {/* Podium */}
      {sorted.length >= 3 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 16, marginBottom: 48, padding: '0 40px' }}>
          {[1, 0, 2].map((idx) => {
            const repo = sorted[idx]
            const heights = [160, 200, 120]
            return (
              <motion.div
                key={repo._id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
                style={{ textAlign: 'center', flex: 1, maxWidth: 240 }}
              >
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, marginBottom: 4, fontSize: '0.95rem' }}>{repo.name}</div>
                  {repo.language && <GlowBadge color="blue">{repo.language}</GlowBadge>}
                </div>
                <div style={{
                  height: heights[idx], background: `linear-gradient(135deg, ${podiumColors[idx]}30, ${podiumColors[idx]}10)`,
                  border: `2px solid ${podiumColors[idx]}60`, borderRadius: '12px 12px 0 0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', flexDirection: 'column', gap: 8,
                }}>
                  <span>{podiumLabels[idx]}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', color: podiumColors[idx] }}>
                    <Star size={14} /> {repo.stars}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Full Rankings */}
      <GlassCard>
        <div className="section-label" style={{ marginBottom: 20 }}>Repository Leaderboard</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {sorted.map((repo, i) => (
            <motion.div
              key={repo._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px', borderBottom: '1px solid var(--glass-border)', transition: 'background 0.15s', borderRadius: i === 0 ? '12px 12px 0 0' : i === sorted.length - 1 ? '0 0 12px 12px' : 0 }}
              whileHover={{ background: 'var(--glass-bg)' } as never}
            >
              <div style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: i < 3 ? `${podiumColors[i]}20` : 'var(--glass-bg)',
                color: i < 3 ? podiumColors[i] : 'var(--text-muted)',
                fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.85rem', border: `1px solid ${i < 3 ? podiumColors[i] : 'var(--glass-border)'}` }}>
                {i + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>{repo.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {repo.description || repo.fullName}
                </div>
              </div>
              {repo.language && <GlowBadge color="blue">{repo.language}</GlowBadge>}
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Star size={13} style={{ color: 'var(--accent-amber)' }} /> {repo.stars}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><GitBranch size={13} /> {repo.forks}</span>
              </div>
              {repo.homepage && (
                <a href={repo.homepage} target="_blank" rel="noopener noreferrer"
                  style={{ color: 'var(--accent-blue)', display: 'flex' }}>
                  <ExternalLink size={14} />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
