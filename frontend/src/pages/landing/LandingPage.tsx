import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, GitBranch } from 'lucide-react'
import { HeroSection } from '../../components/layout/HeroSection'

gsap.registerPlugin(ScrollTrigger)

/* ── Data ─────────────────────────────────────────── */
const TICKER_ITEMS = [
  'BREAKING: 10,000+ Developers Analyzed',
  '50,000+ Repositories Scored',
  'AI Recruiter Accuracy: 98%',
  'Full Analysis in Under 60 Seconds',
  'Developer DNA™ — Know Your Archetype',
  'ATS-Optimized Resumes in Minutes',
  'Career Readiness Score — Know Where You Stand',
  'GitHub Wrapped: Your Year in Code',
]

const STATS = [
  { value: '10K+', label: 'Developers Analyzed', note: 'and growing daily' },
  { value: '50K+', label: 'Repositories Scored', note: 'across all languages' },
  { value: '98%',  label: 'AI Accuracy Rate',   note: 'recruiter simulation' },
  { value: '< 60s',label: 'Full Analysis',      note: 'from connect to insight' },
]

const FEATURES = [
  {
    number: '01',
    title: 'Developer DNA™',
    deck: 'Six developer archetypes. Infinite self-knowledge.',
    body: 'Our proprietary AI analyzes your commit patterns, project diversity, language distribution, and architectural choices to identify your unique developer archetype — from AI Builder to Open Source Crusader. This is not a quiz. This is deep code archaeology.',
    stat: '6 archetypes',
    statLabel: 'mapped from 200+ signals',
  },
  {
    number: '02',
    title: 'AI Recruiter Simulation',
    deck: 'Know your odds before you apply.',
    body: 'We simulate the exact decision-making process of top technical recruiters at FAANG and high-growth startups. You\'ll see your profile the way they see it — including the silent disqualifiers most developers never know about.',
    stat: '98%',
    statLabel: 'accuracy vs. real decisions',
  },
  {
    number: '03',
    title: 'Portfolio Score',
    deck: 'A single number. Backed by fifty signals.',
    body: 'Documentation quality, project originality, technical complexity, contribution consistency, and ten more dimensions — all distilled into a single portfolio score that you can actually improve. Drill down to see exactly where to focus.',
    stat: '50+',
    statLabel: 'signals analyzed',
  },
  {
    number: '04',
    title: 'Career Readiness Report',
    deck: 'Role-specific readiness. No guesswork.',
    body: 'Tell us your target role — Senior Fullstack, ML Engineer, Staff Frontend — and we\'ll produce a detailed readiness report with gap analysis, skill prioritization, and a 90-day roadmap to close the distance.',
    stat: '25+',
    statLabel: 'target roles supported',
  },
  {
    number: '05',
    title: 'Resume Builder',
    deck: 'ATS-optimized. GitHub-powered.',
    body: 'Stop writing resumes from scratch. GitInsight AI reads your repositories, contributions, and impact metrics and produces a recruiter-ready, ATS-optimized resume in seconds. Tailored per job description.',
    stat: '3×',
    statLabel: 'more interview callbacks',
  },
  {
    number: '06',
    title: 'GitHub Wrapped',
    deck: 'Spotify Wrapped. For your code.',
    body: 'A cinematic, shareable retrospective of your year in code. Languages, commits, collaborations, late-night pushes, and breakthrough moments — presented as a visual story you\'ll actually want to share.',
    stat: '12',
    statLabel: 'months of your story',
  },
]

/* ── Reveal Animation Hook ────────────────────────── */
function RevealBlock({ children, delay = 0, className, style }: { children: React.ReactNode, delay?: number, className?: string, style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}

/* ── Marquee Ticker ───────────────────────────────── */
function MarqueeTicker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS] // duplicate for seamless loop
  return (
    <div className="ticker-wrap">
      <div className="ticker-track">
        {items.map((item, i) => (
          <span key={i} className="ticker-item">
            {item}
            <span className="ticker-sep">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── Main Component ───────────────────────────────── */
export function LandingPage() {
  // Current date for edition metadata
  const editionDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── MASTHEAD HEADER ────────────────────────────── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'var(--paper)',
        borderBottom: 'var(--border-thick)',
      }}>
        {/* Edition metadata strip */}
        <div style={{
          borderBottom: 'var(--border-thin)',
          padding: '4px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span className="edition-meta">Vol. 1, No. 1</span>
          <span className="edition-meta" style={{ letterSpacing: '0.08em' }}>
            {editionDate}
          </span>
          <span className="edition-meta">Developer Intelligence Edition</span>
        </div>

        {/* Main header row */}
        <div style={{
          padding: '10px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Logo / Wordmark */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{
              fontFamily: 'var(--font-serif-display)',
              fontWeight: 900,
              fontSize: '1.6rem',
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: 'var(--ink)',
            }}>
              GitInsight AI
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--neutral-500)',
              paddingBottom: 2,
            }}>
              est. 2026
            </span>
          </div>

          {/* Nav */}
          <nav style={{ display: 'flex', gap: 0, alignItems: 'center' }}>
            {[
              { href: '#features', label: 'Features' },
              { href: '#manifesto', label: 'Why It Matters' },
              { href: '#stats', label: 'By the Numbers' },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 600,
                  fontSize: '0.72rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--neutral-600)',
                  textDecoration: 'none',
                  padding: '6px 16px',
                  borderRight: 'var(--border-thin)',
                  transition: 'color 0.1s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--neutral-600)')}
              >
                {label}
              </a>
            ))}
            <Link
              to="/login"
              style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                fontSize: '0.72rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--neutral-600)',
                padding: '6px 16px',
                borderRight: 'var(--border-thin)',
              }}
            >
              Sign In
            </Link>
            <Link to="/register" className="btn-primary" style={{ fontSize: '0.7rem', padding: '10px 20px', marginLeft: 12 }}>
              Get Started <ArrowRight size={13} />
            </Link>
          </nav>
        </div>
      </header>

      {/* ── HERO SECTION — Immersive video background ── */}
      <HeroSection />

      {/* ── MARQUEE TICKER ─────────────────────────────── */}
      <MarqueeTicker />

      {/* ── THE MANIFESTO ──────────────────────────────── */}
      <section id="manifesto" style={{
        padding: '100px 40px',
        borderBottom: 'var(--border-thick)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Section header */}
          <RevealBlock>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 60 }}>
              <span className="uppercase-label">The Problem</span>
              <div style={{ flex: 1, height: 1, background: 'var(--ink)' }} />
              <span className="uppercase-label">Column A</span>
            </div>
          </RevealBlock>

          {/* Two-column manifesto */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60 }}>
            <RevealBlock delay={0.1}>
              <div>
                <h2 style={{
                  fontFamily: 'var(--font-serif-display)',
                  fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                  fontWeight: 900,
                  lineHeight: 1.1,
                  marginBottom: 32,
                }}>
                  Your story deserves<br />
                  <span style={{ fontStyle: 'italic' }}>to be told.</span>
                </h2>
                <p
                  className="drop-cap"
                  style={{
                    fontFamily: 'var(--font-serif-body)',
                    fontSize: '1.05rem',
                    lineHeight: 1.8,
                    textAlign: 'justify',
                    color: 'var(--neutral-700)',
                  }}
                >
                  You spent thousands of hours building. Nights. Weekends. Coffee. Code. 
                  Repeat. Every commit tells a story of problem-solving and craft. But when 
                  it matters most — during a job search — all that work gets reduced to a 
                  list of repository names and star counts.
                </p>
              </div>
            </RevealBlock>

            <RevealBlock delay={0.2}>
              <div style={{ borderLeft: 'var(--border-thick)', paddingLeft: 40 }}>
                <p style={{
                  fontFamily: 'var(--font-serif-body)',
                  fontSize: '1.05rem',
                  lineHeight: 1.8,
                  textAlign: 'justify',
                  color: 'var(--neutral-700)',
                  marginBottom: 32,
                }}>
                  Recruiters at top companies spend an average of <strong>6 seconds</strong> 
                  reviewing a GitHub profile. Without a system that translates your technical 
                  depth into recruiter-friendly signals, your best work remains invisible.
                </p>

                {/* Pull quote */}
                <div style={{
                  fontFamily: 'var(--font-serif-display)',
                  fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
                  fontStyle: 'italic',
                  fontWeight: 700,
                  lineHeight: 1.3,
                  color: 'var(--ink)',
                  borderBottom: 'var(--border-heavy)',
                  paddingBottom: 24,
                  marginBottom: 24,
                }}>
                  "Most developers don't know their own story. Your work tells a powerful 
                  narrative. You just can't see it yet."
                </div>

                <p style={{
                  fontFamily: 'var(--font-serif-body)',
                  fontSize: '1.05rem',
                  lineHeight: 1.8,
                  color: 'var(--neutral-700)',
                }}>
                  GitInsight AI changes this. We built the intelligence layer between your 
                  GitHub profile and the opportunities you deserve.
                </p>
              </div>
            </RevealBlock>
          </div>

          {/* Ornament divider */}
          <div className="ornament" style={{ marginTop: 60 }}>✧ &nbsp; ✧ &nbsp; ✧</div>

          {/* Three scenes */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderTop: 'var(--border-thin)', borderLeft: 'var(--border-thin)' }}>
            {[
              { label: '01', headline: 'You spent thousands of hours building.', sub: 'Nights. Weekends. Coffee. Code. Repeat.' },
              { label: '02', headline: 'Recruiters only see repositories.', sub: 'No context. No story. Just file counts and star ratings.' },
              { label: '03', headline: 'GitInsight reveals the complete picture.', sub: 'Turn your GitHub into career-defining intelligence.' },
            ].map((scene, i) => (
              <RevealBlock key={i} delay={i * 0.15} style={{ height: '100%' }}>
                <div style={{
                  padding: '40px 32px',
                  borderRight: 'var(--border-thin)',
                  borderBottom: 'var(--border-thin)',
                  height: '100%',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    color: 'var(--muted)',
                    lineHeight: 1,
                    marginBottom: 20,
                    borderBottom: 'var(--border-thin)',
                    paddingBottom: 16,
                  }}>
                    {scene.label}
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-serif-display)',
                    fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                    fontWeight: 700,
                    lineHeight: 1.2,
                    marginBottom: 12,
                  }}>
                    {scene.headline}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--neutral-600)', lineHeight: 1.7 }}>
                    {scene.sub}
                  </p>
                </div>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURE BREAKDOWN ──────────────────────────── */}
      <section id="features" style={{ borderBottom: 'var(--border-thick)' }}>
        {/* Section header */}
        <div style={{ padding: '60px 40px 0', borderBottom: 'var(--border-thick)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <RevealBlock>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 40 }}>
                <div>
                  <span className="uppercase-label" style={{ display: 'block', marginBottom: 12 }}>The Arsenal</span>
                  <h2 style={{
                    fontFamily: 'var(--font-serif-display)',
                    fontWeight: 900,
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    lineHeight: 1.0,
                  }}>
                    12 AI-Powered Tools.<br />
                    <span style={{ fontStyle: 'italic' }}>One Platform.</span>
                  </h2>
                </div>
                <div style={{ textAlign: 'right', maxWidth: 280 }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--neutral-600)', lineHeight: 1.7 }}>
                    Every tool built from the ground up for developer career intelligence. 
                    Not repurposed. Not generic.
                  </p>
                </div>
              </div>
            </RevealBlock>
          </div>
        </div>

        {/* Feature rows */}
        {FEATURES.map((feature, i) => (
          <RevealBlock key={feature.number} delay={0.05}>
            <div style={{
              borderBottom: 'var(--border-thin)',
              padding: '0 40px',
            }}>
              <div style={{
                maxWidth: 1200,
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: i % 2 === 0 ? '8fr 4fr' : '4fr 8fr',
                gap: 0,
                minHeight: 220,
              }}>
                {/* Content block */}
                <div style={{
                  padding: '48px 0',
                  order: i % 2 === 0 ? 1 : 2,
                  paddingRight: i % 2 === 0 ? 60 : 0,
                  paddingLeft: i % 2 !== 0 ? 60 : 0,
                  borderRight: i % 2 === 0 ? 'var(--border-thin)' : 'none',
                  borderLeft: i % 2 !== 0 ? 'var(--border-thin)' : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 16 }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.65rem',
                      letterSpacing: '0.12em',
                      color: 'var(--neutral-400)',
                    }}>{feature.number}</span>
                    <div style={{ flex: 1, height: 1, background: 'var(--muted)' }} />
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-serif-display)',
                    fontWeight: 800,
                    fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                    lineHeight: 1.1,
                    marginBottom: 10,
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-serif-display)',
                    fontSize: '1rem',
                    fontStyle: 'italic',
                    color: 'var(--neutral-600)',
                    marginBottom: 16,
                  }}>
                    {feature.deck}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-serif-body)',
                    fontSize: '0.92rem',
                    lineHeight: 1.8,
                    color: 'var(--neutral-700)',
                    maxWidth: '55ch',
                  }}>
                    {feature.body}
                  </p>
                </div>

                {/* Stat block */}
                <div
                  className="hard-shadow-hover"
                  style={{
                    padding: '48px 40px',
                    order: i % 2 === 0 ? 2 : 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: 8,
                    background: i % 2 === 0 ? 'var(--neutral-100)' : 'var(--ink)',
                    cursor: 'default',
                    transition: 'box-shadow 0.1s, transform 0.1s',
                  }}
                >
                  <div style={{
                    fontFamily: 'var(--font-serif-display)',
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    fontWeight: 900,
                    lineHeight: 1,
                    color: i % 2 === 0 ? 'var(--ink)' : 'var(--paper)',
                  }}>
                    {feature.stat}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: i % 2 === 0 ? 'var(--neutral-500)' : 'var(--neutral-400)',
                  }}>
                    {feature.statLabel}
                  </div>
                </div>
              </div>
            </div>
          </RevealBlock>
        ))}
      </section>

      {/* ── STATS — INVERTED ───────────────────────────── */}
      <section id="stats" className="section-inverted" style={{ padding: '80px 40px', borderBottom: 'var(--border-thick)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <RevealBlock>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 60 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.2)' }} />
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
              }}>
                By the Numbers
              </span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.2)' }} />
            </div>
          </RevealBlock>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: '1px solid rgba(255,255,255,0.15)' }}>
            {STATS.map((stat, i) => (
              <RevealBlock key={stat.label} delay={i * 0.1}>
                <div style={{
                  padding: '48px 32px',
                  borderRight: i < 3 ? '1px solid rgba(255,255,255,0.15)' : 'none',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-serif-display)',
                    fontSize: 'clamp(2.5rem, 4vw, 4rem)',
                    fontWeight: 900,
                    color: 'var(--paper)',
                    lineHeight: 1,
                    marginBottom: 8,
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.85)',
                    marginBottom: 4,
                  }}>
                    {stat.label}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.35)',
                  }}>
                    {stat.note}
                  </div>
                </div>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>

      {/* Second ticker (white-on-black variant already covered by inverted) */}
      <MarqueeTicker />

      {/* ── FINAL CTA ──────────────────────────────────── */}
      <section style={{ padding: '120px 40px', borderBottom: 'var(--border-thick)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: 0 }}>
            <RevealBlock>
              <div style={{ paddingRight: 80, borderRight: 'var(--border-thick)' }}>
                <span className="uppercase-label" style={{ display: 'block', marginBottom: 24 }}>
                  Ready to Begin?
                </span>
                <h2 style={{
                  fontFamily: 'var(--font-serif-display)',
                  fontSize: 'clamp(2.5rem, 5vw, 5rem)',
                  fontWeight: 900,
                  lineHeight: 1.0,
                  letterSpacing: '-0.03em',
                  marginBottom: 32,
                }}>
                  Start Your<br />
                  <span style={{ fontStyle: 'italic' }}>Analysis Today.</span>
                </h2>
                <p style={{
                  fontFamily: 'var(--font-serif-body)',
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  color: 'var(--neutral-700)',
                  maxWidth: '40ch',
                }}>
                  Connect your GitHub. Get your Developer DNA. Transform your career story. 
                  It takes under 60 seconds.
                </p>
              </div>
            </RevealBlock>

            <RevealBlock delay={0.2}>
              <div style={{ paddingLeft: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
                <Link to="/register" className="btn-primary" style={{ fontSize: '0.8rem', padding: '20px 32px', justifyContent: 'center' }}>
                  <GitBranch size={16} />
                  Get Your Developer DNA — Free
                  <ArrowRight size={16} />
                </Link>
                <Link to="/login" className="btn-secondary" style={{ fontSize: '0.8rem', padding: '18px 32px', justifyContent: 'center' }}>
                  Sign In to Existing Account
                </Link>
                <div style={{ borderTop: 'var(--border-muted)', paddingTop: 20, marginTop: 4 }}>
                  {['Free forever tier', 'GitHub OAuth — no password', 'No credit card required', 'Private repos optional'].map(item => (
                    <div key={item} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '8px 0',
                      borderBottom: 'var(--border-muted)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      letterSpacing: '0.08em',
                      color: 'var(--neutral-600)',
                    }}>
                      <span style={{ color: 'var(--ink)', fontWeight: 700 }}>✓</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </RevealBlock>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <footer style={{
        borderBottom: 'var(--border-thick)',
        background: 'var(--paper)',
      }}>
        {/* Footer columns */}
        <div style={{
          padding: '60px 40px',
          borderBottom: 'var(--border-thin)',
          display: 'grid',
          gridTemplateColumns: '3fr 1fr 1fr 1fr',
          gap: 40,
          maxWidth: 1200,
          margin: '0 auto',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-serif-display)',
              fontWeight: 900,
              fontSize: '1.5rem',
              letterSpacing: '-0.02em',
              marginBottom: 16,
            }}>
              GitInsight AI
            </div>
            <p style={{
              fontFamily: 'var(--font-serif-body)',
              fontSize: '0.9rem',
              lineHeight: 1.7,
              color: 'var(--neutral-600)',
              maxWidth: '30ch',
              marginBottom: 20,
            }}>
              The career intelligence platform for developers who take their work seriously.
            </p>
            <span className="edition-meta">
              © 2026 GitInsight AI. All rights reserved.
            </span>
          </div>
          {[
            { heading: 'Platform', items: ['Developer DNA', 'Portfolio Score', 'AI Recruiter', 'Career Readiness', 'Resume Builder', 'GitHub Wrapped'] },
            { heading: 'Resources', items: ['Documentation', 'API Reference', 'Changelog', 'Status'] },
            { heading: 'Company', items: ['About', 'Privacy Policy', 'Terms of Service', 'Contact'] },
          ].map(col => (
            <div key={col.heading}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: 16,
                paddingBottom: 10,
                borderBottom: 'var(--border-thin)',
              }}>
                {col.heading}
              </div>
              {col.items.map(item => (
                <div key={item} style={{
                  fontFamily: 'var(--font-serif-body)',
                  fontSize: '0.85rem',
                  color: 'var(--neutral-600)',
                  padding: '5px 0',
                  cursor: 'pointer',
                  transition: 'color 0.1s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--neutral-600)')}
                >
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Footer masthead bottom */}
        <div style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="edition-meta">
            Established 2026 · Vol. 1 · Developer Intelligence Platform
          </span>
          <span className="edition-meta">
            Built for Builders. Designed for Seriousness.
          </span>
        </div>
      </footer>
    </div>
  )
}
