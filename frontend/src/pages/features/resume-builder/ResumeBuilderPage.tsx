import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, RefreshCw, Download, FileText, Copy, Check } from 'lucide-react'
import { GlassCard, ScoreGauge, GlowBadge } from '../../../components/ui/GlassCard'
import api from '../../../services/api'
import { GeneratedResume } from '../../../types'

const RESUME_TYPES = [
  { id: 'ats', label: 'ATS Optimized', icon: '🤖', desc: 'Beat applicant tracking systems', color: 'var(--accent-green)' },
  { id: 'fullstack', label: 'Full Stack', icon: '🔄', desc: 'Showcase end-to-end expertise', color: 'var(--accent-blue)' },
  { id: 'frontend', label: 'Frontend', icon: '🖥️', desc: 'UI/UX & React specialist', color: 'var(--accent-cyan)' },
  { id: 'ai', label: 'AI Engineer', icon: '🤖', desc: 'ML/AI focused resume', color: 'var(--accent-purple)' },
]

export function ResumeBuilderPage() {
  const [selectedType, setSelectedType] = useState('ats')
  const [resume, setResume] = useState<GeneratedResume | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const generate = async () => {
    setIsGenerating(true)
    setResume(null)
    try {
      const { data } = await api.post('/api/analysis/resume', { type: selectedType })
      setResume(data)
    } catch (e) { console.error(e) }
    setIsGenerating(false)
  }

  const typeInfo = RESUME_TYPES.find(t => t.id === selectedType)!
  const content = resume?.content as Record<string, unknown> | undefined
  const header = content?.header as Record<string, string> | undefined
  const projects = content?.projects as Array<{ name: string; description: string; tech: string[]; bullets: string[]; live?: string }> | undefined

  const copyResume = async () => {
    if (!content) return
    const text = JSON.stringify(content, null, 2)
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 32 }}>
        <div className="section-label">AI Career Tools</div>
        <h1>Resume Builder</h1>
        <p style={{ color: 'var(--text-secondary)' }}>AI-generated, ATS-optimized resumes from your GitHub data</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 20 }}>
        {/* Type Selector */}
        <GlassCard style={{ gridColumn: 'span 4' }}>
          <div className="section-label" style={{ marginBottom: 16 }}>Resume Type</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {RESUME_TYPES.map(rt => (
              <button key={rt.id} onClick={() => setSelectedType(rt.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 12,
                  border: `1px solid ${selectedType === rt.id ? rt.color : 'var(--glass-border)'}`,
                  background: selectedType === rt.id ? `${rt.color}12` : 'var(--glass-bg)',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease' }}>
                <span style={{ fontSize: '1.5rem' }}>{rt.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: selectedType === rt.id ? rt.color : 'var(--text-primary)' }}>{rt.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rt.desc}</div>
                </div>
              </button>
            ))}
          </div>
          <button className="btn-primary" onClick={generate} disabled={isGenerating} style={{ width: '100%', justifyContent: 'center', background: `linear-gradient(135deg, ${typeInfo.color}, var(--accent-blue))` }}>
            {isGenerating ? <><RefreshCw size={16} style={{ animation: 'spin-slow 1s linear infinite' }} /> Building...</> : <><FileText size={16} /> Build {typeInfo.label} Resume</>}
          </button>
        </GlassCard>

        {/* Resume Preview */}
        <div style={{ gridColumn: 'span 8' }}>
          <AnimatePresence mode="wait">
            {resume && content ? (
              <motion.div key="resume" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {/* Score + actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <ScoreGauge score={resume.resumeScore} size={64} color={typeInfo.color} />
                    <div>
                      <div style={{ fontWeight: 700 }}>Resume Score</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{typeInfo.label}</div>
                    </div>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                    <button onClick={copyResume} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', gap: 6 }}>
                      {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy JSON</>}
                    </button>
                  </div>
                </div>

                {/* Resume Paper View */}
                <div style={{ background: '#ffffff', borderRadius: 12, padding: '32px 40px', color: '#111', fontFamily: 'var(--font-body)' }}>
                  {header && (
                    <div style={{ borderBottom: '2px solid #eee', paddingBottom: 16, marginBottom: 20 }}>
                      <h2 style={{ color: '#111', fontSize: '1.5rem', marginBottom: 4 }}>{header.name}</h2>
                      <div style={{ color: '#555', fontSize: '0.85rem' }}>{header.title}</div>
                      <div style={{ color: '#777', fontSize: '0.8rem', marginTop: 4 }}>
                        {header.email} · {header.github} · {header.location}
                      </div>
                    </div>
                  )}

                  {content.summary && (
                    <div style={{ marginBottom: 20 }}>
                      <h3 style={{ color: '#111', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, borderBottom: '1px solid #eee', paddingBottom: 4 }}>Summary</h3>
                      <p style={{ color: '#444', fontSize: '0.875rem', lineHeight: 1.6 }}>{String(content.summary)}</p>
                    </div>
                  )}

                  {content.skills && Array.isArray(content.skills) && (
                    <div style={{ marginBottom: 20 }}>
                      <h3 style={{ color: '#111', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, borderBottom: '1px solid #eee', paddingBottom: 4 }}>Skills</h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {(content.skills as string[]).map(s => (
                          <span key={s} style={{ padding: '3px 10px', background: '#f0f0f0', borderRadius: 4, fontSize: '0.8rem', color: '#333' }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {projects && (
                    <div style={{ marginBottom: 20 }}>
                      <h3 style={{ color: '#111', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12, borderBottom: '1px solid #eee', paddingBottom: 4 }}>Projects</h3>
                      {projects.map((p, i) => (
                        <div key={i} style={{ marginBottom: 16 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontWeight: 700, color: '#111', fontSize: '0.9rem' }}>{p.name}</span>
                            {p.live && <a href={p.live} style={{ color: '#3b82f6', fontSize: '0.8rem' }}>Live →</a>}
                          </div>
                          <p style={{ color: '#555', fontSize: '0.8rem', marginBottom: 6, lineHeight: 1.5 }}>{p.description}</p>
                          {p.bullets?.map((b, j) => (
                            <div key={j} style={{ fontSize: '0.8rem', color: '#444', paddingLeft: 14, marginBottom: 2 }}>• {b}</div>
                          ))}
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 6 }}>
                            {p.tech?.map(t => <span key={t} style={{ fontSize: '0.7rem', padding: '2px 8px', background: '#e8f0fe', borderRadius: 3, color: '#1a56db' }}>{t}</span>)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recruiter tips */}
                {resume.recruiterOptimization?.length > 0 && (
                  <GlassCard style={{ marginTop: 16 }}>
                    <div className="section-label" style={{ marginBottom: 12 }}>💡 Recruiter Optimization Tips</div>
                    {resume.recruiterOptimization.map((tip, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, padding: '8px 0', borderBottom: i < resume.recruiterOptimization.length - 1 ? '1px solid var(--glass-border)' : 'none', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--accent-blue)', flexShrink: 0 }}>{i + 1}.</span> {tip}
                      </div>
                    ))}
                  </GlassCard>
                )}
              </motion.div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400, color: 'var(--text-muted)', flexDirection: 'column', gap: 16, border: '2px dashed var(--glass-border)', borderRadius: 'var(--radius-xl)' }}>
                <FileText size={48} style={{ opacity: 0.2 }} />
                <span style={{ fontSize: '0.9rem' }}>
                  {isGenerating ? 'Building your resume...' : 'Select a type and click Build Resume'}
                </span>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
