import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, RefreshCw, Gift, Share2, ChevronLeft, ChevronRight } from 'lucide-react'
import { GlassCard } from '../../../components/ui/GlassCard'
import api from '../../../services/api'
import type { WrappedReport } from '../../../types'

const SLIDE_THEMES = [
  { bg: 'linear-gradient(135deg, #1a0a3a, #0a1628)', accent: '#8b5cf6' },
  { bg: 'linear-gradient(135deg, #0a2440, #0a3028)', accent: '#06b6d4' },
  { bg: 'linear-gradient(135deg, #1a1028, #280a1a)', accent: '#ec4899' },
  { bg: 'linear-gradient(135deg, #0a2818, #1a2808)', accent: '#10b981' },
  { bg: 'linear-gradient(135deg, #281a08, #200a0a)', accent: '#f59e0b' },
]

export function GitHubWrappedPage() {
  const [report, setReport] = useState<WrappedReport | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [slide, setSlide] = useState(0)
  const year = new Date().getFullYear()

  useEffect(() => {
    setIsLoading(true)
    api.get(`/api/analysis/wrapped/${year}`).then(r => setReport(r.data)).catch(() => {}).finally(() => setIsLoading(false))
  }, [year])

  const generate = async () => {
    setIsGenerating(true)
    try {
      const { data } = await api.post(`/api/analysis/wrapped/${year}`)
      setReport(data)
      setSlide(0)
    } catch (e) { console.error(e) }
    setIsGenerating(false)
  }

  const slides = report ? [
    { title: 'Your Year in Code', value: year.toString(), sub: `${report.mostActiveMonth} was your peak month`, emoji: '📅', theme: SLIDE_THEMES[0] },
    { title: 'Projects Built', value: report.projectsBuilt.toString(), sub: 'new repositories created', emoji: '🚀', theme: SLIDE_THEMES[1] },
    { title: 'Commits Made', value: report.totalCommits.toLocaleString(), sub: 'lines of story written', emoji: '💾', theme: SLIDE_THEMES[2] },
    { title: 'Stars Earned', value: report.starsEarned.toLocaleString(), sub: 'developers appreciated your work', emoji: '⭐', theme: SLIDE_THEMES[3] },
    { title: 'Favorite Language', value: report.favoriteLanguage, sub: `with ${report.mostUsedFramework} as your framework`, emoji: '💻', theme: SLIDE_THEMES[4] },
    { title: 'Longest Streak', value: `${report.longestStreak} days`, sub: 'of unbroken consistency', emoji: '🔥', theme: SLIDE_THEMES[0] },
    { title: 'Your Persona', value: report.developerPersonality, sub: `GitHub Wrapped ${year}`, emoji: '✨', theme: SLIDE_THEMES[1] },
  ] : []

  const currentSlide = slides[slide]

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div className="section-label">Year in Review</div>
          <h1>GitHub Wrapped {year}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Your coding year — Spotify Wrapped for developers</p>
        </div>
        <button className="btn-primary" onClick={generate} disabled={isGenerating}>
          {isGenerating ? <><RefreshCw size={16} style={{ animation: 'spin-slow 1s linear infinite' }} /> Generating...</> : <><Gift size={16} /> {report ? 'Regenerate' : `Generate ${year} Wrapped`}</>}
        </button>
      </motion.div>

      {report && slides.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 24 }}>
          {/* Main Slide Viewer */}
          <div style={{ gridColumn: 'span 7' }}>
            <div style={{ position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden', aspectRatio: '9/16', maxHeight: 600, boxShadow: 'var(--shadow-elevated)' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  style={{ position: 'absolute', inset: 0, background: currentSlide.theme.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
                  {/* Decorative circles */}
                  <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: `${currentSlide.theme.accent}15`, pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', bottom: -60, left: -60, width: 200, height: 200, borderRadius: '50%', background: `${currentSlide.theme.accent}10`, pointerEvents: 'none' }} />

                  <motion.div style={{ fontSize: '5rem', marginBottom: 24 }}
                    initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}>
                    {currentSlide.emoji}
                  </motion.div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.15em', color: currentSlide.theme.accent, marginBottom: 16, textAlign: 'center' }}>
                    {currentSlide.title.toUpperCase()}
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem, 6vw, 4rem)', textAlign: 'center', color: 'white', lineHeight: 1.1, marginBottom: 16 }}>
                    {currentSlide.value}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                    style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>
                    {currentSlide.sub}
                  </motion.div>

                  {/* Slide counter */}
                  <div style={{ position: 'absolute', bottom: 20, display: 'flex', gap: 6 }}>
                    {slides.map((_, i) => (
                      <div key={i} style={{ width: i === slide ? 20 : 6, height: 6, borderRadius: 3,
                        background: i === slide ? currentSlide.theme.accent : 'rgba(255,255,255,0.2)', transition: 'all 0.3s ease', cursor: 'pointer' }}
                        onClick={() => setSlide(i)} />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16 }}>
              <button onClick={() => setSlide(s => Math.max(0, s - 1))} className="btn-secondary" style={{ padding: '10px 16px' }} disabled={slide === 0}>
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => setSlide(s => Math.min(slides.length - 1, s + 1))} className="btn-secondary" style={{ padding: '10px 16px' }} disabled={slide === slides.length - 1}>
                <ChevronRight size={18} />
              </button>
              <button className="btn-secondary" style={{ padding: '10px 20px' }} onClick={() => navigator.clipboard.writeText(`My GitHub Wrapped ${year}: ${report.developerPersonality}`)}>
                <Share2 size={16} /> Share
              </button>
            </div>
          </div>

          {/* Highlights Panel */}
          <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="section-label">🎯 Highlights</div>
            {report.highlights.map((h, i) => (
              <GlassCard key={i}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.75rem' }}>{h.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 6, fontSize: '0.9rem' }}>{h.title}</div>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{h.description}</p>
                  </div>
                </div>
              </GlassCard>
            ))}

            {/* Personality card */}
            <GlassCard glow="purple">
              <div className="section-label" style={{ marginBottom: 8 }}>Your Developer Persona</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent-purple)', marginBottom: 8 }}>
                ✨ {report.developerPersonality}
              </div>
              <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-blue)' }}>{report.longestStreak}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Day streak</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{report.projectsBuilt}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Projects</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-amber)' }}>{report.starsEarned}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Stars</div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '100px 40px' }}>
          <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}
            style={{ fontSize: '5rem', marginBottom: 24 }}>🎁</motion.div>
          <h3 style={{ marginBottom: 12 }}>Your {year} Wrapped Awaits</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
            Your year in code — beautifully visualized. Every commit, streak, and project celebrated.
          </p>
          <button className="btn-primary" onClick={generate} disabled={isGenerating} style={{ fontSize: '1rem', padding: '16px 40px' }}>
            <Gift size={18} /> Unwrap My {year}
          </button>
        </div>
      )}
    </div>
  )
}
