import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, GitBranch, Zap, Star, Users } from 'lucide-react'
import { NeuralNetworkHero } from '../../components/three/NeuralNetworkHero'
import { SolarSystem } from '../../components/three/SolarSystem'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { value: '10K+', label: 'Developers Analyzed' },
  { value: '50K+', label: 'Repositories Scored' },
  { value: '98%', label: 'Accuracy Rate' },
  { value: '< 60s', label: 'Full Analysis Time' },
]

const FEATURES = [
  { icon: '🧬', title: 'Developer DNA™', desc: 'Your unique developer archetype based on code patterns and project history' },
  { icon: '🎯', title: 'AI Recruiter', desc: 'Simulate how top recruiters evaluate your GitHub profile' },
  { icon: '📊', title: 'Portfolio Score', desc: 'Quantified assessment of your portfolio quality and impact' },
  { icon: '🚀', title: 'Career Readiness', desc: 'Role-specific hiring readiness scores with skill gap analysis' },
  { icon: '🎁', title: 'GitHub Wrapped', desc: 'Your year in code — Spotify Wrapped for developers' },
  { icon: '📝', title: 'Resume Builder', desc: 'AI-powered ATS-optimized resumes from your GitHub data' },
]

const STORY_SCENES = [
  { label: '01', headline: 'You spent thousands of hours building.', sub: 'Nights. Weekends. Coffee. Code. Repeat.' },
  { label: '02', headline: 'Recruiters see only repositories.', sub: 'No context. No story. Just file counts and stars.' },
  { label: '03', headline: 'Most developers don\'t know their own story.', sub: 'Your work tells a powerful narrative. You just can\'t see it.' },
  { label: '04', headline: 'GitInsight AI reveals the complete picture.', sub: 'Turn your GitHub into career-defining intelligence.' },
]

export function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const storyRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Story scenes scroll animation
      gsap.utils.toArray('.story-scene').forEach((el) => {
        gsap.fromTo(el as Element,
          { opacity: 0, y: 60 },
          {
            opacity: 1, y: 0, duration: 0.8,
            scrollTrigger: { trigger: el as Element, start: 'top 80%', end: 'top 40%', scrub: false },
          }
        )
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Header */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(5,5,5,0.8)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={16} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem' }}>
            GitInsight AI
          </span>
        </div>
        <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>Features</a>
          <a href="#story" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>How it Works</a>
          <Link to="/login" className="btn-ghost" style={{ fontSize: '0.875rem' }}>Log in</Link>
          <Link to="/register" className="btn-primary" style={{ padding: '10px 22px', fontSize: '0.875rem' }}>
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ position: 'relative', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: heroOpacity, scale: heroScale }}
      >
        {/* Three.js Background */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <NeuralNetworkHero />
        </div>

        {/* Gradient overlays */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(59,130,246,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
          background: 'linear-gradient(to bottom, transparent, var(--bg-primary))',
          pointerEvents: 'none',
        }} />

        {/* Hero Content */}
        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 900, padding: '0 40px' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="section-label" style={{ marginBottom: 20, display: 'inline-block' }}>
              ✦ AI-Powered Developer Intelligence
            </div>
          </motion.div>

          <motion.h1
            className="gradient-text-aurora"
            style={{ marginBottom: 24, lineHeight: 1.1, letterSpacing: '-0.03em' }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Transform Your GitHub Into Career Intelligence
          </motion.h1>

          <motion.p
            style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'var(--text-secondary)', marginBottom: 48, lineHeight: 1.7, maxWidth: 600, margin: '0 auto 48px' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            AI-powered portfolio analysis, recruiter insights, career readiness, and developer growth intelligence. Built for developers who are serious about their career.
          </motion.p>

          <motion.div
            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link to="/register" className="btn-primary" style={{ fontSize: '1rem', padding: '16px 36px' }}>
              <Zap size={18} />
              Analyze My GitHub
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-secondary">
              <GitBranch size={18} />
              Sign In
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            style={{ display: 'flex', gap: 48, justifyContent: 'center', marginTop: 72, flexWrap: 'wrap' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {STATS.map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)' }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div style={{ width: 24, height: 40, border: '2px solid var(--glass-border)', borderRadius: 12,
            display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
            <motion.div
              style={{ width: 4, height: 8, background: 'var(--accent-blue)', borderRadius: 2 }}
              animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Story Section */}
      <section ref={storyRef} id="story" style={{ padding: '120px 40px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div className="section-label" style={{ textAlign: 'center', marginBottom: 16 }}>The Problem</div>
          <h2 style={{ textAlign: 'center', marginBottom: 80, background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.6))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Your story deserves to be told
          </h2>

          {STORY_SCENES.map((scene, i) => (
            <div key={i} className="story-scene" style={{
              display: 'flex', gap: 40, marginBottom: 80, alignItems: 'flex-start',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent-blue)', 
                paddingTop: 6, flexShrink: 0, width: 24 }}>
                {scene.label}
              </div>
              <div>
                <h3 style={{ fontSize: 'clamp(1.25rem, 3vw, 2rem)', marginBottom: 12, fontWeight: 700 }}>
                  {scene.headline}
                </h3>
                <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {scene.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Universe / Solar System */}
      <section id="features" style={{ padding: '80px 40px', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="section-label" style={{ marginBottom: 12 }}>Feature Universe</div>
          <h2 className="gradient-text">Everything you need to grow</h2>
          <p style={{ marginTop: 16, color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            12 AI-powered tools orbiting your GitHub profile
          </p>
        </div>

        {/* 3D Solar System */}
        <div style={{ position: 'relative', height: 500, borderRadius: 'var(--radius-xl)', overflow: 'hidden',
          border: '1px solid var(--glass-border)', background: 'var(--glass-bg)' }}>
          <SolarSystem />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            textAlign: 'center', pointerEvents: 'none' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem' }}>GitHub</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Profile</div>
          </div>
        </div>

        {/* Feature Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginTop: 60 }}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className="glass-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>{f.icon}</div>
              <h4 style={{ marginBottom: 8 }}>{f.title}</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '160px 40px', textAlign: 'center', position: 'relative' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(139,92,246,0.12) 0%, transparent 70%)',
        }} />
        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="section-label" style={{ marginBottom: 20 }}>Ready to begin?</div>
            <h2 className="gradient-text-aurora" style={{ marginBottom: 24 }}>
              Start your analysis today
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: 48 }}>
              Connect your GitHub. Get your Developer DNA. Transform your career story.
            </p>
            <Link to="/register" className="btn-primary" style={{ fontSize: '1.1rem', padding: '18px 48px' }}>
              <Zap size={20} />
              Get Your Developer DNA
              <ArrowRight size={20} />
            </Link>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 48, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <Star size={14} /> Free to start
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <GitBranch size={14} /> GitHub OAuth
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <Users size={14} /> No credit card needed
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <GitBranch size={14} /> Private repos optional
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={14} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>GitInsight AI</span>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          © 2026 GitInsight AI · Transform Your GitHub Into Career Intelligence
        </p>
      </footer>
    </div>
  )
}
