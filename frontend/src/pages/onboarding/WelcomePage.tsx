import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, ArrowRight, Dna, BarChart2, Gift, GraduationCap } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const highlights = [
  { icon: '🧬', title: 'Developer DNA™', desc: 'Discover your unique developer archetype' },
  { icon: '📊', title: 'Portfolio Score', desc: 'Quantified assessment of your work' },
  { icon: '🎯', title: 'AI Recruiter', desc: 'Know your hiring probability' },
  { icon: '🎁', title: 'GitHub Wrapped', desc: 'Your year in code — beautifully visualized' },
]

export function WelcomePage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      {/* Animated background glow */}
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ textAlign: 'center', maxWidth: 700, padding: '0 40px', position: 'relative' }}>
        {/* Logo */}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          style={{ width: 80, height: 80, borderRadius: 24, background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
          <Zap size={36} color="white" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="section-label" style={{ marginBottom: 12 }}>Welcome to GitInsight AI</div>
          <h1 style={{ marginBottom: 16 }}>
            Hey {user?.name?.split(' ')[0]}, <br />
            <span className="gradient-text-aurora">you're in. 🚀</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 48 }}>
            You're moments away from understanding your GitHub profile like never before. Let's connect your GitHub and generate your AI intelligence report.
          </p>
        </motion.div>

        {/* Feature highlights */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 48, textAlign: 'left' }}>
          {highlights.map((h, i) => (
            <motion.div key={h.title} className="glass-card"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.1 }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{h.icon}</div>
              <div style={{ fontWeight: 700, marginBottom: 4, fontSize: '0.9rem' }}>{h.title}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{h.desc}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <button className="btn-primary" onClick={() => navigate('/connect-github')}
            style={{ fontSize: '1rem', padding: '16px 48px', marginBottom: 16 }}>
            Connect GitHub & Start Analysis
            <ArrowRight size={18} />
          </button>
          <div><Link to="/dashboard" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none' }}>
            Skip for now →
          </Link></div>
        </motion.div>
      </div>
    </div>
  )
}
