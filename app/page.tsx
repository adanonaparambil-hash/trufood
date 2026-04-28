'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import HydroScroll from './components/HydroScroll'
import AboutSection from './components/AboutSection'
import ProductsSection from './components/ProductsSection'
import ProductShowcase from './components/ProductShowcase'

/* ─── Hero slides ─────────────────────────────────────────────────────────── */
/*
 * Slide order:
 *   01 — Ultra_HD_cinematic         (first image in image folder — landing slide)
 *   02 — Stunning_cinematic_aerial  (dark LED tunnel)
 *   03 — Macro_close-up_photography (hydroponic roots — dark teal)
 * Removed: 3D_render_of (last slide, not needed)
 * Removed: Cinematic_split-screen
 */
const SLIDES = [
  {
    id: '01',
    bg: '/LandingPage_imge_first image.jpeg',
    /* Dark cinematic food photography — standard left-heavy overlay */
    overlay:
      'linear-gradient(110deg, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.50) 45%, rgba(0,0,0,0.20) 100%)',
    heading: 'Growing a\nSustainable Food\nSystem for Oman',
    sub: 'At Trufud Trading SPC, we are on a mission to redefine the future of agriculture through innovation, sustainability and quality.',
  },
  {
    id: '02',
    bg: '/Stunning_cinematic_aerial_202604271225.jpeg',
    /* Dark LED tunnel — standard overlay */
    overlay:
      'linear-gradient(110deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.52) 48%, rgba(0,0,0,0.18) 100%)',
    heading: 'Vertical Farming.\nReimagined for Oman.',
    sub: 'State-of-the-art LED hydroponic towers delivering year-round harvests, independent of climate and season.',
  },
  {
    id: '03',
    bg: '/Macro_close-up_photography_202604271227.jpeg',
    /* Dark teal roots — slightly heavier overlay */
    overlay:
      'linear-gradient(110deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.62) 48%, rgba(0,0,0,0.32) 100%)',
    heading: 'Roots in Science.\nGrowth in Purpose.',
    sub: 'Hydroponic systems that deliver 10× yields with 95% less water than traditional agriculture.',
  },
]

/* ─── Nav links ───────────────────────────────────────────────────────────── */
const NAV_LINKS = ['Home', 'About Us', 'Our Solutions', 'Sustainability', 'Products', 'Contact']

/* ─── SVG icons ───────────────────────────────────────────────────────────── */
const IconFacebook = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
  </svg>
)
const IconInstagram = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
  </svg>
)
const IconLinkedin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)
const IconLeaf = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M11 20A7 7 0 014 13c0-4 5-9 7-11 2 2 7 7 7 11a7 7 0 01-7 7z" />
    <path d="M11 20V9" />
  </svg>
)
const IconDrop = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M12 2C6 8.5 4 12.5 4 15a8 8 0 0016 0c0-2.5-2-6.5-8-13z" />
  </svg>
)
const IconBadge = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="12" cy="8" r="6" />
    <path d="M9 21l3-9 3 9M9 21l-4 1 1-5M15 21l4 1-1-5" />
  </svg>
)
const IconPlay = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5,3 19,12 5,21" />
  </svg>
)

/* ─── Navbar ──────────────────────────────────────────────────────────────── */
function Navbar({ activeLink }: { activeLink: number }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(10,12,10,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(18px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : 'none',
      }}
    >
      <nav className="max-w-[1400px] mx-auto px-8 h-[76px] flex items-center justify-between gap-8">

        {/* Logo */}
        <a href="#" className="flex-shrink-0 flex items-center gap-2 group">
          {/* Use real logo — brightness(0) invert(1) converts to white silhouette for dark backgrounds */}
          <img
            src="/logo.png"
            alt="Trufud Trading SPC"
            className="h-9 w-auto"
            style={{ filter: 'brightness(0) invert(1)', opacity: 0.95 }}
          />
          <span
            className="hidden sm:block text-[9px] tracking-[0.22em] uppercase font-medium"
            style={{ color: 'rgba(255,255,255,0.4)', marginTop: '2px', letterSpacing: '0.22em' }}
          >
            Trading SPC
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((l, i) => (
            <li key={l}>
              <Link
                href={l === 'About Us' ? '/about' : l === 'Products' ? '/products' : l === 'Our Solutions' ? '/technology' : '#'}
                className="relative text-sm font-medium transition-colors duration-200 pb-0.5"
                style={{
                  color:
                    i === activeLink
                      ? 'rgba(255,255,255,0.92)'
                      : 'rgba(255,255,255,0.5)',
                }}
              >
                {i === activeLink && (
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: '#7a9a4a' }}
                  />
                )}
                {l}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="#"
          className="hidden lg:inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-200 hover:bg-white/10"
          style={{
            color: 'rgba(255,255,255,0.85)',
            border: '1px solid rgba(255,255,255,0.35)',
          }}
        >
          Get In Touch
        </a>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex flex-col justify-center items-end gap-1.5 w-8 h-8"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {[1, 0.6, 0.8].map((w, i) => (
            <span
              key={i}
              className="block h-0.5 rounded-full transition-all duration-300"
              style={{ width: `${w * 20}px`, background: 'rgba(255,255,255,0.7)' }}
            />
          ))}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="lg:hidden overflow-hidden"
            style={{ background: 'rgba(8,12,8,0.97)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="px-8 py-6 flex flex-col gap-5">
              {NAV_LINKS.map((l) => (
                <Link key={l} href={l === 'About Us' ? '/about' : l === 'Products' ? '/products' : l === 'Our Solutions' ? '/technology' : '#'} className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {l}
                </Link>
              ))}
              <a
                href="#"
                className="text-sm font-medium px-5 py-2.5 rounded-full text-center mt-2"
                style={{ border: '1px solid rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.85)' }}
              >
                Get In Touch
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

/* ─── Hero section ────────────────────────────────────────────────────────── */
function HeroSection() {
  const [active, setActive] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* stable setter — no stale-closure on `active` */
  const goTo = useCallback((idx: number) => {
    setActive((cur) => (idx === cur ? cur : idx))
  }, [])

  /* auto-advance every 6 s, restarts whenever active changes */
  useEffect(() => {
    timerRef.current = setTimeout(
      () => setActive((cur) => (cur + 1) % SLIDES.length),
      6000
    )
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [active])

  const slide = SLIDES[active]

  return (
    <section className="relative w-full h-screen overflow-hidden">

      {/* ── Background images ── */}
      <AnimatePresence initial={false}>
        <motion.div
          key={active}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
          <img
            src={slide.bg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>

      {/* Dark overlays */}
      {/* Per-slide gradient — each slide defines its own overlay strength */}
      <AnimatePresence initial={false}>
        <motion.div
          key={`overlay-${active}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: slide.overlay }}
        />
      </AnimatePresence>
      {/* Top gradient — nav readability */}
      <div
        className="absolute inset-x-0 top-0 h-40 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.65), transparent)' }}
      />
      {/* Bottom gradient — bottom bar readability */}
      <div
        className="absolute inset-x-0 bottom-0 h-48 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}
      />

      {/* ── Main content ── */}
      <div className="relative z-20 h-full flex flex-col justify-between px-8 md:px-16 max-w-[1400px] mx-auto">

        {/* Top spacer (nav height) */}
        <div className="h-[76px]" />

        {/* Hero text — vertical center */}
        <div className="flex-1 flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
              className="max-w-[620px]"
            >
              <h1
                className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-bold leading-[1.08] mb-6 whitespace-pre-line"
                style={{ color: 'rgba(255,255,255,0.95)', textShadow: '0 2px 40px rgba(0,0,0,0.4)' }}
              >
                {slide.heading}
              </h1>

              <p
                className="text-sm md:text-base leading-relaxed mb-8 max-w-[440px]"
                style={{ color: 'rgba(255,255,255,0.65)' }}
              >
                {slide.sub}
              </p>

              <motion.a
                href="#"
                whileHover={{ scale: 1.04, boxShadow: '0 8px 40px rgba(107,140,62,0.45)' }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-200"
                style={{ background: '#6b8c3e', color: '#fff' }}
              >
                Discover More
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.a>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Bottom bar ── */}
        <div className="pb-8">
          {/* Scroll Down */}
          <div className="flex justify-center mb-6">
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] tracking-[0.28em] uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Scroll Down
              </span>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2">
                  <path d="M12 5v14M5 13l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            </div>
          </div>

          {/* Three-column bottom bar */}
          <div className="grid grid-cols-3 items-center gap-4">

            {/* Social */}
            <div className="flex items-center gap-4">
              {[
                { icon: <IconFacebook />, label: 'Facebook' },
                { icon: <IconInstagram />, label: 'Instagram' },
                { icon: <IconLinkedin />, label: 'LinkedIn' },
              ].map(({ icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="transition-all duration-200 hover:scale-110"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                >
                  {icon}
                </a>
              ))}
            </div>

            {/* Feature pillars */}
            <div className="flex items-center justify-center gap-4 md:gap-6">
              {[
                { icon: <IconLeaf />, label: 'Sustainable\nFarming' },
                { icon: <IconDrop />, label: 'Water\nConservation' },
                { icon: <IconBadge />, label: 'Premium\nQuality' },
              ].map(({ icon, label }, i) => (
                <div key={label} className="flex items-center">
                  {i > 0 && (
                    <div className="w-px h-8 mr-4 md:mr-6" style={{ background: 'rgba(255,255,255,0.15)' }} />
                  )}
                  <div className="flex flex-col items-center gap-1 text-center">
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>{icon}</span>
                    <span
                      className="text-[10px] leading-tight whitespace-pre-line text-center"
                      style={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                      {label}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Watch Our Story */}
            <div className="flex justify-end">
              <button
                className="flex items-center gap-3 group"
                aria-label="Watch Our Story"
              >
                <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  Watch Our Story
                </span>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                  style={{
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: 'rgba(255,255,255,0.8)',
                    background: 'rgba(255,255,255,0.08)',
                  }}
                >
                  <IconPlay />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Slide counter — right edge ── */}
      <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-3">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            className="flex flex-col items-center gap-1 group"
            aria-label={`Slide ${s.id}`}
          >
            <span
              className="text-xs font-mono font-semibold transition-all duration-300"
              style={{
                color: i === active ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.28)',
                fontSize: i === active ? '13px' : '11px',
              }}
            >
              {s.id}
            </span>
            {i < SLIDES.length - 1 && (
              <div
                className="w-px transition-all duration-500"
                style={{
                  height: '20px',
                  background:
                    i < active
                      ? '#7a9a4a'
                      : i === active
                      ? 'linear-gradient(to bottom, #7a9a4a, rgba(255,255,255,0.15))'
                      : 'rgba(255,255,255,0.15)',
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Progress bar — bottom of slide counter */}
      <div className="absolute right-6 md:right-10 bottom-32 z-30">
        <div
          className="w-0.5 rounded-full overflow-hidden"
          style={{ height: '60px', background: 'rgba(255,255,255,0.12)' }}
        >
          <motion.div
            className="w-full rounded-full"
            style={{ background: '#7a9a4a', originY: 0 }}
            animate={{ height: `${((active + 1) / SLIDES.length) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </section>
  )
}

/* ─── Animated counter ────────────────────────────────────────────────────── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStarted(true) },
      { threshold: 0.5 }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    const duration = 1800
    const step = Math.ceil(to / (duration / 16))
    let cur = 0
    const t = setInterval(() => {
      cur = Math.min(cur + step, to)
      setCount(cur)
      if (cur >= to) clearInterval(t)
    }, 16)
    return () => clearInterval(t)
  }, [started, to])

  return <span ref={ref}>{count}{suffix}</span>
}

/* ─── Stats ───────────────────────────────────────────────────────────────── */
function Stats() {
  const stats = [
    { value: 95, suffix: '%', label: 'Less Water Used', desc: 'Closed-loop recirculation eliminates wasteful runoff.' },
    { value: 365, suffix: '', label: 'Days of Harvest', desc: 'Year-round production, independent of seasons and climate.' },
    { value: 10, suffix: 'x', label: 'Higher Yield', desc: 'Per square metre versus conventional field agriculture.' },
    { value: 0, suffix: '', label: 'Pesticides Used', desc: 'Clean, chemical-free crops. Every single harvest.' },
  ]

  return (
    <section className="py-24 px-6" style={{ background: '#060908' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="block text-xs font-semibold tracking-[0.3em] uppercase mb-4" style={{ color: '#7a9a4a' }}>
            By the numbers
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight" style={{ color: 'rgba(255,255,255,0.9)' }}>
            Agriculture reimagined at scale
          </h2>
        </motion.div>

        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-px"
          style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', overflow: 'hidden' }}
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="flex flex-col p-8"
              style={{ background: '#0a0e0a' }}
            >
              <span className="text-5xl md:text-6xl font-black tracking-tighter mb-2 tabular-nums" style={{ color: '#7a9a4a' }}>
                <Counter to={s.value} suffix={s.suffix} />
              </span>
              <span className="text-sm font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.85)' }}>{s.label}</span>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)' }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Features ────────────────────────────────────────────────────────────── */
function Features() {
  const items = [
    { icon: '◈', title: 'Vertical Stacking', body: 'Multi-tier growth towers maximise canopy density in minimal footprint — from rooftop to warehouse.' },
    { icon: '⬡', title: 'Nutrient Intelligence', body: 'Real-time EC/pH monitoring with machine-learning adjustments deliver optimal inputs at every stage.' },
    { icon: '◎', title: 'LED Spectrum Control', body: 'Programmable light recipes mimic sunlight exactly, accelerating growth cycles by up to 30%.' },
    { icon: '⬙', title: 'Zero-Waste Loop', body: 'Recirculated water, compostable grow media, and renewable energy close the loop completely.' },
    { icon: '⬕', title: 'Modular Scale', body: 'Snap-fit modules deploy in days. Scale from pilot kitchen farm to city-block supply facility.' },
    { icon: '◑', title: 'Full Traceability', body: 'Blockchain-anchored harvest records give consumers seed-to-shelf transparency in one scan.' },
  ]

  return (
    <section className="py-24 px-6" style={{ background: '#050705' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="block text-xs font-semibold tracking-[0.3em] uppercase mb-4" style={{ color: '#7a9a4a' }}>
            Technology
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.9)' }}>
            Every system. Engineered to perfection.
          </h2>
        </motion.div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px"
          style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', overflow: 'hidden' }}
        >
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="p-8 cursor-default transition-colors duration-300"
              style={{ background: '#080c08' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#0e140e')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#080c08')}
            >
              <span className="block text-2xl mb-4" style={{ color: '#7a9a4a' }}>{item.icon}</span>
              <h3 className="text-base font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.88)' }}>{item.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)' }}>{item.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── CTA banner ──────────────────────────────────────────────────────────── */
function CTABanner() {
  return (
    <section className="py-24 px-6" style={{ background: '#050705' }}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto rounded-2xl overflow-hidden relative"
        style={{
          background: 'linear-gradient(135deg, #0d1a0a 0%, #060906 100%)',
          border: '1px solid rgba(122,154,74,0.18)',
          boxShadow: '0 0 100px rgba(122,154,74,0.06)',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(122,154,74,0.1) 0%, transparent 70%)' }}
        />
        <div className="relative z-10 flex flex-col items-center text-center py-20 px-8">
          <span className="block text-xs font-semibold tracking-[0.3em] uppercase mb-6" style={{ color: '#7a9a4a' }}>
            Start growing
          </span>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight" style={{ color: 'rgba(255,255,255,0.92)' }}>
            Ready to farm the future?
          </h2>
          <p className="text-base md:text-lg mb-10 max-w-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.48)' }}>
            Join forward-thinking farmers and enterprises building tomorrow&apos;s food supply with Trufud systems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.a
              href="#"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3.5 rounded-full font-semibold text-sm"
              style={{ background: '#6b8c3e', color: '#fff' }}
            >
              Request a Demo
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3.5 rounded-full font-semibold text-sm"
              style={{ color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.18)', background: 'transparent' }}
            >
              Download Brochure
            </motion.a>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

/* ─── Footer ──────────────────────────────────────────────────────────────── */
function Footer() {
  const cols = [
    { title: 'Product', links: ['Hydroponic Towers', 'Nutrient Systems', 'LED Rigs', 'Sensors & IoT'] },
    { title: 'Company', links: ['About', 'Careers', 'Press', 'Contact'] },
    { title: 'Resources', links: ['Documentation', 'Case Studies', 'Blog', 'API'] },
  ]

  return (
    <footer className="border-t py-16 px-6" style={{ background: '#050705', borderColor: 'rgba(255,255,255,0.06)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <img
              src="/logo.png"
              alt="Trufud"
              className="h-8 w-auto mb-4"
              style={{ filter: 'brightness(0) invert(1)', opacity: 0.8 }}
            />
            <p className="text-xs leading-relaxed max-w-[200px]" style={{ color: 'rgba(255,255,255,0.32)' }}>
              Precision vertical farming systems for the future of food.
            </p>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <p className="text-[10px] font-semibold tracking-widest uppercase mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm transition-colors duration-200"
                      style={{ color: 'rgba(255,255,255,0.32)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.78)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.32)')}
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.22)' }}>
            © 2026 Trufud Trading SPC. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.22)' }}>
            <span>Sustainable since 2024</span>
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#7a9a4a', boxShadow: '0 0 6px #7a9a4a' }}
            />
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function Page() {
  return (
    <main style={{ background: '#050705' }}>
      <Navbar activeLink={0} />
      <HeroSection />
      <HydroScroll />
      <AboutSection />
      <ProductsSection />
      <ProductShowcase />
      <Stats />
      <Features />
      <CTABanner />
      <Footer />
    </main>
  )
}
