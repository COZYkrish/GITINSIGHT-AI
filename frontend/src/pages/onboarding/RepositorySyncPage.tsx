import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Loader2, Zap, GitBranch, Star, Code } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useGitHubStore } from '../../store/githubStore'
import api from '../../services/api'

const steps = [
  { id: 'connect', label: 'GitHub connected', icon: '🔗' },
  { id: 'sync', label: 'Syncing repositories', icon: '📁' },
  { id: 'analyze', label: 'Running AI analysis', icon: '🧠' },
  { id: 'done', label: 'Reports ready!', icon: '✅' },
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
        // Step 1: connected (already done by backend)
        setCurrentStep(1)
        await fetchMe()

        // Step 2: sync
        await new Promise(r => setTimeout(r, 800))
        setCurrentStep(2)
        const syncRes = await api.post('/api/github/sync')
        setRepoCount(syncRes.data.repoCount)
        await Promise.all([fetchProfile(), fetchRepositories()])

        // Step 3: initial analysis
        await new Promise(r => setTimeout(r, 600))
        setCurrentStep(3)
        await api.post('/api/analysis/developer-dna')

        // Step 4: done
        await new Promise(r => setTimeout(r, 500))
        setCurrentStep(4)
        setTimeout(() => navigate('/dashboard'), 1500)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Sync failed')
      }
    }

    runSync()
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(59,130,246,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', maxWidth: 500, padding: '0 40px' }}>
        {/* Animated logo */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: currentStep < 4 ? Infinity : 0, ease: 'linear' }}
          style={{ width: 80, height: 80, borderRadius: 24, background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
          <Zap size={36} color="white" />
        </motion.div>

        <div className="section-label" style={{ marginBottom: 12 }}>Step 3 of 3</div>
        <h1 style={{ marginBottom: 8 }}>
          {currentStep < 4 ? 'Setting up your intelligence...' : '🎉 You\'re ready!'}
        </h1>

        {repoCount > 0 && (
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
            Found {repoCount} repositories — generating your AI reports
          </p>
        )}

        {/* Steps */}
        <div style={{ textAlign: 'left', marginBottom: 40 }}>
          {steps.map((step, i) => {
            const isDone = currentStep > i
            const isActive = currentStep === i
            return (
              <motion.div key={step.id}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', marginBottom: 8,
                  borderRadius: 12, background: isActive ? 'rgba(59,130,246,0.08)' : isDone ? 'rgba(16,185,129,0.06)' : 'var(--glass-bg)',
                  border: `1px solid ${isActive ? 'var(--accent-blue)' : isDone ? 'rgba(16,185,129,0.3)' : 'var(--glass-border)'}`,
                  transition: 'all 0.3s ease' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isDone ? 'var(--accent-green-dim)' : isActive ? 'var(--accent-blue-dim)' : 'var(--glass-bg)' }}>
                  {isDone ? <CheckCircle size={20} color="var(--accent-green)" />
                    : isActive ? <Loader2 size={20} color="var(--accent-blue)" style={{ animation: 'spin-slow 1s linear infinite' }} />
                    : <span style={{ fontSize: '1rem' }}>{step.icon}</span>}
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: isActive ? 600 : 400,
                  color: isDone ? 'var(--accent-green)' : isActive ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {step.label}
                </span>
              </motion.div>
            )
          })}
        </div>

        {error && (
          <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.3)', color: 'var(--accent-pink)', fontSize: '0.875rem' }}>
            {error} — <a href="/dashboard" style={{ color: 'var(--accent-blue)' }}>Go to dashboard</a>
          </div>
        )}
      </motion.div>
    </div>
  )
}
