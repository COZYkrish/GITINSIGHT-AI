import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, RefreshCw, Share2 } from 'lucide-react'
import { GlassCard, GlowBadge, ProgressBar } from '../../../components/ui/GlassCard'
import api from '../../../services/api'
import type { DeveloperDNA } from '../../../types'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis } from 'recharts'

const ARCHETYPE_COLORS: Record<string, string> = {
  'The AI Builder': '#8b5cf6',
  'The Product Engineer': '#3b82f6',
  'The Full Stack Architect': '#06b6d4',
  'The Startup Hacker': '#f59e0b',
  'The Problem Solver': '#10b981',
  'The Open Source Contributor': '#ec4899',
  'The Systems Thinker': '#6366f1',
  'The UI Craftsman': '#f43f5e',
  'The Data Scientist': '#14b8a6',
  'The DevOps Engineer': '#84cc16',
}

const ARCHETYPE_DESCRIPTIONS: Record<string, string> = {
  'The AI Builder': 'You\'re drawn to intelligence. Building systems that learn, adapt and reason is your domain.',
  'The Product Engineer': 'You blur the line between engineer and designer. You build things people love.',
  'The Full Stack Architect': 'You see the entire system. Frontend to backend to infrastructure — you own it all.',
  'The Startup Hacker': 'Speed is your superpower. You ship fast, learn faster, and build to matter.',
  'The Problem Solver': 'Complex systems don\'t scare you — they excite you. You engineer elegant solutions.',
  'The Open Source Contributor': 'You build in public, share generously, and lift the entire community with you.',
}

export function DeveloperDNAPage() {
  const [dna, setDna] = useState<DeveloperDNA | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'traits' | 'roadmap'>('overview')

  useEffect(() => {
    setIsLoading(true)
    api.get('/api/analysis/developer-dna').then(r => setDna(r.data)).catch(() => {}).finally(() => setIsLoading(false))
  }, [])

  const generate = async () => {
    setIsGenerating(true)
    try {
      const { data } = await api.post('/api/analysis/developer-dna')
      setDna(data)
    } catch (e) { console.error(e) }
    setIsGenerating(false)
  }

  const accentColor = dna ? (ARCHETYPE_COLORS[dna.archetype] || 'var(--accent-purple)') : 'var(--accent-purple)'
  const radarData = dna?.personalityTraits.map(t => ({ trait: t.trait, score: t.score })) || []

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div className="section-label">Signature Feature</div>
          <h1>Developer DNA™</h1>
          <p style={{ color: 'var(--text-secondary)' }}>AI-powered archetypal analysis of your coding identity</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {dna && (
            <button className="btn-secondary" onClick={() => navigator.clipboard.writeText(`My Developer DNA: ${dna.archetype} ${dna.archetypeEmoji} on GitInsight AI!`)}>
              <Share2 size={16} /> Share
            </button>
          )}
          <button className="btn-primary" onClick={generate} disabled={isGenerating}>
            {isGenerating ? <><RefreshCw size={16} style={{ animation: 'spin-slow 1s linear infinite' }} /> Analyzing DNA...</> : <><Sparkles size={16} /> {dna ? 'Regenerate' : 'Generate My DNA'}</>}
          </button>
        </div>
      </motion.div>

      {isLoading ? (
        <div style={{ display: 'grid', gap: 20 }}>
          {[1,2,3].map(i => <div key={i} className="shimmer" style={{ height: 200 }} />)}
        </div>
      ) : dna ? (
        <div>
          {/* Hero Archetype Card */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            style={{ marginBottom: 24, padding: '40px', borderRadius: 'var(--radius-xl)', position: 'relative', overflow: 'hidden',
              background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}08, rgba(0,0,0,0.6))`,
              border: `1px solid ${accentColor}40`, boxShadow: `0 0 80px ${accentColor}20` }}>
            {/* Decorative orb */}
            <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: `radial-gradient(circle, ${accentColor}20, transparent 70%)`, pointerEvents: 'none' }} />
            
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
              <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity }}
                style={{ fontSize: '6rem', lineHeight: 1 }}>
                {dna.archetypeEmoji}
              </motion.div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.15em', color: accentColor, marginBottom: 8 }}>
                  YOUR DEVELOPER ARCHETYPE
                </div>
                <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 900, color: accentColor, marginBottom: 16, letterSpacing: '-0.03em' }}>
                  {dna.archetype}
                </h2>
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 560 }}>
                  {dna.description}
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
                  {dna.compatibleArchetypes.map(a => (
                    <span key={a} style={{ fontSize: '0.75rem', padding: '4px 12px', borderRadius: 20, background: `${accentColor}20`, color: accentColor, border: `1px solid ${accentColor}40` }}>
                      ⚡ {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--glass-bg)', borderRadius: 12, padding: 4, width: 'fit-content', border: '1px solid var(--glass-border)' }}>
            {(['overview', 'traits', 'roadmap'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ padding: '8px 20px', borderRadius: 9, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
                  background: activeTab === tab ? 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))' : 'transparent',
                  color: activeTab === tab ? 'white' : 'var(--text-muted)', transition: 'all 0.2s ease',
                  textTransform: 'capitalize' }}>
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 20 }}>
              {/* Strengths */}
              <GlassCard style={{ gridColumn: 'span 6' }}>
                <div className="section-label" style={{ marginBottom: 16 }}>💪 Strengths</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {dna.strengths.map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                      style={{ display: 'flex', gap: 10, padding: '10px 14px', background: `${accentColor}10`, borderRadius: 10, border: `1px solid ${accentColor}25` }}>
                      <span style={{ color: accentColor, flexShrink: 0 }}>▹</span>
                      <span style={{ fontSize: '0.875rem' }}>{s}</span>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>

              {/* Growth Areas */}
              <GlassCard style={{ gridColumn: 'span 6' }}>
                <div className="section-label" style={{ marginBottom: 16 }}>🌱 Growth Areas</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {dna.weaknesses.map((w, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                      style={{ display: 'flex', gap: 10, padding: '10px 14px', background: 'rgba(245,158,11,0.08)', borderRadius: 10, border: '1px solid rgba(245,158,11,0.2)' }}>
                      <span style={{ color: 'var(--accent-amber)', flexShrink: 0 }}>△</span>
                      <span style={{ fontSize: '0.875rem' }}>{w}</span>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>

              {/* Recommended Roles */}
              <GlassCard style={{ gridColumn: 'span 6' }}>
                <div className="section-label" style={{ marginBottom: 16 }}>🎯 Best-Fit Roles</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {dna.recommendedRoles.map(r => (
                    <GlowBadge key={r} color="blue">{r}</GlowBadge>
                  ))}
                </div>
              </GlassCard>

              {/* Recommended Tech */}
              <GlassCard style={{ gridColumn: 'span 6' }}>
                <div className="section-label" style={{ marginBottom: 16 }}>⚡ Tech to Master</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {dna.recommendedTechnologies.map(t => (
                    <GlowBadge key={t} color="purple">{t}</GlowBadge>
                  ))}
                </div>
              </GlassCard>

              {/* Career Trajectory */}
              <GlassCard style={{ gridColumn: 'span 12' }}>
                <div className="section-label" style={{ marginBottom: 12 }}>🚀 Career Trajectory</div>
                <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)' }}>{dna.careerTrajectory}</p>
              </GlassCard>
            </div>
          )}

          {activeTab === 'traits' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 20 }}>
              {/* Radar Chart */}
              <GlassCard style={{ gridColumn: 'span 6', minHeight: 360 }}>
                <div className="section-label" style={{ marginBottom: 16 }}>Personality Radar</div>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="var(--glass-border)" />
                    <PolarAngleAxis dataKey="trait" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                    <Radar name="DNA" dataKey="score" stroke={accentColor} fill={accentColor} fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </GlassCard>

              {/* Trait Bars */}
              <GlassCard style={{ gridColumn: 'span 6' }}>
                <div className="section-label" style={{ marginBottom: 20 }}>Trait Scores</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {dna.personalityTraits.map(trait => (
                    <div key={trait.trait}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: '0.875rem' }}>{trait.trait}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: accentColor }}>{trait.score}</span>
                      </div>
                      <ProgressBar value={trait.score} color={accentColor} height={8} />
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 20 }}>
              <GlassCard style={{ gridColumn: 'span 12' }}>
                <div className="section-label" style={{ marginBottom: 20 }}>🗺️ Recommended Projects</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                  {dna.recommendedProjects.map((p, i) => (
                    <div key={i} style={{ padding: '16px 20px', background: `${accentColor}10`, borderRadius: 12, border: `1px solid ${accentColor}25` }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: accentColor, marginBottom: 8 }}>PROJECT {String(i + 1).padStart(2, '0')}</div>
                      <div style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>{p}</div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '100px 40px' }}>
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}
            style={{ fontSize: '5rem', marginBottom: 24 }}>🧬</motion.div>
          <h3 style={{ marginBottom: 12 }}>Discover Your Developer DNA™</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 36, maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.7 }}>
            Our AI analyzes your GitHub repositories, commit patterns, technology choices, and project complexity to determine your unique developer archetype.
          </p>
          <button className="btn-primary" onClick={generate} disabled={isGenerating} style={{ fontSize: '1rem', padding: '16px 40px' }}>
            <Sparkles size={18} /> Generate My Developer DNA
          </button>
        </div>
      )}
    </div>
  )
}
