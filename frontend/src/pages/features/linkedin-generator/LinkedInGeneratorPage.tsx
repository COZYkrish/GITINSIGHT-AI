import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, RefreshCw, Copy, Check, Link2, AlertTriangle } from 'lucide-react'
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
  const [selectedRepo, setSelectedRepo] = useState<string>('general')
  const [content, setContent] = useState<{ content: string; tips: string[] } | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = async () => {
    setIsGenerating(true)
    setContent(null)
    setError(null)
    try {
      const repoId = selectedRepo === 'general' ? undefined : selectedRepo
      const { data } = await api.post('/api/analysis/linkedin', { type: selectedType, repositoryId: repoId })
      setContent({ content: data.content, tips: data.tips || [] })
    } catch (e: any) {
      console.error(e)
      setError(e?.response?.data?.error || 'Failed to generate content.')
    }
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
      {/* ── Header ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          marginBottom: 32,
          paddingBottom: 24,
          borderBottom: 'var(--border-thick)',
        }}
      >
        <div className="uppercase-label" style={{ marginBottom: 10 }}>Content AI</div>
        <h1 style={{
          fontFamily: 'var(--font-serif-display)',
          fontWeight: 900,
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          letterSpacing: '-0.03em',
          lineHeight: 1,
          marginBottom: 8,
        }}>
          Content Generator
        </h1>
        <p style={{ fontFamily: 'var(--font-serif-body)', fontStyle: 'italic', color: 'var(--neutral-600)', fontSize: '1rem' }}>
          AI-powered professional content for LinkedIn, resumes & portfolios.
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 32 }}>
        
        {/* ── Content Type Selector ─────────────────── */}
        <div style={{ gridColumn: 'span 5' }}>
          <div className="uppercase-label" style={{ marginBottom: 16 }}>Select Content Type</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {CONTENT_TYPES.map(ct => {
              const isSelected = selectedType === ct.id
              return (
                <button
                  key={ct.id}
                  onClick={() => { setSelectedType(ct.id); setContent(null); setError(null) }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '16px 20px',
                    border: 'var(--border-thin)',
                    background: isSelected ? 'var(--ink)' : 'var(--paper)',
                    color: isSelected ? 'var(--paper)' : 'var(--ink)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontSize: '1.5rem', filter: isSelected ? 'grayscale(100%) brightness(200%)' : 'none' }}>
                    {ct.icon}
                  </span>
                  <div>
                    <div style={{ 
                      fontFamily: 'var(--font-mono)', 
                      fontWeight: 700, 
                      fontSize: '0.85rem', 
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      color: isSelected ? 'var(--paper)' : 'var(--ink)',
                      marginBottom: 4
                    }}>
                      {ct.label}
                    </div>
                    <div style={{ 
                      fontFamily: 'var(--font-serif-body)', 
                      fontSize: '0.85rem', 
                      color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--neutral-600)' 
                    }}>
                      {ct.desc}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Config + Output ───────────────────────── */}
        <div style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column', gap: 32 }}>
          
          {/* Target Selector */}
          <div style={{ padding: '32px', border: 'var(--border-thin)', background: 'var(--neutral-100)' }}>
            <label className="uppercase-label" style={{ display: 'block', marginBottom: 12 }}>Target Repository (Optional)</label>
            <select
              className="np-input"
              value={selectedRepo}
              onChange={e => { setSelectedRepo(e.target.value); setContent(null); setError(null) }}
              style={{ width: '100%', marginBottom: 24, cursor: 'pointer', background: 'var(--paper)' }}
            >
              <option value="general">— General Profile (No specific repository) —</option>
              {repositories.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
            </select>

            <button
              className="btn-primary"
              onClick={generate}
              disabled={isGenerating}
              style={{ width: '100%', justifyContent: 'center', height: 48 }}
            >
              {isGenerating ? <><RefreshCw size={15} style={{ animation: 'spin-slow 1s linear infinite' }} /> Drafting...</> : <><Sparkles size={15} /> Generate Content</>}
            </button>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginTop: 16 }}>
                  <div style={{ padding: '14px 16px', border: '1px solid var(--red)', background: 'rgba(204,0,0,0.04)', color: 'var(--red)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <AlertTriangle size={15} strokeWidth={1.5} />
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Generated Content Block */}
          {content && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ border: 'var(--border-thin)' }}>
                {/* Output Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: 'var(--border-thin)', background: 'var(--ink)', color: 'var(--paper)' }}>
                  <div className="uppercase-label" style={{ color: 'var(--paper)' }}>Final Draft</div>
                  <button
                    onClick={copy}
                    style={{
                      background: copied ? 'var(--neutral-800)' : 'transparent',
                      border: '1px solid var(--neutral-600)',
                      color: 'var(--paper)',
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
                    {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy Text</>}
                  </button>
                </div>

                {/* Markdown/Text Output */}
                <div style={{ padding: '32px', background: 'var(--paper)' }}>
                  <div style={{
                    fontFamily: selectedType === 'github_bio' ? 'var(--font-mono)' : 'var(--font-serif-body)',
                    fontSize: selectedType === 'github_bio' ? '0.9rem' : '1.1rem',
                    lineHeight: 1.85,
                    color: 'var(--ink)',
                    whiteSpace: 'pre-wrap',
                  }}>
                    {content.content}
                  </div>
                </div>

                {/* AI Tips Section */}
                {content.tips && content.tips.length > 0 && (
                  <div style={{ padding: '24px 32px', background: 'var(--neutral-100)', borderTop: 'var(--border-thin)' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12, color: 'var(--neutral-600)' }}>
                      Strategic Advice
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {content.tips.map((tip, i) => (
                        <li key={i} style={{ fontFamily: 'var(--font-serif-body)', fontSize: '0.9rem', color: 'var(--neutral-700)' }}>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {!content && !isGenerating && !error && (
            <div style={{ padding: '80px 40px', border: '1px dashed var(--neutral-400)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <Link2 size={32} color="var(--neutral-400)" />
              <div style={{ fontFamily: 'var(--font-serif-body)', fontStyle: 'italic', color: 'var(--neutral-500)', fontSize: '1rem' }}>
                Select a content type and hit generate to draft professional content.
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
