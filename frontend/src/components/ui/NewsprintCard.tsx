import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode, CSSProperties } from 'react'

// ── NewsprintCard ─────────────────────────────────────────────────────────────
interface NewsprintCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  className?: string
  hardShadow?: boolean
  inverted?: boolean
}

export function NewsprintCard({
  children,
  className = '',
  hardShadow = false,
  inverted = false,
  ...props
}: NewsprintCardProps) {
  const base = inverted ? 'np-card-inverted' : hardShadow ? 'np-card-hard' : 'np-card'
  return (
    <motion.div
      className={`${base} ${className}`}
      whileHover={!hardShadow ? { boxShadow: '4px 4px 0px 0px #111111', x: -2, y: -2 } : undefined}
      transition={{ duration: 0.1 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Keep GlassCard as an alias for backward compatibility
export { NewsprintCard as GlassCard }

// ── EditorialBadge ────────────────────────────────────────────────────────────
interface EditorialBadgeProps {
  children: ReactNode
  variant?: 'default' | 'inverted' | 'red'
  className?: string
}

export function EditorialBadge({ children, variant = 'default', className = '' }: EditorialBadgeProps) {
  const cls =
    variant === 'inverted' ? 'np-badge-inverted' :
    variant === 'red'      ? 'np-badge-red'      : 'np-badge'
  return <span className={`${cls} ${className}`}>{children}</span>
}

// Keep GlowBadge as alias
export { EditorialBadge as GlowBadge }

// ── ScoreGauge ────────────────────────────────────────────────────────────────
interface ScoreGaugeProps {
  score: number
  size?: number
  label?: string
  color?: string
}

export function ScoreGauge({ score, size = 120, label }: ScoreGaugeProps) {
  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="var(--muted)" strokeWidth={6}
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="var(--ink)" strokeWidth={6}
          strokeLinecap="square"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <motion.span
          style={{
            fontSize: size * 0.22,
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: 'var(--ink)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}
        </motion.span>
        {label && (
          <span style={{ fontSize: size * 0.1, color: 'var(--neutral-500)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
            {label}
          </span>
        )}
      </div>
    </div>
  )
}

// ── ProgressBar ───────────────────────────────────────────────────────────────
interface ProgressBarProps {
  value: number
  max?: number
  color?: string
  className?: string
  height?: number
  animated?: boolean
}

export function ProgressBar({ value, max = 100, color = 'var(--ink)', className = '', height = 4, animated = true }: ProgressBarProps) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div
      className={className}
      style={{
        height,
        background: 'var(--muted)',
        overflow: 'hidden',
        border: 'none',
      }}
    >
      <motion.div
        style={{ height: '100%', background: color }}
        initial={{ width: 0 }}
        animate={{ width: animated ? `${pct}%` : `${pct}%` }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
    </div>
  )
}

// ── TypewriterText ────────────────────────────────────────────────────────────
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

// ── AnimatedCounter ────────────────────────────────────────────────────────────
interface AnimatedCounterProps {
  value: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
  style?: CSSProperties
}

export function AnimatedCounter({ value, suffix = '', prefix = '', className = '', style }: AnimatedCounterProps) {
  return (
    <motion.span
      className={className}
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {prefix}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {value}
      </motion.span>
      {suffix}
    </motion.span>
  )
}
