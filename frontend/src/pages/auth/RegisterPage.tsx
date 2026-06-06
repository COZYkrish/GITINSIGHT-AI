import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Eye, EyeOff, Zap, ArrowRight, Check } from 'lucide-react'
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 60% 40%, rgba(139,92,246,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: 480, padding: 40 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 32 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={20} color="white" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem' }}>GitInsight AI</span>
          </Link>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 8 }}>Create your account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Start your developer intelligence journey</p>
        </div>

        <div className="glass-card" style={{ padding: 32 }}>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.3)', color: '#ec4899', fontSize: '0.85rem', marginBottom: 16 }}>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            {[
              { key: 'name', label: 'Full Name', placeholder: 'John Doe', icon: User, type: 'text' },
              { key: 'email', label: 'Email', placeholder: 'you@example.com', icon: Mail, type: 'email' },
            ].map(({ key, label, placeholder, icon: Icon, type }) => (
              <div key={key} style={{ marginBottom: 16 }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>{label}</label>
                <div style={{ position: 'relative' }}>
                  <Icon size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    className="glass-input" type={type}
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder} required
                    style={{ paddingLeft: 40 }}
                  />
                </div>
              </div>
            ))}

            {[
              { key: 'password', label: 'Password', placeholder: '••••••••' },
              { key: 'confirm', label: 'Confirm Password', placeholder: '••••••••' },
            ].map(({ key, label, placeholder }) => (
              <div key={key} style={{ marginBottom: key === 'password' ? 8 : 16 }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>{label}</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    className="glass-input"
                    type={showPass ? 'text' : 'password'}
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder} required
                    style={{ paddingLeft: 40, paddingRight: key === 'confirm' ? 14 : 44 }}
                  />
                  {key === 'password' && (
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Password checks */}
            {form.password.length > 0 && (
              <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {passwordChecks.map(c => (
                  <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem' }}>
                    <Check size={12} color={c.ok ? 'var(--accent-green)' : 'var(--text-muted)'} />
                    <span style={{ color: c.ok ? 'var(--accent-green)' : 'var(--text-muted)' }}>{c.label}</span>
                  </div>
                ))}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={isLoading}
              style={{ width: '100%', justifyContent: 'center', padding: '14px', opacity: isLoading ? 0.7 : 1 }}>
              {isLoading ? 'Creating account...' : <>Create Account <ArrowRight size={16} /></>}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}
