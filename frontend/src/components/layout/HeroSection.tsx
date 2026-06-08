import { useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, GitBranch, ChevronDown } from 'lucide-react'

/* ─────────────────────────────────────────────────────────
   Config — exact values from the Mainframe reference prompt
───────────────────────────────────────────────────────── */
const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4'

/** Fraction multiplier per pixel: higher = snappier scrub */
const SENSITIVITY = 0.8

/* ─────────────────────────────────────────────────────────
   HeroSection — full-screen immersive, mouse-scrub video
   Mouse logic: window-level listener (Mainframe pattern)
───────────────────────────────────────────────────────── */
export function HeroSection() {
  /* ── Scroll parallax ────────────────────────────────── */
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0])
  const heroY       = useTransform(scrollY, [0, 600], [0, -80])

  /* ── Scrub state — all refs, zero re-renders ────────── */
  const videoRef    = useRef<HTMLVideoElement>(null)
  const prevXRef    = useRef<number | null>(null)
  const targetTime  = useRef<number>(0)
  const isSeeking   = useRef(false)

  /* ── Seek chain (Mainframe pattern) ─────────────────── */
  /*
    onSeeked fires when the browser finishes decoding a frame.
    If targetTime has moved since we last seeked, issue another seek.
    This creates a tight chase loop with zero seek-flooding:
    one seek completes → immediately check if more movement queued → seek again.
  */
  const onSeeked = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    isSeeking.current = false

    if (Math.abs(video.currentTime - targetTime.current) > 0.001) {
      isSeeking.current  = true
      video.currentTime  = targetTime.current
    }
  }, [])

  /* ── Window-level mousemove (Mainframe pattern) ─────── */
  /*
    window listener captures every OS pointer event directly.
    React's onMouseMove goes through synthetic event batching
    and can be throttled — a window listener never misses a tick.

    Formula (exact from Mainframe prompt):
      offset = (delta / window.innerWidth) * SENSITIVITY * video.duration
  */
  const onMouseMove = useCallback((e: MouseEvent) => {
    const video = videoRef.current
    if (!video || !video.duration) return

    if (prevXRef.current === null) {
      prevXRef.current = e.clientX
      return
    }

    const delta      = e.clientX - prevXRef.current
    prevXRef.current = e.clientX

    if (delta === 0) return

    const offset = (delta / window.innerWidth) * SENSITIVITY * video.duration

    // Clamp between 0 and duration
    targetTime.current = Math.min(
      Math.max(targetTime.current + offset, 0),
      video.duration,
    )

    // Kick off seek only if decoder is idle right now
    if (!isSeeking.current) {
      isSeeking.current = true
      video.currentTime = targetTime.current
    }
  }, [])

  /* ── Mount / unmount ────────────────────────────────── */
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Eagerly fetch metadata so duration is ready before first mousemove
    video.load()

    video.addEventListener('seeked', onSeeked)
    window.addEventListener('mousemove', onMouseMove)

    return () => {
      video.removeEventListener('seeked', onSeeked)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [onSeeked, onMouseMove])

  /* ── Render — GitInsight AI theme unchanged ─────────── */
  return (
    <motion.section
      style={{ opacity: heroOpacity, y: heroY }}
      className="hero-section"
    >
      {/* ── Background Video ─────────────────────────── */}
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        muted
        playsInline
        preload="auto"
        className="hero-video"
      />

      {/* Gradient overlay */}
      <div className="hero-overlay" />

      {/* ── Content ──────────────────────────────────── */}
      <div className="hero-content">
        <div className="hero-left">

          {/* Intro label */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hero-intro-label"
            aria-hidden="true"
          >
            <span className="np-badge-red" style={{ marginRight: 10, filter: 'none' }}>
              Breaking
            </span>
            <span>AI-Powered Developer Intelligence Platform</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="hero-headline"
          >
            Transform<br />
            Your GitHub<br />
            <em>Into Career</em><br />
            Intelligence.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hero-subtext"
          >
            AI-powered portfolio analysis, recruiter insights, career readiness
            scores, and developer growth intelligence. Built for developers who
            take their career seriously.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="hero-cta-row"
          >
            <Link to="/register" className="hero-btn-primary">
              <GitBranch size={16} />
              Analyze My GitHub — Free
              <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="hero-btn-secondary">
              Sign In to Dashboard
            </Link>
          </motion.div>

          {/* Checklist */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="hero-checklist"
          >
            {['No credit card', 'Free to start', 'GitHub OAuth', 'Private repos optional'].map(
              (item) => (
                <span key={item} className="hero-check-item">✓ {item}</span>
              )
            )}
          </motion.div>
        </div>

        {/* Right col — transparent so robot is visible */}
        <div className="hero-right" aria-hidden="true" />
      </div>

      {/* Scroll cue */}
      <motion.div
        className="hero-scroll-cue"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown size={24} color="rgba(255,255,255,0.5)" />
      </motion.div>
    </motion.section>
  )
}
