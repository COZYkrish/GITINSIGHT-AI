import { useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, GitBranch, ChevronDown } from 'lucide-react'

/* ─────────────────────────────────────────────────────────
   Video
───────────────────────────────────────────────────────── */
const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4'

/*
  SENSITIVITY — how many seconds of video one full viewport-width
  mouse swipe covers.  Higher = snappier / more reactive.
*/
const SENSITIVITY = 0.8

/*
  LERP_FACTOR — how fast smoothedTime chases targetTime per rAF frame.
  Range 0–1.  0.12 = silky smooth with ~60 ms of perceived lag.
  0.25 = tighter / snappier.  Tune here for "feel".
*/
const LERP_FACTOR = 0.12

/*
  MIN_SEEK_DELTA — only issue a new seek when smoothedTime has moved
  at least this many seconds away from the last seeked position.
  Prevents micro-seeks that stall the decoder.
*/
const MIN_SEEK_DELTA = 0.025

/* ─────────────────────────────────────────────────────────
   Util: fastSeek shim
   fastSeek() jumps to nearest I-frame — much faster than
   precise currentTime on H.264.  Falls back to currentTime.
───────────────────────────────────────────────────────── */
function fastSeek(video: HTMLVideoElement, t: number) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const v = video as any
  if (typeof v.fastSeek === 'function') v.fastSeek(t)
  else video.currentTime = t
}

/* ─────────────────────────────────────────────────────────
   HeroSection
───────────────────────────────────────────────────────── */
export function HeroSection() {
  /* ── Scroll parallax ────────────────────────────────── */
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0])
  const heroY       = useTransform(scrollY, [0, 600], [0, -80])

  /* ── Scrub state — all refs, zero re-renders ────────── */
  const videoRef       = useRef<HTMLVideoElement>(null)
  const prevXRef       = useRef<number | null>(null)

  /*
    Two-tier time system for premium smooth feel:

    targetTime   — where the cursor says the video SHOULD be right now.
                   Updated instantly on every mousemove.  Raw, jittery.

    smoothedTime — lerped value that eases toward targetTime each rAF frame.
                   What the video decoder actually receives.
                   The lerp eliminates the micro-jitter from raw cursor input,
                   creating the "magnetic ease-in" feel of premium product pages.
  */
  const targetTime     = useRef<number>(0)
  const smoothedTime   = useRef<number>(0)
  const isSeeking      = useRef(false)
  const lastSeekedTime = useRef<number>(-1)
  const rafRef         = useRef<number>(0)

  /* ── Seek chain ─────────────────────────────────────── */
  const onSeeked = useCallback(() => {
    isSeeking.current = false
    // rAF loop will pick up the next seek on the very next tick
  }, [])

  /* ── rAF lerp + seek loop ───────────────────────────── */
  /*
    Runs at 60 fps.
    Each frame: advance smoothedTime toward targetTime by LERP_FACTOR.
    If smoothedTime has moved enough AND the decoder is free, issue a seek.
    Result: the video "eases" toward the cursor rather than snapping,
            and the decoder is never interrupted mid-frame.
  */
  const startLoop = useCallback(() => {
    const tick = () => {
      const video = videoRef.current

      if (video && video.duration > 0) {
        // Exponential ease: smoothedTime converges on targetTime
        smoothedTime.current +=
          (targetTime.current - smoothedTime.current) * LERP_FACTOR

        const delta = Math.abs(smoothedTime.current - lastSeekedTime.current)

        if (!isSeeking.current && delta > MIN_SEEK_DELTA) {
          isSeeking.current    = true
          lastSeekedTime.current = smoothedTime.current
          fastSeek(video, smoothedTime.current)
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [])

  /* ── Window-level mousemove ─────────────────────────── */
  /*
    window listener = raw OS pointer events, zero React batching overhead.
    Updates ONLY targetTime — no DOM access, no seek call here.
    The rAF loop reads targetTime and applies it smoothly.
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

    targetTime.current = Math.min(
      Math.max(targetTime.current + offset, 0),
      video.duration,
    )
  }, [])

  /* ── Mount / unmount ────────────────────────────────── */
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.load() // eagerly fetch metadata
    video.addEventListener('seeked', onSeeked)
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    startLoop()

    return () => {
      cancelAnimationFrame(rafRef.current)
      video.removeEventListener('seeked', onSeeked)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [onSeeked, onMouseMove, startLoop])

  /* ── Render ─────────────────────────────────────────── */
  return (
    <motion.section
      style={{ opacity: heroOpacity, y: heroY }}
      className="hero-section"
    >
      {/* Background Video */}
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

      {/* Content */}
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
