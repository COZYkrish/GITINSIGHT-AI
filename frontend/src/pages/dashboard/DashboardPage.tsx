import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RefreshCw, ArrowRight, Zap, TrendingUp, Star, GitBranch, Users, Code } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useGitHubStore } from '../../store/githubStore'
import { GlassCard, ScoreGauge, ProgressBar, GlowBadge } from '../../components/ui/GlassCard'
import api from '../../services/api'
import type { DeveloperDNA, PortfolioScore, CareerReport } from '../../types'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'

export function DashboardPage() {
  const { user } = useAuthStore()
  const { profile, repositories, fetchProfile, fetchRepositories } = useGitHubStore()
  const [dna, setDna] = useState<DeveloperDNA | null>(null)
  const [portfolioScore, setPortfolioScore] = useState<PortfolioScore | null>(null)
  const [careerReport, setCareerReport] = useState<CareerReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      await Promise.all([fetchProfile(), fetchRepositories()])
      try {
        const [dnaRes, scoreRes, careerRes] = await Promise.allSettled([
          api.get('/api/analysis/developer-dna'),
          api.get('/api/analysis/portfolio-score'),
          api.get('/api/analysis/career'),
        ])
        if (dnaRes.status === 'fulfilled') setDna(dnaRes.value.data)
        if (scoreRes.status === 'fulfilled') setPortfolioScore(scoreRes.value.data)
        if (careerRes.status === 'fulfilled') setCareerReport(careerRes.value.data)
      } catch { /* reports not yet generated */ }
      setIsLoading(false)
    }
    load()
  }, [fetchProfile, fetchRepositories])

  const topRepos = [...repositories].sort((a, b) => b.stars - a.stars).slice(0, 5)
  const langData = profile?.languages?.slice(0, 6).map(l => ({ name: l.name, value: Math.round(l.percentage) })) || []

  const quickActions = [
    { path: '/developer-dna', icon: '🧬', label: 'Generate DNA', color: 'var(--accent-purple)', desc: dna ? `${dna.archetype}` : 'Discover your archetype' },
    { path: '/portfolio-score', icon: '📊', label: 'Portfolio Score', color: 'var(--accent-blue)', desc: portfolioScore ? `${portfolioScore.overallScore}/100` : 'Get your score' },
    { path: '/ai-recruiter', icon: '🎯', label: 'AI Recruiter', color: 'var(--accent-cyan)', desc: 'Hiring simulation' },
    { path: '/resume-builder', icon: '📄', label: 'Build Resume', color: 'var(--accent-green)', desc: 'AI-generated resume' },
  ]

  return (
    <div className="page-container">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <div className="section-label">Command Center</div>
        <h1 style={{ marginBottom: 8 }}>
          Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {profile ? `@${profile.username} · ${profile.publicRepos} repositories · ${profile.totalStars} ⭐` : 'Connect your GitHub to get started'}
        </p>
      </motion.div>

      {/* DNA Banner */}
      {dna && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="gradient-border"
          style={{ marginBottom: 32, borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}
        >
          <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(59,130,246,0.08))', padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ fontSize: '3rem' }}>{dna.archetypeEmoji}</div>
              <div>
                <div className="section-label" style={{ marginBottom: 4 }}>Your Developer DNA™</div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 4 }}>{dna.archetype}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 400 }}>{dna.description}</p>
              </div>
            </div>
            <Link to="/developer-dna" className="btn-secondary" style={{ flexShrink: 0 }}>
              Explore DNA <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      )}

      {/* Stats Row */}
      {profile && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { icon: GitBranch, label: 'Repositories', value: profile.publicRepos, color: 'var(--accent-blue)' },
            { icon: Star, label: 'Total Stars', value: profile.totalStars, color: 'var(--accent-amber)' },
            { icon: Users, label: 'Followers', value: profile.followers, color: 'var(--accent-purple)' },
            { icon: Code, label: 'Top Language', value: profile.topLanguage, color: 'var(--accent-cyan)' },
          ].map(({ icon: Icon, label, value, color }, i) => (
            <motion.div key={label} className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <Icon size={18} color={color} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{label}</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', color }}>{value}</div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 20, marginBottom: 24 }}>
        {/* Portfolio Score */}
        <GlassCard style={{ gridColumn: 'span 4' }}>
          <div className="section-label" style={{ marginBottom: 16 }}>Portfolio Score</div>
          {portfolioScore ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
              <ScoreGauge score={portfolioScore.overallScore} size={140} label="/100" color="var(--accent-blue)" />
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Project Quality', value: portfolioScore.projectQuality },
                  { label: 'Documentation', value: portfolioScore.documentation },
                  { label: 'Innovation', value: portfolioScore.innovation },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 4 }}>
                      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)' }}>{value}</span>
                    </div>
                    <ProgressBar value={value} color="var(--accent-blue)" height={4} />
                  </div>
                ))}
              </div>
              <Link to="/portfolio-score" className="btn-ghost" style={{ alignSelf: 'flex-end', fontSize: '0.8rem' }}>
                Full Report <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📊</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 16 }}>Not generated yet</p>
              <Link to="/portfolio-score" className="btn-secondary" style={{ fontSize: '0.85rem', padding: '10px 20px' }}>
                Analyze Now
              </Link>
            </div>
          )}
        </GlassCard>

        {/* Language Chart */}
        <GlassCard style={{ gridColumn: 'span 4' }}>
          <div className="section-label" style={{ marginBottom: 16 }}>Language Stack</div>
          {langData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={langData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={80} tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'rgba(8,8,8,0.95)', border: '1px solid var(--glass-border)', borderRadius: 10, color: 'white' }} formatter={(v) => [`${v}%`, 'Usage']} />
                <Bar dataKey="value" fill="url(#barGrad)" radius={[0, 6, 6, 0]} />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Connect GitHub to see language data
            </div>
          )}
        </GlassCard>

        {/* Career Snapshot */}
        <GlassCard style={{ gridColumn: 'span 4' }}>
          <div className="section-label" style={{ marginBottom: 16 }}>Career Readiness</div>
          {careerReport ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <ScoreGauge score={careerReport.overallReadiness} size={80} color="var(--accent-purple)" />
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Overall</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Readiness Score</div>
                </div>
              </div>
              {careerReport.roles.slice(0, 3).map(role => (
                <div key={role.name} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{role.name}</span>
                    <span style={{ color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)' }}>{role.matchPercentage}%</span>
                  </div>
                  <ProgressBar value={role.matchPercentage} color="var(--accent-purple)" height={4} />
                </div>
              ))}
              <Link to="/career-readiness" className="btn-ghost" style={{ fontSize: '0.8rem', marginTop: 8 }}>
                Full Report <ArrowRight size={14} />
              </Link>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🚀</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 16 }}>Assess your readiness</p>
              <Link to="/career-readiness" className="btn-secondary" style={{ fontSize: '0.85rem', padding: '10px 20px' }}>
                Analyze Now
              </Link>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: 24 }}>
        <div className="section-label" style={{ marginBottom: 16 }}>Quick Actions</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {quickActions.map((action, i) => (
            <motion.div key={action.path} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Link to={action.path} style={{ textDecoration: 'none' }}>
                <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', borderLeft: `2px solid ${action.color}` }}>
                  <div style={{ fontSize: '1.75rem' }}>{action.icon}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 2 }}>{action.label}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{action.desc}</div>
                  </div>
                  <ArrowRight size={16} color="var(--text-muted)" style={{ marginLeft: 'auto' }} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Top Repositories */}
      {topRepos.length > 0 && (
        <GlassCard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div className="section-label">Top Repositories</div>
            <Link to="/repository-ranking" style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', textDecoration: 'none' }}>
              View all <ArrowRight size={12} style={{ display: 'inline' }} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {topRepos.map((repo, i) => (
              <div key={repo._id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 0', borderBottom: i < topRepos.length - 1 ? '1px solid var(--glass-border)' : 'none' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', width: 16 }}>#{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 2 }}>{repo.name}</div>
                  {repo.description && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 400 }}>{repo.description}</div>}
                </div>
                {repo.language && <GlowBadge color="blue">{repo.language}</GlowBadge>}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--accent-amber)', fontSize: '0.85rem' }}>
                  <Star size={13} />
                  {repo.stars}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  )
}
