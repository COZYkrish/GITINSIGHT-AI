import { useState } from 'react'
import { motion } from 'framer-motion'
import { GitBranch, Lock, ArrowRight, Shield } from 'lucide-react'
import api from '../../services/api'

const permissions = [
  { num: '01', label: 'Read your public profile', icon: GitBranch },
  { num: '02', label: 'Read your repositories (names, metadata, languages)', icon: GitBranch },
  { num: '03', label: 'Read-only access — we never write or delete', icon: Lock },
  { num: '04', label: 'Your token is encrypted at rest (AES-256)', icon: Shield },
]

export function ConnectGitHubPage() {
  const [isRedirecting, setIsRedirecting] = useState(false)

  const connect = async () => {
    setIsRedirecting(true)
    try {
      const { data } = await api.get('/api/auth/github')
      window.location.href = data.url
    } catch {
      setIsRedirecting(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--paper)',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
    }}>
      {/* ── LEFT — Inverted art panel ──────────────────── */}
      <div style={{
        background: 'var(--ink)',
        padding: '80px 60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRight: 'var(--border-thick)',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)',
        }}>
          02 / 03 — Connect GitHub
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 style={{
            fontFamily: 'var(--font-serif-display)',
            fontWeight: 900,
            fontSize: 'clamp(3.5rem, 6vw, 6rem)',
            lineHeight: 0.88,
            letterSpacing: '-0.04em',
            color: 'var(--paper)',
            marginBottom: 32,
          }}>
            CONNECT<br />
            <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.55)' }}>GITHUB.</span>
          </h1>

          <p style={{
            fontFamily: 'var(--font-serif-body)',
            fontSize: '1rem',
            fontStyle: 'italic',
            lineHeight: 1.75,
            color: 'rgba(255,255,255,0.5)',
            maxWidth: '30ch',
          }}>
            Authorize GitInsight AI to read your GitHub profile. We analyze, we report — 
            we never write, never delete.
          </p>
        </motion.div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.15)',
          paddingTop: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <Lock size={12} color="rgba(255,255,255,0.3)" />
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.25)',
          }}>
            OAuth 2.0 · Industry standard security
          </span>
        </div>
      </div>

      {/* ── RIGHT — Permission list + CTA ──────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{
          padding: '80px 60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
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
          <span>Access requested</span>
          <div style={{ flex: 1, height: 1, background: 'var(--muted)' }} />
        </div>

        {/* Permission table */}
        <div style={{ border: 'var(--border-thin)', marginBottom: 36 }}>
          {permissions.map((p, i) => (
            <div key={p.label} style={{
              display: 'grid',
              gridTemplateColumns: '48px 1fr',
              borderBottom: i < permissions.length - 1 ? 'var(--border-thin)' : 'none',
            }}>
              <div style={{
                borderRight: 'var(--border-thin)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                letterSpacing: '0.1em',
                color: 'var(--neutral-400)',
              }}>
                {p.num}
              </div>
              <div style={{
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}>
                <p.icon size={14} strokeWidth={1.5} color="var(--neutral-500)" />
                <span style={{
                  fontFamily: 'var(--font-serif-body)',
                  fontSize: '0.875rem',
                  color: 'var(--neutral-700)',
                }}>
                  {p.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button
          className="btn-primary"
          onClick={connect}
          disabled={isRedirecting}
          style={{ justifyContent: 'center', padding: '18px 28px', fontSize: '0.8rem', marginBottom: 16, opacity: isRedirecting ? 0.7 : 1 }}
        >
          <GitBranch size={16} />
          {isRedirecting ? 'Redirecting to GitHub...' : 'Authorize with GitHub'}
          <ArrowRight size={16} />
        </button>

        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          letterSpacing: '0.08em',
          color: 'var(--neutral-400)',
          textAlign: 'center',
        }}>
          You can revoke access at any time in GitHub Settings → Applications.
        </p>
      </motion.div>
    </div>
  )
}
