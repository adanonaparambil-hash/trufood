'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Link from 'next/link'
import Navbar from '../components/Navbar'

/* ─────────────────────────────────────────────────────────────────────────────
   NAV
───────────────────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────────────────────
   CHROMATIC ABERRATION CANVAS OVERLAY
───────────────────────────────────────────────────────────────────────────── */
function ChromaticAberration({ intensity }: { intensity: number }) {
  if (intensity < 0.01) return null
  const px = intensity * 12
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{
        mixBlendMode: 'screen',
        opacity: Math.min(intensity * 0.7, 0.55),
      }}
    >
      {/* Red channel shift */}
      <div className="absolute inset-0" style={{
        background: 'rgba(255,0,0,0.08)',
        transform: `translate(${px}px, 0)`,
      }} />
      {/* Blue channel shift */}
      <div className="absolute inset-0" style={{
        background: 'rgba(0,0,255,0.08)',
        transform: `translate(${-px}px, 0)`,
      }} />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   NOISE OVERLAY
───────────────────────────────────────────────────────────────────────────── */
function NoiseOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9997]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px',
        opacity: 0.028,
        mixBlendMode: 'overlay',
      }}
    />
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   BLOOM DOTS (LED effect)
───────────────────────────────────────────────────────────────────────────── */
function BloomLEDs({ visible }: { visible: boolean }) {
  const dots = [
    { x: '22%', y: '35%', size: 3, delay: 0 },
    { x: '35%', y: '28%', size: 2, delay: 0.3 },
    { x: '48%', y: '42%', size: 4, delay: 0.6 },
    { x: '61%', y: '31%', size: 2, delay: 0.2 },
    { x: '74%', y: '38%', size: 3, delay: 0.8 },
    { x: '28%', y: '58%', size: 2, delay: 0.4 },
    { x: '55%', y: '62%', size: 3, delay: 0.1 },
    { x: '68%', y: '55%', size: 2, delay: 0.7 },
    { x: '80%', y: '45%', size: 4, delay: 0.5 },
    { x: '15%', y: '50%', size: 2, delay: 0.9 },
  ]
  return (
    <div className="absolute inset-0 pointer-events-none z-10" style={{ opacity: visible ? 1 : 0, transition: 'opacity 1.2s ease' }}>
      {dots.map((d, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: d.x, top: d.y,
            width: d.size * 2, height: d.size * 2,
            background: '#8C9F4E',
            boxShadow: `0 0 ${d.size * 6}px ${d.size * 3}px rgba(140,159,78,0.6), 0 0 ${d.size * 20}px ${d.size * 8}px rgba(140,159,78,0.2)`,
          }}
          animate={{ opacity: [0.6, 1, 0.6], scale: [0.9, 1.1, 0.9] }}
          transition={{ repeat: Infinity, duration: 2 + d.delay, delay: d.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   SPATIAL TOOLTIP
───────────────────────────────────────────────────────────────────────────── */
/* ─────────────────────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function TechnologyPage() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress, scrollY } = useScroll({ target: wrapperRef, offset: ['start start', 'end end'] })

  // Lerped (kinetic) scroll progress — heavy interpolation
  const lerpedProgress = useSpring(scrollYProgress, { stiffness: 38, damping: 22, mass: 1.2 })

  // Chromatic aberration — fires on fast scroll, decays
  const [chromaIntensity, setChromaIntensity] = useState(0)
  const lastScrollY = useRef(0)
  const chromaTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const unsub = scrollY.on('change', (v) => {
      const delta = Math.abs(v - lastScrollY.current)
      lastScrollY.current = v
      const intensity = Math.min(delta / 60, 1)
      if (intensity > 0.05) {
        setChromaIntensity(intensity)
        if (chromaTimerRef.current) clearTimeout(chromaTimerRef.current)
        chromaTimerRef.current = setTimeout(() => {
          setChromaIntensity(0)
        }, 320)
      }
    })
    return () => unsub()
  }, [scrollY])

  // Section visibility derived from lerped progress
  const [prog, setProg] = useState(0)
  useEffect(() => {
    const unsub = lerpedProgress.on('change', setProg)
    return () => unsub()
  }, [lerpedProgress])

  // Section 1: 0–20%  | Section 2: 25–45%  | Section 3: 55–75%  | Section 4: 80–100%
  const sec1Active = prog >= 0 && prog <= 0.22
  const sec2Active = prog >= 0.22 && prog <= 0.52
  const sec3Active = prog >= 0.52 && prog <= 0.78
  const sec4Active = prog >= 0.78

  // Image crossfade: tunnel → plants → matrix
  const tunnelOpacity = useTransform(lerpedProgress, [0, 0.18, 0.45, 0.55], [1, 1, 1, 0])
  const matrixOpacity = useTransform(lerpedProgress, [0.48, 0.58, 1.0], [0, 1, 1])

  // Z-space camera: scale simulates moving forward into tunnel
  const tunnelScale = useTransform(lerpedProgress, [0, 0.45], [1.0, 1.35])
  const tunnelY = useTransform(lerpedProgress, [0, 0.45], ['0%', '-8%'])

  // Matrix rotation in section 4
  const matrixRotate = useTransform(lerpedProgress, [0.78, 1.0], [0, 6])
  const matrixScale = useTransform(lerpedProgress, [0.78, 1.0], [1.0, 1.06])

  // Section 1 text
  const s1Opacity = useTransform(lerpedProgress, [0, 0.16, 0.22], [1, 1, 0])
  const s1Y       = useTransform(lerpedProgress, [0, 0.16, 0.22], [0, 0, -20])

  // Section 2 text
  const s2Opacity = useTransform(lerpedProgress, [0.24, 0.30, 0.42, 0.50], [0, 1, 1, 0])
  const s2Y       = useTransform(lerpedProgress, [0.24, 0.30, 0.42, 0.50], [28, 0, 0, -20])

  // Section 4 footer
  const s4Opacity = useTransform(lerpedProgress, [0.82, 0.90], [0, 1])

  return (
    <div ref={wrapperRef} style={{ height: '600vh', background: '#050805' }}>
      <NoiseOverlay />
      <ChromaticAberration intensity={chromaIntensity} />
      <Navbar activePage="Technology" />

      {/* ── STICKY VIEWPORT ── */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">

        {/* ── LAYER 1: TUNNEL IMAGE (Sections 1 & 2) ── */}
        <motion.div
          className="absolute inset-0"
          style={{ opacity: tunnelOpacity, scale: tunnelScale, y: tunnelY, transformOrigin: 'center center' }}
        >
          <img
            src="/tech-tunnel.jpeg"
            alt="Hydroponic tunnel"
            className="w-full h-full object-cover object-center"
            draggable={false}
          />
          {/* Depth-of-field blur on edges */}
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse 55% 55% at 50% 50%, transparent 30%, rgba(5,8,5,0.5) 100%)',
          }} />
        </motion.div>

        {/* ── LAYER 2: MATRIX IMAGE (Sections 3 & 4) ── */}
        <motion.div
          className="absolute inset-0"
          style={{ opacity: matrixOpacity, rotate: matrixRotate, scale: matrixScale, transformOrigin: 'center center' }}
        >
          <img
            src="/tech-matrix.jpeg"
            alt="Exploded tech matrix"
            className="w-full h-full object-cover object-center"
            draggable={false}
          />
          <BloomLEDs visible={sec3Active || sec4Active} />
        </motion.div>

        {/* ── GLOBAL OVERLAYS ── */}
        {/* Top vignette */}
        <div className="absolute inset-x-0 top-0 h-40 pointer-events-none z-20"
          style={{ background: 'linear-gradient(to bottom, rgba(5,8,5,0.75), transparent)' }} />
        {/* Bottom vignette */}
        <div className="absolute inset-x-0 bottom-0 h-48 pointer-events-none z-20"
          style={{ background: 'linear-gradient(to top, #050805, transparent)' }} />
        {/* Side vignettes */}
        <div className="absolute inset-y-0 left-0 w-32 pointer-events-none z-20"
          style={{ background: 'linear-gradient(to right, rgba(5,8,5,0.6), transparent)' }} />
        <div className="absolute inset-y-0 right-0 w-32 pointer-events-none z-20"
          style={{ background: 'linear-gradient(to left, rgba(5,8,5,0.6), transparent)' }} />

        {/* ── SECTION 1 TEXT: "Our Technology" ── */}
        <motion.div
          style={{ opacity: s1Opacity, y: s1Y }}
          className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none px-6 text-center"
        >
          <motion.span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-[0.28em] uppercase mb-6"
            style={{ background: 'rgba(140,159,78,0.12)', color: '#8C9F4E', border: '1px solid rgba(140,159,78,0.25)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#8C9F4E' }} />
            Precision Farming
          </motion.span>
          <h1
            className="font-serif font-bold leading-[0.95] mb-6"
            style={{ fontSize: 'clamp(52px, 9vw, 120px)', color: 'rgba(255,255,255,0.95)' }}
          >
            Our<br />
            <span style={{ color: '#8C9F4E', fontStyle: 'italic' }}>Technology.</span>
          </h1>
          <p className="text-lg md:text-xl max-w-[560px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.82)' }}>
            Engineering a new era of agriculture — where technology and nature operate in perfect harmony.
          </p>
          {/* Scroll hint */}
          <motion.div
            className="flex items-center gap-3 mt-12"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(140,159,78,0.65)" strokeWidth="2">
                <path d="M12 5v14M5 13l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
            <span className="text-[9px] tracking-[0.3em] uppercase" style={{ color: 'rgba(255,255,255,0.28)' }}>Scroll to explore</span>
          </motion.div>
        </motion.div>

        {/* ── SECTION 2 TEXT: "Vertical Hydroponic Modules" (left-third) ── */}
        <motion.div
          style={{ opacity: s2Opacity, y: s2Y }}
          className="absolute inset-y-0 left-0 z-30 pointer-events-none flex flex-col justify-center px-10 md:px-16"
        >
          <div
            style={{
              maxWidth: 480,
              background: 'rgba(5,8,5,0.55)',
              backdropFilter: 'blur(20px)',
              borderRadius: 24,
              border: '1px solid rgba(140,159,78,0.12)',
              padding: '36px 40px',
            }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-semibold tracking-[0.28em] uppercase mb-5"
              style={{ background: 'rgba(140,159,78,0.1)', color: '#8C9F4E', border: '1px solid rgba(140,159,78,0.2)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#8C9F4E' }} />
              System Design
            </span>
            <h2
              className="font-serif font-bold leading-tight mb-5"
              style={{ fontSize: 'clamp(32px, 4vw, 58px)', color: 'rgba(255,255,255,0.97)' }}
            >
              Vertical<br />Hydroponic<br />
              <span style={{ color: '#8C9F4E', fontStyle: 'italic' }}>Modules</span>
            </h2>
            <p className="text-base md:text-lg leading-relaxed mb-7" style={{ color: 'rgba(255,255,255,0.82)' }}>
              Our vertical hydroponic modules are designed for fast assembly, ease of use, and versatility. Utilizing specialized light recipes and NFT hybrid irrigation modes, they are perfect for efficient vertical farming.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { val: 'NFT', label: 'Hybrid irrigation' },
                { val: 'LED', label: 'Light recipes' },
                { val: 'Fast', label: 'Assembly time' },
                { val: '365', label: 'Days of operation' },
              ].map(({ val, label }) => (
                <div key={val} className="p-3.5 rounded-xl"
                  style={{ background: 'rgba(140,159,78,0.09)', border: '1px solid rgba(140,159,78,0.18)' }}>
                  <p className="font-serif text-xl font-black mb-0.5" style={{ color: '#8C9F4E' }}>{val}</p>
                  <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.55)' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── SECTION 3: Three floating info cards ── */}

        {/* Card 1 — top left */}
        <motion.div
          className="absolute z-30 pointer-events-none"
          style={{ top: '12%', left: '4%', width: 300 }}
          initial={{ opacity: 0, x: -20 }}
          animate={sec3Active ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.6, delay: 0, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{ background: 'rgba(4,8,4,0.85)', backdropFilter: 'blur(24px)', border: '1px solid rgba(140,159,78,0.28)', borderRadius: 20, padding: '24px 28px', boxShadow: '0 24px 64px rgba(0,0,0,0.65)' }}>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-2 h-2 rounded-full" style={{ background: '#8C9F4E', boxShadow: '0 0 8px #8C9F4E' }} />
              <h4 className="text-[15px] font-bold tracking-wide" style={{ color: '#8C9F4E' }}>Easy to Use</h4>
            </div>
            <p className="text-[13px] leading-[1.75] mb-4" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Our automated water and fertilizer system integrates seamlessly with the water supply, providing intelligent control over irrigation.
            </p>
            <div className="h-px mb-3" style={{ background: 'rgba(140,159,78,0.2)' }} />
            <ul className="flex flex-col gap-2">
              {['Automated scheduling for water supply', 'Precise control of fertilizer concentration', 'Efficient water usage'].map(b => (
                <li key={b} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'rgba(140,159,78,0.6)' }} />
                  <span className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Card 2 — top right */}
        <motion.div
          className="absolute z-30 pointer-events-none"
          style={{ top: '10%', right: '4%', width: 300 }}
          initial={{ opacity: 0, x: 20 }}
          animate={sec3Active ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{ background: 'rgba(4,8,4,0.85)', backdropFilter: 'blur(24px)', border: '1px solid rgba(140,159,78,0.28)', borderRadius: 20, padding: '24px 28px', boxShadow: '0 24px 64px rgba(0,0,0,0.65)' }}>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-2 h-2 rounded-full" style={{ background: '#8C9F4E', boxShadow: '0 0 8px #8C9F4E' }} />
              <h4 className="text-[15px] font-bold tracking-wide" style={{ color: '#8C9F4E' }}>Configurable Spacing</h4>
            </div>
            <p className="text-[13px] leading-[1.75] mb-4" style={{ color: 'rgba(255,255,255,0.8)' }}>
              The automated system allows for flexible spacing configurations, ensuring optimal growth conditions for every crop type.
            </p>
            <div className="h-px mb-3" style={{ background: 'rgba(140,159,78,0.2)' }} />
            <ul className="flex flex-col gap-2">
              {['Pumps for water and fertilizer delivery', 'Adjustable fertilizer absorption ratios'].map(b => (
                <li key={b} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'rgba(140,159,78,0.6)' }} />
                  <span className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Card 3 — bottom center-right */}
        <motion.div
          className="absolute z-30 pointer-events-none"
          style={{ bottom: '10%', right: '4%', width: 300 }}
          initial={{ opacity: 0, y: 20 }}
          animate={sec3Active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{ background: 'rgba(4,8,4,0.85)', backdropFilter: 'blur(24px)', border: '1px solid rgba(140,159,78,0.28)', borderRadius: 20, padding: '24px 28px', boxShadow: '0 24px 64px rgba(0,0,0,0.65)' }}>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-2 h-2 rounded-full" style={{ background: '#8C9F4E', boxShadow: '0 0 8px #8C9F4E' }} />
              <h4 className="text-[15px] font-bold tracking-wide" style={{ color: '#8C9F4E' }}>Adjustable Water Level</h4>
            </div>
            <p className="text-[13px] leading-[1.75] mb-4" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Our NFT system offers gravity-driven water circulation, adjustable between shallow and deep flow for precision control.
            </p>
            <div className="h-px mb-3" style={{ background: 'rgba(140,159,78,0.2)' }} />
            <ul className="flex flex-col gap-2">
              {['Automated tidal irrigation control', 'Scheduled and manual irrigation options', 'Energy-efficient LED lighting with automatic control'].map(b => (
                <li key={b} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'rgba(140,159,78,0.6)' }} />
                  <span className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* ── SECTION 4: Footer ── */}
        <motion.div
          style={{ opacity: s4Opacity }}
          className="absolute bottom-10 right-10 z-40 pointer-events-auto flex flex-col items-end gap-3"
        >
          <p className="text-[9px] tracking-[0.3em] uppercase mb-1" style={{ color: 'rgba(140,159,78,0.5)' }}>Navigate</p>
          <div className="flex flex-col items-end gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <Link href="/" className="hover:text-white/60 transition-colors">Sitemap</Link>
            <Link href="#" className="hover:text-white/60 transition-colors">Head Office — Muscat, Oman</Link>
            <Link href="#" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
          </div>
          <div className="flex items-center gap-2 mt-2 text-[10px]" style={{ color: 'rgba(255,255,255,0.18)' }}>
            <span>© 2026 Trufud Trading SPC</span>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#8C9F4E', boxShadow: '0 0 6px #8C9F4E' }} />
          </div>
        </motion.div>

        {/* ── SECTION 4: Closing statement ── */}
        <motion.div
          style={{ opacity: s4Opacity }}
          className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none px-6 text-center"
        >
          <p className="font-serif font-bold leading-[1.05] mb-6"
            style={{ fontSize: 'clamp(28px, 5vw, 68px)', color: 'rgba(255,255,255,0.9)' }}>
            The future of food<br />
            <span style={{ color: '#8C9F4E', fontStyle: 'italic' }}>is already growing.</span>
          </p>
          <p className="text-sm md:text-base max-w-[440px] mx-auto leading-relaxed mb-8"
            style={{ color: 'rgba(255,255,255,0.38)' }}>
            From seed to shelf — our integrated technology stack gives Omani agriculture a competitive edge on the global stage.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto">
            <Link href="/about"
              className="inline-flex items-center gap-2.5 px-7 py-3 rounded-xl font-semibold text-sm"
              style={{ background: 'linear-gradient(135deg, #8C9F4E, #5c6b2e)', color: '#fff', boxShadow: '0 0 32px rgba(140,159,78,0.22)' }}>
              Learn About Us
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link href="/products"
              className="inline-flex items-center gap-2.5 px-7 py-3 rounded-xl font-semibold text-sm"
              style={{ color: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.15)' }}>
              Our Products
            </Link>
          </div>
        </motion.div>

        {/* ── SCROLL PROGRESS INDICATOR (left edge) ── */}
        <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-3">
          {['Intro', 'Modules', 'Precision', 'Finish'].map((s, i) => {
            const thresholds = [0, 0.25, 0.55, 0.80]
            const active = prog >= thresholds[i] && (i === 3 || prog < thresholds[i + 1])
            return (
              <div key={s} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full transition-all duration-500"
                  style={{ background: active ? '#8C9F4E' : 'rgba(140,159,78,0.2)', boxShadow: active ? '0 0 6px #8C9F4E' : 'none' }} />
                <span className="text-[8px] tracking-widest uppercase transition-opacity duration-300"
                  style={{ color: active ? 'rgba(140,159,78,0.7)' : 'rgba(255,255,255,0.15)' }}>{s}</span>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
