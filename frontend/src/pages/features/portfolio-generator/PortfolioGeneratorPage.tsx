import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, RefreshCw, Globe, Copy, Check, AlertTriangle } from 'lucide-react'
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
  const [error, setError] = useState<string | null>(null)

  const generate = async () => {
    setIsGenerating(true)
    setError(null)
    try {
      const { data } = await api.post('/api/analysis/portfolio-generator')
      setContent(data)
      setActiveSection('hero')
    } catch (e: any) {
      console.error(e)
      setError(e?.response?.data?.error || 'Portfolio generation failed.')
    }
    setIsGenerating(false)
  }

  const copyText = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const CopyBtn = ({ text, id }: { text: string; id: string }) => (
    <button
      onClick={() => copyText(text, id)}
      style={{
        background: copied === id ? 'var(--ink)' : 'transparent',
        color: copied === id ? 'var(--paper)' : 'var(--ink)',
        border: '1px solid var(--ink)',
        padding: '6px 12px',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.7rem',
        textTransform: 'uppercase',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        transition: 'all 0.2s',
      }}
    >
      {copied === id ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy Code</>}
    </button>
  )

  const SECTIONS = ['hero', 'about', 'skills', 'projects', 'assets'] as const

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
          gap: 16
        }}
      >
        <div>
          <div className="uppercase-label" style={{ marginBottom: 10 }}>AI Portfolio</div>
          <h1 style={{
            fontFamily: 'var(--font-serif-display)',
            fontWeight: 900,
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            letterSpacing: '-0.03em',
            lineHeight: 1,
            marginBottom: 8,
          }}>
            Portfolio Generator
          </h1>
          <p style={{ fontFamily: 'var(--font-serif-body)', fontStyle: 'italic', color: 'var(--neutral-600)', fontSize: '1rem' }}>
            AI-generated portfolio website content tailored to your GitHub data.
          </p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-end' }}>
          <button className="btn-primary" onClick={generate} disabled={isGenerating}>
            {isGenerating ? <><RefreshCw size={15} style={{ animation: 'spin-slow 1s linear infinite' }} /> Drafting Content...</> : <><Globe size={15} /> {content ? 'Regenerate Content' : 'Generate Portfolio'}</>}
          </button>
        </div>
      </motion.div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ padding: '14px 16px', border: '1px solid var(--red)', background: 'rgba(204,0,0,0.04)', color: 'var(--red)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertTriangle size={15} strokeWidth={1.5} />
              {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {content ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 32 }}>
          
          {/* ── Section Nav ──────────────────────────── */}
          <div style={{ gridColumn: 'span 3' }}>
            <div style={{ border: 'var(--border-thin)', background: 'var(--paper)' }}>
              <div className="uppercase-label" style={{ padding: '16px 20px', borderBottom: 'var(--border-thin)', background: 'var(--neutral-100)' }}>
                Document Sections
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {SECTIONS.map((s, idx) => {
                  const isSelected = activeSection === s
                  return (
                    <button
                      key={s}
                      onClick={() => setActiveSection(s)}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '16px 20px',
                        borderBottom: idx === SECTIONS.length - 1 ? 'none' : 'var(--border-muted)',
                        background: isSelected ? 'var(--ink)' : 'transparent',
                        color: isSelected ? 'var(--paper)' : 'var(--ink)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ 
                        fontFamily: 'var(--font-mono)', 
                        fontWeight: 700, 
                        fontSize: '0.85rem', 
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase'
                      }}>
                        {s}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── Content Panel ────────────────────────── */}
          <div style={{ gridColumn: 'span 9', display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {activeSection === 'hero' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ border: 'var(--border-thin)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: 'var(--border-thin)', background: 'var(--ink)' }}>
                    <div className="uppercase-label" style={{ color: 'var(--paper)' }}>Hero Section Copy</div>
                    <CopyBtn text={`${content.hero.headline}\n\n${content.hero.subheadline}\n\n[${content.hero.cta}]`} id="hero" />
                  </div>
                  
                  <div style={{ padding: '48px', background: 'var(--paper)', textAlign: 'center' }}>
                    <h2 style={{ 
                      fontFamily: 'var(--font-serif-display)', 
                      fontWeight: 900, 
                      fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
                      lineHeight: 1.1,
                      letterSpacing: '-0.02em',
                      color: 'var(--ink)',
                      marginBottom: 24
                    }}>
                      {content.hero.headline}
                    </h2>
                    <p style={{ 
                      fontFamily: 'var(--font-serif-body)', 
                      fontSize: '1.25rem', 
                      lineHeight: 1.6, 
                      color: 'var(--neutral-600)',
                      maxWidth: '600px',
                      margin: '0 auto 32px'
                    }}>
                      {content.hero.subheadline}
                    </p>
                    <button style={{ 
                      background: 'var(--ink)', 
                      color: 'var(--paper)', 
                      padding: '16px 32px', 
                      fontFamily: 'var(--font-mono)', 
                      fontSize: '0.85rem', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.1em',
                      border: 'none',
                      fontWeight: 700
                    }}>
                      {content.hero.cta}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'about' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ border: 'var(--border-thin)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: 'var(--border-thin)', background: 'var(--neutral-100)' }}>
                    <div className="uppercase-label">About Story</div>
                    <CopyBtn text={content.about.story} id="about" />
                  </div>
                  <div style={{ padding: '32px', background: 'var(--paper)' }}>
                    <p style={{ 
                      fontFamily: 'var(--font-serif-body)', 
                      fontSize: '1.1rem', 
                      lineHeight: 1.85, 
                      color: 'var(--neutral-800)',
                      marginBottom: 32
                    }}>
                      {content.about.story}
                    </p>
                    
                    <div className="uppercase-label" style={{ marginBottom: 16 }}>Key Highlights</div>
                    <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {content.about.highlights.map((h, i) => (
                        <li key={i} style={{ 
                          fontFamily: 'var(--font-serif-body)', 
                          fontSize: '1rem', 
                          color: 'var(--neutral-700)' 
                        }}>
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'skills' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ border: 'var(--border-thin)' }}>
                  <div style={{ padding: '16px 24px', borderBottom: 'var(--border-thin)', background: 'var(--neutral-100)' }}>
                    <div className="uppercase-label">Skills Categorization</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 0 }}>
                    {content.skills.categories.map((cat, idx) => (
                      <div key={cat.name} style={{ 
                        padding: '32px', 
                        background: 'var(--paper)',
                        borderRight: 'var(--border-thin)',
                        borderBottom: 'var(--border-thin)',
                      }}>
                        <div style={{ 
                          fontFamily: 'var(--font-serif-display)', 
                          fontWeight: 700, 
                          fontSize: '1.25rem', 
                          color: 'var(--ink)', 
                          marginBottom: 16 
                        }}>
                          {cat.name}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {cat.skills.map(s => (
                            <div key={s} style={{ 
                              border: '1px solid var(--border-muted)', 
                              background: 'var(--neutral-100)', 
                              padding: '6px 12px', 
                              fontSize: '0.75rem', 
                              fontFamily: 'var(--font-mono)', 
                              color: 'var(--ink)' 
                            }}>
                              {s}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'projects' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {content.projects.map((p, i) => (
                  <div key={i} style={{ border: 'var(--border-thick)', background: 'var(--paper)', padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                      <h4 style={{ 
                        fontFamily: 'var(--font-serif-display)', 
                        fontWeight: 900, 
                        fontSize: '1.75rem', 
                        color: 'var(--ink)',
                        margin: 0
                      }}>
                        {p.name}
                      </h4>
                    </div>
                    
                    <p style={{ 
                      fontFamily: 'var(--font-serif-body)', 
                      fontSize: '1.05rem', 
                      lineHeight: 1.7, 
                      color: 'var(--neutral-700)', 
                      marginBottom: 20 
                    }}>
                      {p.description}
                    </p>
                    
                    <div style={{ 
                      padding: '16px 20px', 
                      background: 'var(--neutral-100)', 
                      borderLeft: '4px solid var(--ink)', 
                      marginBottom: 24 
                    }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6, color: 'var(--neutral-500)' }}>
                        Business Impact
                      </div>
                      <div style={{ fontFamily: 'var(--font-serif-body)', fontSize: '0.95rem', color: 'var(--ink)', fontStyle: 'italic' }}>
                        "{p.impact}"
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {p.techStack.map(t => (
                        <div key={t} style={{ 
                          border: '1px solid var(--border-muted)', 
                          padding: '4px 10px', 
                          fontSize: '0.7rem', 
                          fontFamily: 'var(--font-mono)', 
                          color: 'var(--neutral-600)',
                          textTransform: 'uppercase'
                        }}>
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeSection === 'assets' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Bio */}
                <div style={{ border: 'var(--border-thin)', background: 'var(--paper)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: 'var(--border-thin)', background: 'var(--neutral-100)' }}>
                    <div className="uppercase-label">GitHub Bio (160 chars)</div>
                    <CopyBtn text={content.githubBio} id="bio" />
                  </div>
                  <div style={{ padding: '32px' }}>
                    <div style={{ 
                      fontFamily: 'var(--font-mono)', 
                      fontSize: '1rem', 
                      padding: '24px', 
                      background: 'var(--ink)', 
                      color: 'var(--paper)',
                      border: '1px solid var(--ink)'
                    }}>
                      {content.githubBio}
                    </div>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--neutral-500)', marginTop: 12, textAlign: 'right' }}>
                      {content.githubBio.length} / 160 CHARS
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div style={{ border: 'var(--border-thin)', background: 'var(--paper)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: 'var(--border-thin)', background: 'var(--neutral-100)' }}>
                    <div className="uppercase-label">Professional Summary</div>
                    <CopyBtn text={content.professionalSummary} id="summary" />
                  </div>
                  <div style={{ padding: '32px' }}>
                    <p style={{ 
                      fontFamily: 'var(--font-serif-body)', 
                      fontSize: '1.05rem', 
                      color: 'var(--neutral-800)', 
                      lineHeight: 1.8 
                    }}>
                      {content.professionalSummary}
                    </p>
                  </div>
                </div>

                {/* Tagline */}
                <div style={{ border: 'var(--border-thin)', background: 'var(--paper)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: 'var(--border-thin)', background: 'var(--neutral-100)' }}>
                    <div className="uppercase-label">Contact Tagline & Availability</div>
                    <CopyBtn text={content.contact.tagline} id="contact" />
                  </div>
                  <div style={{ padding: '32px' }}>
                    <p style={{ 
                      fontFamily: 'var(--font-serif-display)', 
                      fontSize: '1.5rem',
                      fontStyle: 'italic',
                      color: 'var(--ink)',
                      marginBottom: 16
                    }}>
                      "{content.contact.tagline}"
                    </p>
                    <div style={{ 
                      display: 'inline-block',
                      border: '1px solid var(--ink)', 
                      padding: '6px 16px', 
                      fontSize: '0.75rem', 
                      fontFamily: 'var(--font-mono)', 
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em'
                    }}>
                      {content.contact.availability}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ border: 'var(--border-thin)', textAlign: 'center', padding: '100px 40px', background: 'var(--neutral-100)' }}>
          <div style={{ fontFamily: 'var(--font-serif-display)', fontSize: '4rem', color: 'var(--muted)', lineHeight: 1, marginBottom: 16 }}>
            🌐
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif-display)', fontWeight: 700, fontSize: '1.4rem', marginBottom: 12 }}>
            Generate Your Portfolio Content
          </h3>
          <p style={{ fontFamily: 'var(--font-serif-body)', fontStyle: 'italic', color: 'var(--neutral-600)', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.7 }}>
            AI writes your hero section, about story, skills, project descriptions, GitHub bio, and professional summary based on your GitHub data.
          </p>
          <button className="btn-primary" onClick={generate} disabled={isGenerating} style={{ padding: '16px 40px', fontSize: '0.9rem', justifyContent: 'center', margin: '0 auto' }}>
            <Sparkles size={16} /> Generate My Portfolio
          </button>
        </div>
      )}
    </div>
  )
}
