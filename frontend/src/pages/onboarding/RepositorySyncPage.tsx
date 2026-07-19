import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Loader2, GitBranch } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useGitHubStore } from '../../store/githubStore'
import api from '../../services/api'

const steps = [
  { id: 'connect', label: 'GitHub connected successfully' },
  { id: 'sync',    label: 'Syncing repositories' },
  { id: 'analyze', label: 'Running AI analysis' },
  { id: 'done',    label: 'Intelligence reports ready' },
]

export function RepositorySyncPage() {
  const [searchParams] = useSearchParams()
  const [currentStep, setCurrentStep] = useState(0)
  const [repoCount, setRepoCount] = useState(0)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { fetchMe } = useAuthStore()
  const { fetchProfile, fetchRepositories } = useGitHubStore()

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      localStorage.setItem('gitinsight_token', token)
      useAuthStore.getState().token = token
    }

    const runSync = async () => {
      try {
        setCurrentStep(1)
        await fetchMe()
        await new Promise(r => setTimeout(r, 800))
        setCurrentStep(2)
        const syncRes = await api.post('/api/github/sync')
        setRepoCount(syncRes.data.repoCount)
        await Promise.all([fetchProfile(), fetchRepositories()])
        await new Promise(r => setTimeout(r, 600))
        setCurrentStep(3)
        await api.post('/api/analysis/developer-dna')
        await new Promise(r => setTimeout(r, 500))
        setCurrentStep(4)
        setTimeout(() => navigate('/dashboard'), 1500)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Sync failed')
      }
    }

    runSync()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="auth-grid" style={{
      minHeight: '100vh',
      background: 'var(--paper)',
    }}>
      {/* Left — inverted progress panel */}
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
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
          03 / 03 — Sync in Progress
        </div>

        <div>
          {/* Spinning icon */}
          <motion.div
            animate={{ rotate: currentStep < 4 ? 360 : 0 }}
            transition={{ duration: 3, repeat: currentStep < 4 ? Infinity : 0, ease: 'linear' }}
            style={{
              width: 64, height: 64,
              border: '3px solid rgba(255,255,255,0.3)',
              borderTopColor: 'var(--paper)',
              borderRadius: 0,
              marginBottom: 40,
            }}
          />
          <h1 style={{
            fontFamily: 'var(--font-serif-display)',
            fontWeight: 900,
            fontSize: 'clamp(3rem, 5vw, 5rem)',
            lineHeight: 0.88,
            letterSpacing: '-0.04em',
            color: 'var(--paper)',
            marginBottom: 20,
          }}>
            {currentStep < 4 ? (<>SETTING<br /><span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.5)' }}>UP.</span></>) : (<>YOU'RE<br /><span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.5)' }}>READY.</span></>)}
          </h1>
          {repoCount > 0 && (
            <p style={{ fontFamily: 'var(--font-serif-body)', fontSize: '0.95rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>
              Found {repoCount} repositories — generating your AI intelligence reports.
            </p>
          )}
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 20 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>
            This usually takes under 60 seconds
          </span>
        </div>
      </div>

      {/* Right — step list */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        style={{ padding: '80px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      >
        <div className="uppercase-label" style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span>Progress</span>
          <div style={{ flex: 1, height: 1, background: 'var(--muted)' }} />
        </div>

        <div style={{ border: 'var(--border-thin)' }}>
          {steps.map((step, i) => {
            const isDone   = currentStep > i + 1
            const isActive = currentStep === i + 1
            return (
              <div key={step.id} style={{
                display: 'grid',
                gridTemplateColumns: '48px 1fr auto',
                alignItems: 'center',
                borderBottom: i < steps.length - 1 ? 'var(--border-thin)' : 'none',
                background: isActive ? 'var(--ink)' : isDone ? 'var(--neutral-100)' : 'transparent',
                transition: 'background 0.2s',
              }}>
                {/* Number col */}
                <div style={{
                  borderRight: 'var(--border-thin)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.62rem',
                  letterSpacing: '0.1em',
                  color: isActive ? 'var(--paper)' : isDone ? 'var(--neutral-400)' : 'var(--neutral-300)',
                }}>
                  0{i + 1}
                </div>
                {/* Label */}
                <div style={{
                  padding: '16px 20px',
                  fontFamily: 'var(--font-serif-body)',
                  fontSize: '0.88rem',
                  color: isActive ? 'var(--paper)' : isDone ? 'var(--neutral-600)' : 'var(--neutral-300)',
                  fontWeight: isActive ? 600 : 400,
                }}>
                  {step.label}
                </div>
                {/* Icon */}
                <div style={{ padding: '16px 20px' }}>
                  {isDone && <CheckCircle size={16} strokeWidth={1.5} color="var(--neutral-500)" />}
                  {isActive && <Loader2 size={16} strokeWidth={1.5} color="var(--paper)" style={{ animation: 'spin-slow 1s linear infinite' }} />}
                </div>
              </div>
            )
          })}
        </div>

        {error && (
          <div style={{
            marginTop: 24,
            padding: '14px 16px',
            border: '1px solid var(--red)',
            background: 'rgba(204,0,0,0.04)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            color: 'var(--red)',
            letterSpacing: '0.06em',
          }}>
            {error} —{' '}
            <a href="/dashboard" style={{ color: 'var(--ink)', textDecoration: 'underline' }}>Go to dashboard</a>
          </div>
        )}
      </motion.div>
    </div>
  )
}
