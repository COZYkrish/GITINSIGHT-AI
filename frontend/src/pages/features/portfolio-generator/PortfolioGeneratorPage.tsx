import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, RefreshCw, Globe, Copy, Check } from 'lucide-react'
import { GlassCard, GlowBadge } from '../../../components/ui/GlassCard'
import api from '../../../services/api'

interface PortfolioContent {
  hero: { headline: string; subheadline: string; cta: string }
  about: { story: string; highlights: string[] }
  skills: { categories: Array<{ name: string; skills: string[] }> }
  projects: Array<{ name: string; description: string; techStack: string[]; impact: string }>
  contact: { tagline: string; availability: string }
  githubBio: string
  professionalSummary: string
}

export function PortfolioGeneratorPage() {
  const [content, setContent] = useState<PortfolioContent | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeSection, setActiveSection] = useState<'hero' | 'about' | 'skills' | 'projects' | 'assets'>('hero')
  const [copied, setCopied] = useState<string | null>(null)

  const generate = async () => {
    setIsGenerating(true)
    try {
      const { data } = await api.post('/api/analysis/portfolio-generator')
      setContent(data)
      setActiveSection('hero')
    } catch (e) { console.error(e) }
    setIsGenerating(false)
  }

  const copyText = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const CopyBtn = ({ text, id }: { text: string; id: string }) => (
    <button onClick={() => copyText(text, id)} className="btn-ghost" style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'flex', gap: 4 }}>
      {copied === id ? <><Check size={12} /> Done</> : <><Copy size={12} /> Copy</>}
    </button>
  )

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div className="section-label">AI Portfolio</div>
          <h1>Portfolio Generator</h1>
          <p style={{ color: 'var(--text-secondary)' }}>AI-generated portfolio website content tailored to your GitHub data</p>
        </div>
        <button className="btn-primary" onClick={generate} disabled={isGenerating}>
          {isGenerating ? <><RefreshCw size={16} style={{ animation: 'spin-slow 1s linear infinite' }} /> Generating...</> : <><Globe size={16} /> {content ? 'Regenerate' : 'Generate Portfolio'}</>}
        </button>
      </motion.div>

      {content ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 20 }}>
          {/* Section Nav */}
          <div style={{ gridColumn: 'span 3' }}>
            <GlassCard>
              <div className="section-label" style={{ marginBottom: 12 }}>Sections</div>
              {(['hero', 'about', 'skills', 'projects', 'assets'] as const).map(s => (
                <button key={s} onClick={() => setActiveSection(s)}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', borderRadius: 8, marginBottom: 4,
                    background: activeSection === s ? 'var(--accent-blue-dim)' : 'transparent',
                    color: activeSection === s ? 'var(--accent-blue)' : 'var(--text-secondary)',
                    border: `1px solid ${activeSection === s ? 'var(--accent-blue)' : 'transparent'}`,
                    cursor: 'pointer', fontWeight: activeSection === s ? 600 : 400, fontSize: '0.875rem', textTransform: 'capitalize', transition: 'all 0.15s ease' }}>
                  {s}
                </button>
              ))}
            </GlassCard>
          </div>

          {/* Content Panel */}
          <div style={{ gridColumn: 'span 9', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {activeSection === 'hero' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <GlassCard glow="blue">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div className="section-label">🎯 Hero Section</div>
                    <CopyBtn text={`${content.hero.headline}\n\n${content.hero.subheadline}\n\n[${content.hero.cta}]`} id="hero" />
                  </div>
                  <div style={{ padding: '32px', background: 'rgba(0,0,0,0.4)', borderRadius: 12, textAlign: 'center', marginBottom: 16 }}>
                    <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', marginBottom: 12, background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      {content.hero.headline}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>{content.hero.subheadline}</p>
                    <span style={{ padding: '10px 24px', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', borderRadius: 20, fontSize: '0.9rem', fontWeight: 600 }}>
                      {content.hero.cta}
                    </span>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {activeSection === 'about' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <GlassCard>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div className="section-label">📖 About Section</div>
                    <CopyBtn text={content.about.story} id="about" />
                  </div>
                  <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: 20 }}>{content.about.story}</p>
                  <div className="section-label" style={{ marginBottom: 10 }}>Highlights</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {content.about.highlights.map((h, i) => (
                      <div key={i} style={{ padding: '10px 14px', background: 'var(--glass-bg)', borderRadius: 8, border: '1px solid var(--glass-border)', fontSize: '0.875rem' }}>
                        ✨ {h}
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {activeSection === 'skills' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <GlassCard>
                  <div className="section-label" style={{ marginBottom: 16 }}>⚡ Skills Section</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                    {content.skills.categories.map(cat => (
                      <div key={cat.name} style={{ padding: '16px', background: 'var(--glass-bg)', borderRadius: 12, border: '1px solid var(--glass-border)' }}>
                        <div style={{ fontWeight: 700, marginBottom: 10, color: 'var(--accent-blue)' }}>{cat.name}</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {cat.skills.map(s => <GlowBadge key={s} color="blue">{s}</GlowBadge>)}
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {activeSection === 'projects' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {content.projects.map((p, i) => (
                  <GlassCard key={i} style={{ marginBottom: 16 }}>
                    <h4 style={{ marginBottom: 8 }}>{p.name}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 10 }}>{p.description}</p>
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-green)', marginBottom: 10 }}>💡 {p.impact}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {p.techStack.map(t => <GlowBadge key={t} color="purple">{t}</GlowBadge>)}
                    </div>
                  </GlassCard>
                ))}
              </motion.div>
            )}

            {activeSection === 'assets' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <GlassCard>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div className="section-label">🐙 GitHub Bio (160 chars)</div>
                    <CopyBtn text={content.githubBio} id="bio" />
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', padding: 16, background: 'rgba(0,0,0,0.4)', borderRadius: 8, color: 'var(--accent-cyan)' }}>
                    {content.githubBio}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6 }}>{content.githubBio.length}/160 chars</div>
                </GlassCard>
                <GlassCard>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div className="section-label">💼 Professional Summary</div>
                    <CopyBtn text={content.professionalSummary} id="summary" />
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>{content.professionalSummary}</p>
                </GlassCard>
                <GlassCard>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div className="section-label">📨 Contact Tagline</div>
                    <CopyBtn text={content.contact.tagline} id="contact" />
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>"{content.contact.tagline}"</p>
                  <div style={{ marginTop: 8 }}><GlowBadge color="green">{content.contact.availability}</GlowBadge></div>
                </GlassCard>
              </motion.div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '100px 40px' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>🌐</div>
          <h3 style={{ marginBottom: 12 }}>Generate Your Portfolio Content</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 36, maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.7 }}>
            AI writes your hero section, about story, skills, project descriptions, GitHub bio, and professional summary.
          </p>
          <button className="btn-primary" onClick={generate} disabled={isGenerating} style={{ fontSize: '1rem', padding: '16px 40px' }}>
            <Globe size={18} /> Generate My Portfolio
          </button>
        </div>
      )}
    </div>
  )
}
