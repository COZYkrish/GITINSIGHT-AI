import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, RefreshCw, Gift, Share2, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react'
import api from '../../../services/api'
import type { WrappedReport } from '../../../types'

export function GitHubWrappedPage() {
  const [report, setReport] = useState<WrappedReport | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [slide, setSlide] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const year = new Date().getFullYear()

  useEffect(() => {
    setIsLoading(true)
    api.get(`/api/analysis/wrapped/${year}`)
      .then(r => setReport(r.data))
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [year])

  const generate = async () => {
    setIsGenerating(true)
    setError(null)
    try {
      const { data } = await api.post(`/api/analysis/wrapped/${year}`)
      setReport(data)
      setSlide(0)
    } catch (e: any) {
      console.error(e)
      setError(e?.response?.data?.error || 'Failed to generate Wrapped report.')
    }
    setIsGenerating(false)
  }

  const slides = report ? [
    { title: 'The Year in Code', value: year.toString(), sub: `${report.mostActiveMonth} was your peak month.`, emoji: '📅' },
    { title: 'Projects Forged', value: report.projectsBuilt.toString(), sub: 'New repositories established.', emoji: '🚀' },
    { title: 'Commit Volume', value: report.totalCommits.toLocaleString(), sub: 'Lines of history written.', emoji: '💾' },
    { title: 'Stars Earned', value: report.starsEarned.toLocaleString(), sub: 'Commendations from the community.', emoji: '⭐' },
    { title: 'Primary Tongue', value: report.favoriteLanguage, sub: `${report.mostUsedFramework} served as your framework.`, emoji: '💻' },
    { title: 'Longest Streak', value: `${report.longestStreak} days`, sub: 'Unbroken consistency recorded.', emoji: '🔥' },
    { title: 'Developer Persona', value: report.developerPersonality, sub: `Your ${year} archetype.`, emoji: '✨' },
  ] : []

  const currentSlide = slides[slide]

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
          <div className="uppercase-label" style={{ marginBottom: 10 }}>Year in Review</div>
          <h1 style={{
            fontFamily: 'var(--font-serif-display)',
            fontWeight: 900,
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            letterSpacing: '-0.03em',
            lineHeight: 1,
            marginBottom: 8,
          }}>
            GitHub Wrapped {year}
          </h1>
          <p style={{ fontFamily: 'var(--font-serif-body)', fontStyle: 'italic', color: 'var(--neutral-600)', fontSize: '1rem' }}>
            Your coding year — an editorial retrospective.
          </p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-end' }}>
          <button className="btn-primary" onClick={generate} disabled={isGenerating}>
            {isGenerating ? <><RefreshCw size={15} style={{ animation: 'spin-slow 1s linear infinite' }} /> Publishing...</> : <><Gift size={15} /> {report ? 'Regenerate Issue' : `Publish ${year} Edition`}</>}
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

      {report && slides.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 32 }}>
          
          {/* ── Main Slide Viewer ────────────────────── */}
          <div style={{ gridColumn: 'span 7' }}>
            <div style={{ 
              position: 'relative', 
              aspectRatio: '9/16', 
              maxHeight: 650, 
              background: 'var(--paper)',
              border: 'var(--border-thick)',
              boxShadow: 'var(--shadow-hard)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Slide Header */}
              <div style={{ 
                padding: '16px 24px', 
                borderBottom: 'var(--border-thick)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--ink)',
                color: 'var(--paper)'
              }}>
                <div style={{ fontFamily: 'var(--font-serif-display)', fontStyle: 'italic', fontSize: '1.25rem' }}>
                  Vol. {slide + 1}
                </div>
                <div className="uppercase-label" style={{ color: 'var(--paper)' }}>
                  {year} Retrospective
                </div>
              </div>

              {/* Slide Content */}
              <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={slide}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    style={{ 
                      position: 'absolute', 
                      inset: 0, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      padding: '40px',
                      background: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23111111\' fill-opacity=\'0.03\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")',
                    }}
                  >
                    <motion.div 
                      style={{ fontSize: '4rem', marginBottom: 32 }}
                      initial={{ scale: 0, rotate: -10 }} 
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      {currentSlide.emoji}
                    </motion.div>
                    
                    <div style={{ 
                      fontFamily: 'var(--font-mono)', 
                      fontSize: '0.85rem', 
                      letterSpacing: '0.15em', 
                      color: 'var(--neutral-500)', 
                      textTransform: 'uppercase',
                      marginBottom: 16, 
                      textAlign: 'center' 
                    }}>
                      — {currentSlide.title} —
                    </div>
                    
                    <h2 style={{ 
                      fontFamily: 'var(--font-serif-display)', 
                      fontWeight: 900, 
                      fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
                      textAlign: 'center', 
                      color: 'var(--ink)', 
                      lineHeight: 1.1, 
                      marginBottom: 24,
                      wordWrap: 'break-word',
                      maxWidth: '100%'
                    }}>
                      {currentSlide.value}
                    </h2>
                    
                    <p style={{ 
                      fontFamily: 'var(--font-serif-body)', 
                      fontSize: '1.25rem', 
                      color: 'var(--neutral-700)', 
                      textAlign: 'center',
                      fontStyle: 'italic',
                      maxWidth: '80%'
                    }}>
                      {currentSlide.sub}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Slide Footer / Progress */}
              <div style={{ 
                padding: '24px', 
                borderTop: 'var(--border-thin)', 
                background: 'var(--neutral-100)',
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  {slides.map((_, i) => (
                    <div 
                      key={i} 
                      onClick={() => setSlide(i)}
                      style={{ 
                        width: i === slide ? 24 : 8, 
                        height: 8, 
                        background: i === slide ? 'var(--ink)' : 'var(--border-muted)', 
                        transition: 'all 0.3s ease', 
                        cursor: 'pointer' 
                      }}
                    />
                  ))}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700 }}>
                  {slide + 1} / {slides.length}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <button 
                  onClick={() => setSlide(s => Math.max(0, s - 1))} 
                  disabled={slide === 0}
                  style={{ 
                    padding: '12px 16px', 
                    border: 'var(--border-thick)', 
                    background: slide === 0 ? 'var(--neutral-100)' : 'var(--paper)',
                    color: slide === 0 ? 'var(--neutral-400)' : 'var(--ink)',
                    cursor: slide === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => setSlide(s => Math.min(slides.length - 1, s + 1))} 
                  disabled={slide === slides.length - 1}
                  style={{ 
                    padding: '12px 16px', 
                    border: 'var(--border-thick)', 
                    background: slide === slides.length - 1 ? 'var(--neutral-100)' : 'var(--paper)',
                    color: slide === slides.length - 1 ? 'var(--neutral-400)' : 'var(--ink)',
                    cursor: slide === slides.length - 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <button 
                className="btn-primary" 
                onClick={() => navigator.clipboard.writeText(`My GitHub Wrapped ${year}: ${report.developerPersonality}`)}
              >
                <Share2 size={16} /> Share Publication
              </button>
            </div>
          </div>

          {/* ── Highlights Panel ──────────────────────── */}
          <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="uppercase-label" style={{ paddingBottom: 16, borderBottom: 'var(--border-thick)' }}>
              Annual Commendations
            </div>
            
            {/* Persona Block */}
            <div style={{ border: 'var(--border-thick)', background: 'var(--ink)', color: 'var(--paper)', padding: '32px' }}>
              <div className="uppercase-label" style={{ color: 'var(--neutral-400)', marginBottom: 16 }}>
                Identified Archetype
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif-display)', fontSize: '2rem', fontWeight: 900, marginBottom: 24 }}>
                {report.developerPersonality}
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 24 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--paper)' }}>{report.longestStreak}</div>
                  <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Streak</div>
                </div>
                <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.2)', borderRight: '1px solid rgba(255,255,255,0.2)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--paper)' }}>{report.projectsBuilt}</div>
                  <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Projects</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--paper)' }}>{report.starsEarned}</div>
                  <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Stars</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {report.highlights.map((h, i) => (
                <div key={i} style={{ border: 'var(--border-thin)', padding: '24px', background: 'var(--paper)' }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.75rem', background: 'var(--neutral-100)', padding: '12px', border: 'var(--border-thin)', borderRadius: '50%' }}>
                      {h.icon}
                    </span>
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-serif-display)', fontWeight: 700, fontSize: '1.1rem', marginBottom: 8, color: 'var(--ink)' }}>
                        {h.title}
                      </h4>
                      <p style={{ fontFamily: 'var(--font-serif-body)', fontSize: '0.95rem', color: 'var(--neutral-700)', lineHeight: 1.6 }}>
                        {h.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ border: 'var(--border-thin)', textAlign: 'center', padding: '100px 40px', background: 'var(--neutral-100)' }}>
          <div style={{ fontFamily: 'var(--font-serif-display)', fontSize: '4rem', color: 'var(--muted)', lineHeight: 1, marginBottom: 16 }}>
            🎁
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif-display)', fontWeight: 700, fontSize: '1.4rem', marginBottom: 12 }}>
            The {year} Issue Awaits
          </h3>
          <p style={{ fontFamily: 'var(--font-serif-body)', fontStyle: 'italic', color: 'var(--neutral-600)', maxWidth: 480, margin: '0 auto 32px' }}>
            Your year in code — beautifully curated and visualized. Every commit, streak, and project recorded for history.
          </p>
          <button className="btn-primary" onClick={generate} disabled={isGenerating} style={{ padding: '16px 40px', fontSize: '0.9rem', justifyContent: 'center', margin: '0 auto' }}>
            <Sparkles size={16} /> Publish My {year} Issue
          </button>
        </div>
      )}
    </div>
  )
}
