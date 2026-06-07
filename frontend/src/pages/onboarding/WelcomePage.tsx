import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const highlights = [
  { num: '01', title: 'Developer DNA™', desc: 'Discover your unique developer archetype from 200+ code signals.' },
  { num: '02', title: 'Portfolio Score', desc: 'Quantified assessment of your portfolio quality and impact.' },
  { num: '03', title: 'AI Recruiter', desc: 'Know your hiring probability before you apply.' },
  { num: '04', title: 'GitHub Wrapped', desc: 'Your year in code — beautifully visualized and shareable.' },
]

export function WelcomePage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const firstName = user?.name?.split(' ')[0] ?? 'Developer'

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--paper)',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
    }}>
      {/* ── LEFT — Headline ───────────────────────────── */}
      <div style={{
        borderRight: 'var(--border-thick)',
        padding: '80px 60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--red)',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <span style={{ background: 'var(--red)', color: 'white', padding: '2px 8px' }}>Welcome</span>
            <span style={{ color: 'var(--neutral-400)' }}>Step 01 of 03</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-serif-display)',
            fontSize: 'clamp(3rem, 6vw, 5.5rem)',
            fontWeight: 900,
            lineHeight: 0.92,
            letterSpacing: '-0.04em',
            marginBottom: 32,
          }}>
            Hey {firstName},<br />
            <span style={{ fontStyle: 'italic' }}>you're in.</span>
          </h1>

          <p style={{
            fontFamily: 'var(--font-serif-body)',
            fontSize: '1.05rem',
            lineHeight: 1.8,
            color: 'var(--neutral-700)',
            maxWidth: '36ch',
            borderLeft: '4px solid var(--ink)',
            paddingLeft: 20,
            marginBottom: 40,
          }}>
            You're moments away from understanding your GitHub profile like never before. 
            Let's connect your GitHub and generate your AI intelligence report.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 340 }}
          >
            <button
              className="btn-primary"
              onClick={() => navigate('/connect-github')}
              style={{ fontSize: '0.8rem', padding: '16px 28px', justifyContent: 'center' }}
            >
              Connect GitHub & Start Analysis
              <ArrowRight size={15} />
            </button>
            <Link
              to="/dashboard"
              style={{
                textAlign: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--neutral-500)',
                padding: '12px',
                textDecoration: 'none',
                borderBottom: '1px solid transparent',
                transition: 'border-color 0.1s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderBottomColor = 'var(--ink)')}
              onMouseLeave={e => (e.currentTarget.style.borderBottomColor = 'transparent')}
            >
              Skip for now →
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* ── RIGHT — Feature Grid ───────────────────────── */}
      <div style={{ padding: '80px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--neutral-500)',
          marginBottom: 32,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <span>What awaits you</span>
          <div style={{ flex: 1, height: 1, background: 'var(--muted)' }} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          border: 'var(--border-thin)',
        }}>
          {highlights.map((h, i) => (
            <motion.div
              key={h.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
              className="hard-shadow-hover"
              style={{
                padding: '28px 24px',
                borderRight: i % 2 === 0 ? 'var(--border-thin)' : 'none',
                borderBottom: i < 2 ? 'var(--border-thin)' : 'none',
                cursor: 'default',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                letterSpacing: '0.15em',
                color: 'var(--red)',
                fontWeight: 700,
                marginBottom: 12,
              }}>
                {h.num}
              </div>
              <div style={{
                fontFamily: 'var(--font-serif-display)',
                fontWeight: 700,
                fontSize: '1rem',
                marginBottom: 8,
                lineHeight: 1.2,
              }}>
                {h.title}
              </div>
              <div style={{
                fontFamily: 'var(--font-serif-body)',
                fontSize: '0.82rem',
                color: 'var(--neutral-600)',
                lineHeight: 1.6,
              }}>
                {h.desc}
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{
          marginTop: 32,
          padding: '16px 20px',
          background: 'var(--neutral-100)',
          border: 'var(--border-muted)',
          display: 'flex',
          gap: 24,
          flexWrap: 'wrap',
        }}>
          {['Free to start', 'No credit card', 'OAuth secure', 'Private repos optional'].map(item => (
            <span key={item} style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--neutral-600)',
            }}>
              ✓ {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
