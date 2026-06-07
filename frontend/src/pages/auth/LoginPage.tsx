import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, GitBranch } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      const { user } = useAuthStore.getState()
      navigate(user?.onboardingComplete ? '/dashboard' : '/welcome')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  const handleGitHubLogin = async () => {
    const { default: api } = await import('../../services/api')
    const { data } = await api.get('/api/auth/github')
    window.location.href = data.url
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      background: 'var(--paper)',
    }}>
      {/* ── LEFT PANEL — Editorial Art ─────────────────── */}
      <div style={{
        background: 'var(--ink)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px',
        position: 'relative',
        overflow: 'hidden',
        borderRight: 'var(--border-thick)',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}>
        {/* Top — Masthead */}
        <div>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{
              fontFamily: 'var(--font-serif-display)',
              fontWeight: 900,
              fontSize: '1.4rem',
              color: 'var(--paper)',
              letterSpacing: '-0.02em',
            }}>
              GitInsight AI
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
              marginTop: 4,
            }}>
              Developer Intelligence Platform
            </div>
          </Link>
        </div>

        {/* Center — Dramatic vertical headline */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{ borderTop: '2px solid var(--red)', paddingTop: 24, marginBottom: 24 }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--red)',
            }}>
              Welcome Back
            </span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-serif-display)',
            fontWeight: 900,
            fontSize: 'clamp(4rem, 7vw, 7rem)',
            lineHeight: 0.88,
            letterSpacing: '-0.04em',
            color: 'var(--paper)',
            writingMode: 'horizontal-tb',
          }}>
            SIGN<br />
            <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.6)' }}>IN</span>
          </h1>
          <div style={{
            marginTop: 32,
            fontFamily: 'var(--font-serif-body)',
            fontSize: '1rem',
            fontStyle: 'italic',
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.55)',
            maxWidth: '28ch',
          }}>
            Your GitHub profile holds the story of your career. Let's decode it together.
          </div>
        </motion.div>

        {/* Bottom — edition meta */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.15)',
          paddingTop: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.25)',
          }}>
            Vol. 1 · 2026
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.25)',
          }}>
            Secure · Encrypted
          </span>
        </div>
      </div>

      {/* ── RIGHT PANEL — Form ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '48px 60px',
          maxWidth: 520,
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Form header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--neutral-500)',
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <span>Authentication</span>
            <div style={{ flex: 1, height: 1, background: 'var(--muted)' }} />
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif-display)',
            fontWeight: 800,
            fontSize: '2rem',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            marginBottom: 8,
          }}>
            Welcome back.
          </h2>
          <p style={{ fontFamily: 'var(--font-serif-body)', fontSize: '0.9rem', color: 'var(--neutral-600)' }}>
            Sign in to your developer command center.
          </p>
        </div>

        {/* GitHub OAuth */}
        <button
          onClick={handleGitHubLogin}
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', marginBottom: 32, padding: '16px' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          Continue with GitHub
          <ArrowRight size={14} />
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--muted)' }} />
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--neutral-400)',
          }}>
            or email
          </span>
          <div style={{ flex: 1, height: 1, background: 'var(--muted)' }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '12px 16px',
                background: 'rgba(204,0,0,0.06)',
                border: '1px solid var(--red)',
                color: 'var(--red)',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-mono)',
                marginBottom: 20,
              }}
            >
              {error}
            </motion.div>
          )}

          {/* Email field */}
          <div style={{ marginBottom: 28 }}>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--neutral-500)',
              marginBottom: 10,
            }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={14} style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-400)' }} />
              <input
                className="np-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{ paddingLeft: 24 }}
              />
            </div>
          </div>

          {/* Password field */}
          <div style={{ marginBottom: 32 }}>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--neutral-500)',
              marginBottom: 10,
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={14} style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-400)' }} />
              <input
                className="np-input"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ paddingLeft: 24, paddingRight: 32 }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--neutral-400)', cursor: 'pointer' }}
              >
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            style={{ width: '100%', justifyContent: 'center', padding: '16px', opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? 'Signing In...' : <>Sign In <ArrowRight size={14} /></>}
          </button>
        </form>

        {/* Footer link */}
        <p style={{
          textAlign: 'center',
          marginTop: 28,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          letterSpacing: '0.08em',
          color: 'var(--neutral-500)',
        }}>
          No account?{' '}
          <Link
            to="/register"
            style={{ color: 'var(--ink)', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 3 }}
          >
            Create one free →
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
