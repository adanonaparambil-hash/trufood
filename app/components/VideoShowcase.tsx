'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'

/* ─── Custom hook: formatted time ───────────────────────────────────────── */
function fmtTime(s: number) {
  if (!isFinite(s)) return '0:00'
  const m = Math.floor(s / 60)
  const ss = Math.floor(s % 60)
  return `${m}:${ss.toString().padStart(2, '0')}`
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function VideoShowcase() {
  const sectionRef  = useRef<HTMLElement>(null)
  const videoRef    = useRef<HTMLVideoElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  const inView = useInView(sectionRef, { once: true, margin: '-120px' })

  /* scroll-parallax for the container scale */
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const scaleVal   = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.88, 1, 1, 0.94])
  const opacityVal = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0])

  const [playing,  setPlaying]  = useState(false)
  const [muted,    setMuted]    = useState(true)
  const [progress, setProgress] = useState(0)       // 0–100
  const [current,  setCurrent]  = useState(0)
  const [duration, setDuration] = useState(0)
  const [showCtrl, setShowCtrl] = useState(true)
  const [hovered,  setHovered]  = useState(false)
  const ctrlTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* autoplay once in view */
  useEffect(() => {
    if (inView && videoRef.current) {
      videoRef.current.load()
      videoRef.current.play().then(() => setPlaying(true)).catch(() => {})
    }
  }, [inView]) // eslint-disable-line react-hooks/exhaustive-deps

  /* hide controls after 3s of inactivity */
  const resetCtrlTimer = useCallback(() => {
    setShowCtrl(true)
    if (ctrlTimer.current) clearTimeout(ctrlTimer.current)
    ctrlTimer.current = setTimeout(() => {
      if (playing) setShowCtrl(false)
    }, 3000)
  }, [playing])

  useEffect(() => { resetCtrlTimer() }, [playing, resetCtrlTimer])
  useEffect(() => () => { if (ctrlTimer.current) clearTimeout(ctrlTimer.current) }, [])

  const togglePlay = () => {
    if (!videoRef.current) return
    if (playing) { videoRef.current.pause(); setPlaying(false) }
    else         { videoRef.current.play().then(() => setPlaying(true)).catch(() => {}) }
    resetCtrlTimer()
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !muted
    setMuted(m => !m)
    resetCtrlTimer()
  }

  const onTimeUpdate = () => {
    const v = videoRef.current
    if (!v || !v.duration) return
    setCurrent(v.currentTime)
    setProgress((v.currentTime / v.duration) * 100)
  }

  const onLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration)
  }

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressRef.current
    const v   = videoRef.current
    if (!bar || !v) return
    const rect = bar.getBoundingClientRect()
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    v.currentTime = pct * v.duration
    resetCtrlTimer()
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ background: '#030503', padding: '0 0 0 0' }}
    >
      {/* ── Top ambient gradient ── */}
      <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(140,159,78,0.28), transparent)' }} />

      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(140,159,78,0.055) 0%, transparent 60%)' }} />

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 pt-20 pb-10"
      >
        <div className="flex items-end justify-between flex-wrap gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8" style={{ background: 'rgba(140,159,78,0.65)' }} />
              <span className="text-[10px] font-bold tracking-[0.26em] uppercase"
                style={{ color: 'rgba(140,159,78,0.72)' }}>
                The Farm in Motion
              </span>
            </div>
            <h2
              className="font-serif font-bold leading-[0.94]"
              style={{
                fontSize: 'clamp(36px, 5.5vw, 72px)',
                background: 'linear-gradient(138deg, rgba(255,255,255,0.95) 0%, rgba(200,218,142,0.82) 55%, rgba(140,159,78,0.65) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.03em',
              }}
            >
              See How<br />We Grow
            </h2>
          </div>

          {/* Stats row */}
          <div className="flex gap-8 items-end pb-1">
            {[
              { n: '95%', l: 'Less Water' },
              { n: '10×', l: 'Yield'      },
              { n: '0',   l: 'Pesticides' },
            ].map(({ n, l }) => (
              <div key={l} className="text-right">
                <div className="font-serif font-bold leading-none mb-1"
                  style={{ fontSize: 'clamp(20px, 2.8vw, 34px)', color: 'rgba(168,196,110,0.88)' }}>
                  {n}
                </div>
                <div className="text-[9px] tracking-[0.16em] uppercase"
                  style={{ color: 'rgba(255,255,255,0.22)' }}>
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Video container ── */}
      <motion.div
        style={{ scale: scaleVal, opacity: opacityVal }}
        className="relative w-full"
      >
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto"
          style={{
            maxWidth: 1440,
            padding: '0 16px 16px',
          }}
        >
          {/* Outer glow ring */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: 28,
              boxShadow: '0 0 120px rgba(140,159,78,0.1), 0 60px 160px rgba(0,0,0,0.7)',
              margin: '0 16px 16px',
            }}
          />

          {/* Video wrapper */}
          <div
            className="relative overflow-hidden w-full"
            style={{
              borderRadius: 24,
              border: '1px solid rgba(140,159,78,0.18)',
              aspectRatio: '16/9',
              background: '#020402',
              cursor: 'none',
            }}
            onMouseMove={resetCtrlTimer}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={togglePlay}
          >
            {/* The video */}
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              playsInline
              muted
              loop
              preload="metadata"
              poster="/tech-tunnel.jpeg"
              onTimeUpdate={onTimeUpdate}
              onLoadedMetadata={onLoadedMetadata}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            >
              <source src="/TruFudFarmsVedio.mp4" type="video/mp4" />
            </video>

            {/* Vignette overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 55%, rgba(2,4,2,0.55) 100%)',
              }}
            />
            {/* Edge gradient bottom */}
            <div
              className="absolute bottom-0 inset-x-0 h-36 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(2,4,2,0.65), transparent)' }}
            />
            {/* Edge gradient top */}
            <div
              className="absolute top-0 inset-x-0 h-20 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, rgba(2,4,2,0.4), transparent)' }}
            />

            {/* ── Corner brand badge ── */}
            <div
              className="absolute top-5 left-5 flex items-center gap-2.5 px-3.5 py-2 rounded-full pointer-events-none"
              style={{
                background: 'rgba(3,5,3,0.75)',
                backdropFilter: 'blur(14px)',
                border: '1px solid rgba(140,159,78,0.2)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#8C9F4E', boxShadow: '0 0 6px #8C9F4E' }}
              />
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase"
                style={{ color: 'rgba(255,255,255,0.7)' }}>
                TruFud Farms
              </span>
              {playing && (
                <span className="text-[8px] tracking-[0.14em] uppercase"
                  style={{ color: 'rgba(140,159,78,0.7)' }}>
                  · Live
                </span>
              )}
            </div>

            {/* ── Center play/pause overlay ── */}
            <AnimatePresence>
              {(showCtrl || !playing || hovered) && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <AnimatePresence mode="wait">
                    {!playing ? (
                      /* Big play button — visible when paused */
                      <motion.div
                        key="play-btn"
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="relative flex items-center justify-center"
                        style={{ width: 90, height: 90 }}
                      >
                        {/* Pulsing ring */}
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{ border: '1px solid rgba(140,159,78,0.35)' }}
                          animate={{ scale: [1, 1.22, 1], opacity: [0.6, 0, 0.6] }}
                          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
                        />
                        {/* Button circle */}
                        <div
                          className="relative flex items-center justify-center rounded-full"
                          style={{
                            width: 80, height: 80,
                            background: 'rgba(140,159,78,0.18)',
                            backdropFilter: 'blur(18px)',
                            border: '1px solid rgba(140,159,78,0.5)',
                            boxShadow: '0 0 50px rgba(140,159,78,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
                          }}
                        >
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="rgba(255,255,255,0.92)" style={{ marginLeft: 3 }}>
                            <polygon points="5,3 19,12 5,21" />
                          </svg>
                        </div>
                      </motion.div>
                    ) : (
                      /* Small pause icon — shows briefly when playing + hovered */
                      <motion.div
                        key="pause-btn"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.7 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex items-center justify-center rounded-full"
                        style={{
                          width: 60, height: 60,
                          background: 'rgba(5,8,5,0.6)',
                          backdropFilter: 'blur(12px)',
                          border: '1px solid rgba(255,255,255,0.15)',
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.85)">
                          <rect x="5" y="3" width="4" height="18" rx="1" />
                          <rect x="15" y="3" width="4" height="18" rx="1" />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Bottom controls bar ── */}
            <AnimatePresence>
              {(showCtrl || !playing) && (
                <motion.div
                  className="absolute bottom-0 inset-x-0 px-5 pb-5 pt-12"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.3 }}
                  onClick={e => e.stopPropagation()}
                >
                  {/* Progress bar */}
                  <div
                    ref={progressRef}
                    className="w-full mb-3 cursor-pointer group"
                    style={{ height: 3 }}
                    onClick={seekTo}
                  >
                    <div
                      className="relative w-full h-full rounded-full overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.15)' }}
                    >
                      <motion.div
                        className="absolute left-0 top-0 h-full rounded-full"
                        style={{
                          width: `${progress}%`,
                          background: 'linear-gradient(90deg, #8C9F4E, #c8da8e)',
                          boxShadow: '0 0 8px rgba(140,159,78,0.6)',
                        }}
                        transition={{ duration: 0.1 }}
                      />
                      {/* Scrubber dot */}
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{
                          left: `calc(${progress}% - 6px)`,
                          background: '#c8da8e',
                          boxShadow: '0 0 8px rgba(140,159,78,0.8)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Controls row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Play/Pause */}
                      <button
                        onClick={togglePlay}
                        className="flex items-center justify-center rounded-full transition-transform duration-200 hover:scale-110"
                        style={{
                          width: 36, height: 36,
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          color: 'rgba(255,255,255,0.88)',
                        }}
                      >
                        {playing ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="5" y="3" width="4" height="18" rx="1" />
                            <rect x="15" y="3" width="4" height="18" rx="1" />
                          </svg>
                        ) : (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 1 }}>
                            <polygon points="5,3 19,12 5,21" />
                          </svg>
                        )}
                      </button>

                      {/* Time */}
                      <span className="font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        {fmtTime(current)} / {fmtTime(duration)}
                      </span>
                    </div>

                    {/* Mute toggle */}
                    <button
                      onClick={toggleMute}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 hover:scale-105"
                      style={{
                        background: muted ? 'rgba(255,255,255,0.06)' : 'rgba(140,159,78,0.18)',
                        border: `1px solid ${muted ? 'rgba(255,255,255,0.1)' : 'rgba(140,159,78,0.4)'}`,
                        color: muted ? 'rgba(255,255,255,0.45)' : '#a8c46e',
                      }}
                    >
                      {muted ? (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
                          <line x1="23" y1="9" x2="17" y2="15" />
                          <line x1="17" y1="9" x2="23" y2="15" />
                        </svg>
                      ) : (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        </svg>
                      )}
                      <span className="text-[9px] font-semibold tracking-[0.1em] uppercase">
                        {muted ? 'Sound Off' : 'Sound On'}
                      </span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Top-right corner: fullscreen hint */}
            <AnimatePresence>
              {(showCtrl || !playing) && (
                <motion.div
                  className="absolute top-5 right-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    onClick={() => {
                      const v = videoRef.current
                      if (v && document.fullscreenEnabled) {
                        v.requestFullscreen?.()
                      }
                    }}
                    className="flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110"
                    style={{
                      width: 36, height: 36,
                      background: 'rgba(3,5,3,0.7)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: 'rgba(255,255,255,0.55)',
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Bottom caption bar ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.7 }}
        className="flex items-center justify-center gap-6 py-10"
      >
        <div className="h-px flex-1 max-w-24"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(140,159,78,0.2))' }} />
        {[
          'Zero Pesticides',
          '·',
          'Year-Round Harvest',
          '·',
          'Precision Hydroponics',
        ].map((t, i) => (
          <span
            key={i}
            className={t === '·' ? '' : 'text-[10px] tracking-[0.22em] uppercase'}
            style={{ color: t === '·' ? 'rgba(140,159,78,0.35)' : 'rgba(255,255,255,0.2)', fontSize: t === '·' ? 14 : undefined }}
          >
            {t}
          </span>
        ))}
        <div className="h-px flex-1 max-w-24"
          style={{ background: 'linear-gradient(90deg, rgba(140,159,78,0.2), transparent)' }} />
      </motion.div>

      <div className="absolute bottom-0 inset-x-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(140,159,78,0.14), transparent)' }} />
    </section>
  )
}
