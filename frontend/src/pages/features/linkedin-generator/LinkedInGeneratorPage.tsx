import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, RefreshCw, Copy, Check, Link2 } from 'lucide-react'
import { GlassCard } from '../../../components/ui/GlassCard'
import api from '../../../services/api'
import { useGitHubStore } from '../../../store/githubStore'

const CONTENT_TYPES = [
  { id: 'linkedin_post', label: 'LinkedIn Post', icon: '📢', desc: 'Engaging post about your projects' },
  { id: 'resume_bullet', label: 'Resume Bullets', icon: '📝', desc: 'ATS-optimized bullet points' },
  { id: 'portfolio_description', label: 'Portfolio Bio', icon: '🌐', desc: 'Professional portfolio bio' },
  { id: 'project_summary', label: 'Project Summary', icon: '🔖', desc: 'Project description for portfolio' },
  { id: 'github_bio', label: 'GitHub Bio', icon: '🐙', desc: '160-char GitHub bio' },
  { id: 'professional_summary', label: 'Professional Summary', icon: '💼', desc: 'Resume professional summary' },
]

export function LinkedInGeneratorPage() {
  const { repositories } = useGitHubStore()
  const [selectedType, setSelectedType] = useState('linkedin_post')
  const [selectedRepo, setSelectedRepo] = useState<string | undefined>()
  const [content, setContent] = useState<{ content: string; tips: string[] } | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const generate = async () => {
    setIsGenerating(true)
    setContent(null)
    try {
      const { data } = await api.post('/api/analysis/linkedin', { type: selectedType, repositoryId: selectedRepo })
      setContent({ content: data.content, tips: data.tips || [] })
    } catch (e) { console.error(e) }
    setIsGenerating(false)
  }

  const copy = async () => {
    if (!content) return
    await navigator.clipboard.writeText(content.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 32 }}>
        <div className="section-label">Content AI</div>
        <h1>LinkedIn Generator</h1>
        <p style={{ color: 'var(--text-secondary)' }}>AI-powered professional content for LinkedIn, resumes & portfolios</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 20 }}>
        {/* Content Type Selector */}
        <GlassCard style={{ gridColumn: 'span 5' }}>
          <div className="section-label" style={{ marginBottom: 16 }}>Content Type</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {CONTENT_TYPES.map(ct => (
              <button key={ct.id} onClick={() => setSelectedType(ct.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 10, border: `1px solid ${selectedType === ct.id ? 'var(--accent-blue)' : 'var(--glass-border)'}`,
                  background: selectedType === ct.id ? 'var(--accent-blue-dim)' : 'var(--glass-bg)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease' }}>
                <span style={{ fontSize: '1.25rem' }}>{ct.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: selectedType === ct.id ? 'var(--accent-blue)' : 'var(--text-primary)' }}>{ct.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ct.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Config + Output */}
        <div style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Repo selector (optional) */}
          <GlassCard>
            <div className="section-label" style={{ marginBottom: 12 }}>Repository (optional)</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              <button onClick={() => setSelectedRepo(undefined)}
                style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${!selectedRepo ? 'var(--accent-blue)' : 'var(--glass-border)'}`,
                  background: !selectedRepo ? 'var(--accent-blue-dim)' : 'var(--glass-bg)',
                  color: !selectedRepo ? 'var(--accent-blue)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>
                General Profile
              </button>
              {repositories.slice(0, 8).map(r => (
                <button key={r._id} onClick={() => setSelectedRepo(r._id)}
                  style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${selectedRepo === r._id ? 'var(--accent-blue)' : 'var(--glass-border)'}`,
                    background: selectedRepo === r._id ? 'var(--accent-blue-dim)' : 'var(--glass-bg)',
                    color: selectedRepo === r._id ? 'var(--accent-blue)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>
                  {r.name}
                </button>
              ))}
            </div>
            <button className="btn-primary" onClick={generate} disabled={isGenerating} style={{ width: '100%', justifyContent: 'center' }}>
              {isGenerating ? <><RefreshCw size={16} style={{ animation: 'spin-slow 1s linear infinite' }} /> Generating...</> : <><Sparkles size={16} /> Generate Content</>}
            </button>
          </GlassCard>

          {/* Generated Content */}
          {content && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <GlassCard glow="blue">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div className="section-label">Generated Content</div>
                  <button onClick={copy} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', gap: 6, alignItems: 'center' }}>
                    {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
                  </button>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 12, padding: '20px', fontFamily: selectedType === 'github_bio' ? 'var(--font-mono)' : 'var(--font-body)', lineHeight: 1.8, color: 'var(--text-secondary)', fontSize: '0.9rem', whiteSpace: 'pre-wrap', marginBottom: 16, maxHeight: 300, overflowY: 'auto' }}>
                  {content.content}
                </div>
                {content.tips.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>💡 Tips:</div>
                    {content.tips.map((tip, i) => (
                      <div key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', padding: '4px 0' }}>
                        · {tip}
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </motion.div>
          )}

          {!content && !isGenerating && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: 'var(--text-muted)', fontSize: '0.875rem', flexDirection: 'column', gap: 12 }}>
              <Link2 size={32} style={{ opacity: 0.3 }} />
              Select a content type and generate
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
