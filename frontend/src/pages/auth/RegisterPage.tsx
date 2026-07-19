import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

export function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const { register, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const passwordChecks = [
    { label: 'At least 8 characters', ok: form.password.length >= 8 },
    { label: 'Contains a number', ok: /\d/.test(form.password) },
    { label: 'Passwords match', ok: form.password === form.confirm && form.confirm.length > 0 },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return }
    try {
      await register(form.name, form.email, form.password)
      navigate('/welcome')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    }
  }

  return (
    <div className="auth-grid" style={{
      minHeight: '100vh',
      background: 'var(--paper)',
    }}>
      {/* ── RIGHT (first in DOM) — Form ─────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '48px 60px',
          maxWidth: 540,
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Form header */}
        <div style={{ marginBottom: 36 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{
              fontFamily: 'var(--font-serif-display)',
              fontWeight: 900,
              fontSize: '1.1rem',
              color: 'var(--ink)',
              letterSpacing: '-0.02em',
              marginBottom: 32,
            }}>
              ← GitInsight AI
            </div>
          </Link>
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
            <span>New Account</span>
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
            Begin your analysis.
          </h2>
          <p style={{ fontFamily: 'var(--font-serif-body)', fontSize: '0.9rem', color: 'var(--neutral-600)' }}>
            Start your developer intelligence journey — free.
          </p>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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

        <form onSubmit={handleSubmit}>
          {/* Name + Email */}
          {[
            { key: 'name', label: 'Full Name', placeholder: 'krish sharma', icon: User, type: 'text' },
            { key: 'email', label: 'Email Address', placeholder: 'you@example.com', icon: Mail, type: 'email' },
          ].map(({ key, label, placeholder, icon: Icon, type }) => (
            <div key={key} style={{ marginBottom: 24 }}>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--neutral-500)',
                marginBottom: 10,
              }}>
                {label}
              </label>
              <div style={{ position: 'relative' }}>
                <Icon size={14} style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-400)' }} />
                <input
                  className="np-input"
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  required
                  style={{ paddingLeft: 24 }}
                />
              </div>
            </div>
          ))}

          {/* Password fields */}
          {[
            { key: 'password', label: 'Password', placeholder: '••••••••' },
            { key: 'confirm', label: 'Confirm Password', placeholder: '••••••••' },
          ].map(({ key, label, placeholder }) => (
            <div key={key} style={{ marginBottom: key === 'password' ? 8 : 12 }}>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--neutral-500)',
                marginBottom: 10,
              }}>
                {label}
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={14} style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-400)' }} />
                <input
                  className="np-input"
                  type={showPass ? 'text' : 'password'}
                  value={form[key as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  required
                  style={{ paddingLeft: 24, paddingRight: key === 'password' ? 32 : 0 }}
                />
                {key === 'password' && (
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--neutral-400)', cursor: 'pointer' }}
                  >
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Password strength */}
          {form.password.length > 0 && (
            <div style={{ marginBottom: 20, padding: '12px', border: 'var(--border-muted)', background: 'var(--neutral-100)' }}>
              {passwordChecks.map(c => (
                <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.08em' }}>
                  <span style={{ color: c.ok ? 'var(--ink)' : 'var(--neutral-400)', fontWeight: 700, minWidth: 12 }}>
                    {c.ok ? '✓' : '✗'}
                  </span>
                  <span style={{ color: c.ok ? 'var(--ink)' : 'var(--neutral-400)' }}>{c.label}</span>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            style={{ width: '100%', justifyContent: 'center', padding: '16px', marginTop: 8, opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? 'Creating Account...' : <>Create Account <ArrowRight size={14} /></>}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: 24,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          letterSpacing: '0.08em',
          color: 'var(--neutral-500)',
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--ink)', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 3 }}>
            Sign in →
          </Link>
        </p>
      </motion.div>

      {/* ── LEFT — Editorial Panel ──────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        style={{
          background: 'var(--ink)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px',
          borderLeft: 'var(--border-thick)',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        {/* Top */}
        <div>
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: 20 }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)',
            }}>
              New Account
            </span>
          </div>
        </div>

        {/* Headline */}
        <div>
          <h1 style={{
            fontFamily: 'var(--font-serif-display)',
            fontWeight: 900,
            fontSize: 'clamp(3.5rem, 6vw, 6.5rem)',
            lineHeight: 0.88,
            letterSpacing: '-0.04em',
            color: 'var(--paper)',
            marginBottom: 32,
          }}>
            JOIN THE<br />
            <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.55)' }}>RANKS.</span>
          </h1>

          {/* What you get */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 28 }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
              marginBottom: 16,
            }}>
              What you unlock:
            </div>
            {[
              'Developer DNA™ — your archetype',
              'Portfolio Score — 50+ signals',
              'AI Recruiter simulation',
              'ATS-ready resume builder',
              'GitHub Wrapped retrospective',
              'Career readiness roadmap',
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '9px 0',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                fontFamily: 'var(--font-serif-body)',
                fontSize: '0.88rem',
                color: 'rgba(255,255,255,0.65)',
              }}>
                <span style={{ color: 'var(--red)', fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>0{i + 1}</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom meta */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 20 }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.2)',
          }}>
            Free forever tier · No credit card required
          </span>
        </div>
      </motion.div>
    </div>
  )
}
