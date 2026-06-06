import { motion, HTMLMotionProps } from 'framer-motion'
import { ReactNode } from 'react'

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  className?: string
  glow?: 'blue' | 'purple' | 'cyan' | 'none'
  hover?: boolean
  gradient?: boolean
}

export function GlassCard({ children, className = '', glow = 'none', hover = true, gradient = false, ...props }: GlassCardProps) {
  const glowClass = glow !== 'none' ? `glow-${glow}` : ''
  const gradientClass = gradient ? 'gradient-border' : ''

  return (
    <motion.div
      className={`glass-card ${glowClass} ${gradientClass} ${className}`}
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  )
}

interface GlowBadgeProps {
  children: ReactNode
  color?: 'blue' | 'purple' | 'cyan' | 'green' | 'pink' | 'amber'
  className?: string
}

export function GlowBadge({ children, color = 'blue', className = '' }: GlowBadgeProps) {
  return (
    <span className={`tag tag-${color} ${className}`}>
      {children}
    </span>
  )
}

interface ScoreGaugeProps {
  score: number
  size?: number
  label?: string
  color?: string
}

export function ScoreGauge({ score, size = 120, label, color = 'var(--accent-blue)' }: ScoreGaugeProps) {
  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference
  const offset = circumference - progress

  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="var(--glass-border)" strokeWidth={8} />
        <motion.circle
          cx={size/2} cy={size/2} r={radius}
          fill="none" stroke={color} strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <motion.span
          style={{ fontSize: size * 0.22, fontFamily: 'var(--font-mono)', fontWeight: 700, color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}
        </motion.span>
        {label && <span style={{ fontSize: size * 0.1, color: 'var(--text-muted)', marginTop: 2 }}>{label}</span>}
      </div>
    </div>
  )
}

interface AnimatedCounterProps {
  value: number
  duration?: number
  suffix?: string
  className?: string
}

export function AnimatedCounter({ value, duration = 1.5, suffix = '', className = '' }: AnimatedCounterProps) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.span
        initial={{ textContent: '0' } as never}
        animate={{ textContent: value.toString() } as never}
        transition={{ duration, ease: 'easeOut' }}
        onUpdate={(latest) => {
          // Handled by framer motion
          void latest
        }}
      >
        <Counter from={0} to={value} duration={duration} />
      </motion.span>
      {suffix}
    </motion.span>
  )
}

function Counter({ from, to, duration }: { from: number; to: number; duration: number }) {
  return (
    <motion.span
      initial={from}
      animate={to}
      transition={{ duration, ease: 'easeOut' }}
    >
      {to}
    </motion.span>
  )
}

interface TypewriterTextProps {
  text: string
  speed?: number
  className?: string
  onComplete?: () => void
}

export function TypewriterText({ text, speed = 30, className = '', onComplete }: TypewriterTextProps) {
  return (
    <motion.span className={className}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * (speed / 1000), duration: 0.05 }}
          onAnimationComplete={i === text.length - 1 ? onComplete : undefined}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  )
}

interface ProgressBarProps {
  value: number
  max?: number
  color?: string
  className?: string
  height?: number
  animated?: boolean
}

export function ProgressBar({ value, max = 100, color = 'var(--accent-blue)', className = '', height = 6, animated = true }: ProgressBarProps) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className={className} style={{ height, borderRadius: height, background: 'var(--glass-bg)', overflow: 'hidden' }}>
      <motion.div
        style={{ height: '100%', borderRadius: height, background: color }}
        initial={{ width: 0 }}
        animate={{ width: animated ? `${pct}%` : `${pct}%` }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
    </div>
  )
}
