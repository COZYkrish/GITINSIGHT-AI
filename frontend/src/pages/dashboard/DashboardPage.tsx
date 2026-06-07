import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RefreshCw, ArrowRight, TrendingUp, Star, GitBranch, Users, Code } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useGitHubStore } from '../../store/githubStore'
import { NewsprintCard, ScoreGauge, ProgressBar } from '../../components/ui/NewsprintCard'
import api from '../../services/api'
import type { DeveloperDNA, PortfolioScore, CareerReport } from '../../types'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts'

function RevealBlock({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

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
    { path: '/developer-dna', label: 'Developer DNA', num: '01', desc: dna ? dna.archetype : 'Discover your archetype' },
    { path: '/portfolio-score', label: 'Portfolio Score', num: '02', desc: portfolioScore ? `${portfolioScore.overallScore}/100` : 'Get your score' },
    { path: '/ai-recruiter', label: 'AI Recruiter', num: '03', desc: 'Simulate hiring process' },
    { path: '/resume-builder', label: 'Resume Builder', num: '04', desc: 'AI-generated, ATS-ready' },
  ]

  return (
    <div className="page-container">

      {/* ── Page header ──────────────────────────────── */}
      <RevealBlock>
        <div style={{ borderBottom: 'var(--border-thick)', paddingBottom: 24, marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div className="uppercase-label" style={{ marginBottom: 10 }}>Command Center</div>
              <h1 style={{
                fontFamily: 'var(--font-serif-display)',
                fontWeight: 900,
                fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                lineHeight: 1.0,
                letterSpacing: '-0.03em',
                marginBottom: 8,
              }}>
                Welcome back, {user?.name?.split(' ')[0]}.
              </h1>
              <p style={{ fontFamily: 'var(--font-serif-body)', fontSize: '0.9rem', color: 'var(--neutral-600)' }}>
                {profile
                  ? `@${profile.username} · ${profile.publicRepos} repositories · ${profile.totalStars} ★ total`
                  : 'Connect your GitHub to get started'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 0 }}>
              <span className="edition-meta" style={{ padding: '6px 12px', border: 'var(--border-thin)' }}>
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </RevealBlock>

      {/* ── DNA Banner ───────────────────────────────── */}
      {dna && (
        <RevealBlock delay={0.05}>
          <div style={{
            background: 'var(--ink)',
            color: 'var(--paper)',
            padding: '24px 32px',
            marginBottom: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{
                fontFamily: 'var(--font-serif-display)',
                fontSize: '3rem',
                lineHeight: 1,
              }}>
                {dna.archetypeEmoji}
              </div>
              <div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.58rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)',
                  marginBottom: 6,
                }}>
                  Your Developer DNA™
                </div>
                <div style={{
                  fontFamily: 'var(--font-serif-display)',
                  fontWeight: 800,
                  fontSize: '1.5rem',
                  color: 'var(--paper)',
                  letterSpacing: '-0.02em',
                  marginBottom: 4,
                }}>
                  {dna.archetype}
                </div>
                <p style={{ fontFamily: 'var(--font-serif-body)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', maxWidth: 400 }}>
                  {dna.description}
                </p>
              </div>
            </div>
            <Link
              to="/developer-dna"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 20px',
                border: '1px solid rgba(255,255,255,0.3)',
                background: 'transparent',
                color: 'var(--paper)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 700,
                fontSize: '0.72rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'all 0.1s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'var(--paper)'
                ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--ink)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
                ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--paper)'
              }}
            >
              Explore DNA <ArrowRight size={14} />
            </Link>
          </div>
        </RevealBlock>
      )}

      {/* ── Stats Row ────────────────────────────────── */}
      {profile && (
        <RevealBlock delay={0.1}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            border: 'var(--border-thin)',
            marginBottom: 32,
          }}>
            {[
              { icon: GitBranch, label: 'Repositories', value: profile.publicRepos },
              { icon: Star, label: 'Total Stars', value: profile.totalStars },
              { icon: Users, label: 'Followers', value: profile.followers },
              { icon: Code, label: 'Top Language', value: profile.topLanguage },
            ].map(({ icon: Icon, label, value }, i) => (
              <div key={label} style={{
                padding: '20px 24px',
                borderRight: i < 3 ? 'var(--border-thin)' : 'none',
                transition: 'background 0.1s',
              }}
                onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.background = 'var(--neutral-100)')}
                onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.background = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Icon size={14} strokeWidth={1.5} color="var(--neutral-500)" />
                  <span className="uppercase-label">{label}</span>
                </div>
                <div style={{
                  fontFamily: 'var(--font-serif-display)',
                  fontWeight: 900,
                  fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
                  color: 'var(--ink)',
                  lineHeight: 1,
                }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </RevealBlock>
      )}

      {/* ── Main Analysis Grid ───────────────────────── */}
      <RevealBlock delay={0.15}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          border: 'var(--border-thin)',
          marginBottom: 32,
        }}>
          {/* Portfolio Score */}
          <div style={{ padding: '28px', borderRight: 'var(--border-thin)' }}>
            <div className="uppercase-label" style={{ marginBottom: 20 }}>Portfolio Score</div>
            {portfolioScore ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                <ScoreGauge score={portfolioScore.overallScore} size={130} label="/100" />
                <div style={{ width: '100%' }}>
                  {[
                    { label: 'Project Quality', value: portfolioScore.projectQuality },
                    { label: 'Documentation', value: portfolioScore.documentation },
                    { label: 'Innovation', value: portfolioScore.innovation },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--neutral-500)', letterSpacing: '0.08em' }}>{label}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700, color: 'var(--ink)' }}>{value}</span>
                      </div>
                      <ProgressBar value={value} color="var(--ink)" height={3} />
                    </div>
                  ))}
                </div>
                <Link to="/portfolio-score" className="btn-ghost" style={{ alignSelf: 'flex-end', fontSize: '0.72rem', padding: '8px 0' }}>
                  Full Report <ArrowRight size={12} />
                </Link>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{
                  fontFamily: 'var(--font-serif-display)',
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  color: 'var(--muted)',
                  marginBottom: 12,
                  lineHeight: 1,
                }}>—</div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--neutral-400)', marginBottom: 16, letterSpacing: '0.08em' }}>
                  Not generated yet
                </p>
                <Link to="/portfolio-score" className="btn-secondary" style={{ fontSize: '0.72rem', padding: '10px 16px' }}>
                  Analyze Now
                </Link>
              </div>
            )}
          </div>

          {/* Language Stack */}
          <div style={{ padding: '28px', borderRight: 'var(--border-thin)' }}>
            <div className="uppercase-label" style={{ marginBottom: 20 }}>Language Stack</div>
            {langData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={langData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={80}
                    tick={{ fill: 'var(--neutral-600)', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--ink)',
                      border: 'var(--border-thin)',
                      borderRadius: 0,
                      color: 'var(--paper)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                    }}
                    formatter={(v) => [`${v}%`, 'Usage']}
                  />
                  <Bar dataKey="value" radius={0}>
                    {langData.map((_, idx) => (
                      <Cell key={idx} fill={idx === 0 ? 'var(--ink)' : 'var(--neutral-400)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 220, fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--neutral-400)', letterSpacing: '0.08em' }}>
                Connect GitHub to see data
              </div>
            )}
          </div>

          {/* Career Readiness */}
          <div style={{ padding: '28px' }}>
            <div className="uppercase-label" style={{ marginBottom: 20 }}>Career Readiness</div>
            {careerReport ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                  <ScoreGauge score={careerReport.overallReadiness} size={72} />
                  <div>
                    <div className="uppercase-label">Overall</div>
                    <div style={{ fontFamily: 'var(--font-serif-display)', fontWeight: 700, fontSize: '1rem' }}>Readiness Score</div>
                  </div>
                </div>
                {careerReport.roles.slice(0, 3).map(role => (
                  <div key={role.name} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontFamily: 'var(--font-serif-body)', fontSize: '0.82rem', color: 'var(--neutral-700)' }}>{role.name}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700 }}>{role.matchPercentage}%</span>
                    </div>
                    <ProgressBar value={role.matchPercentage} color="var(--ink)" height={3} />
                  </div>
                ))}
                <Link to="/career-readiness" className="btn-ghost" style={{ fontSize: '0.72rem', marginTop: 12, padding: '8px 0' }}>
                  Full Report <ArrowRight size={12} />
                </Link>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontFamily: 'var(--font-serif-display)', fontSize: '2.5rem', fontWeight: 900, color: 'var(--muted)', marginBottom: 12, lineHeight: 1 }}>—</div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--neutral-400)', marginBottom: 16, letterSpacing: '0.08em' }}>Assess your readiness</p>
                <Link to="/career-readiness" className="btn-secondary" style={{ fontSize: '0.72rem', padding: '10px 16px' }}>
                  Analyze Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </RevealBlock>

      {/* ── Quick Actions ─────────────────────────────── */}
      <RevealBlock delay={0.2}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div className="uppercase-label">Quick Actions</div>
            <div style={{ flex: 1, height: 1, background: 'var(--muted)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', border: 'var(--border-thin)', gap: 0 }}>
            {quickActions.map((action, i) => (
              <Link
                key={action.path}
                to={action.path}
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="hard-shadow-hover"
                  style={{
                    padding: '24px 20px',
                    borderRight: i < 3 ? 'var(--border-thin)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.1s',
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.background = 'var(--neutral-100)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.background = 'transparent')}
                >
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem',
                    letterSpacing: '0.12em',
                    color: 'var(--neutral-400)',
                    marginBottom: 12,
                  }}>
                    {action.num}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-serif-display)',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: 'var(--ink)',
                    marginBottom: 4,
                    lineHeight: 1.2,
                  }}>
                    {action.label}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    color: 'var(--neutral-500)',
                    letterSpacing: '0.05em',
                    marginBottom: 16,
                  }}>
                    {action.desc}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--ink)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                    Open <ArrowRight size={11} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </RevealBlock>

      {/* ── Top Repositories ─────────────────────────── */}
      {topRepos.length > 0 && (
        <RevealBlock delay={0.25}>
          <div style={{ border: 'var(--border-thin)', marginBottom: 32 }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 20px',
              borderBottom: 'var(--border-thick)',
            }}>
              <div className="uppercase-label">Top Repositories</div>
              <Link
                to="/repository-ranking"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--neutral-500)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'color 0.1s',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--ink)')}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--neutral-500)')}
              >
                View all <ArrowRight size={11} />
              </Link>
            </div>
            {/* Ruled rows */}
            {topRepos.map((repo, i) => (
              <div
                key={repo._id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '36px 1fr auto auto',
                  alignItems: 'center',
                  gap: 16,
                  padding: '14px 20px',
                  borderBottom: i < topRepos.length - 1 ? 'var(--border-muted)' : 'none',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.background = 'var(--neutral-100)')}
                onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.background = 'transparent')}
              >
                {/* Rank */}
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  color: 'var(--neutral-400)',
                  letterSpacing: '0.08em',
                }}>
                  #{i + 1}
                </span>
                {/* Name + desc */}
                <div>
                  <div style={{
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    color: 'var(--ink)',
                    marginBottom: 2,
                  }}>
                    {repo.name}
                  </div>
                  {repo.description && (
                    <div style={{
                      fontFamily: 'var(--font-serif-body)',
                      fontSize: '0.78rem',
                      color: 'var(--neutral-500)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: 400,
                    }}>
                      {repo.description}
                    </div>
                  )}
                </div>
                {/* Language badge */}
                {repo.language && (
                  <span className="np-badge">{repo.language}</span>
                )}
                {/* Stars */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: 'var(--ink)',
                  fontWeight: 700,
                }}>
                  <Star size={12} strokeWidth={1.5} />
                  {repo.stars}
                </div>
              </div>
            ))}
          </div>
        </RevealBlock>
      )}
    </div>
  )
}
