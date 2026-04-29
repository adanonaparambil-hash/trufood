'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import HydroScroll from './components/HydroScroll'
import AboutSection from './components/AboutSection'
import ProductsSection from './components/ProductsSection'
import ProductShowcase from './components/ProductShowcase'
import VideoShowcase from './components/VideoShowcase'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const SLIDES = [
  {
    id: '01',
    bg: '/LandingPage_imge_first image.jpeg',
    overlay: 'linear-gradient(110deg, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.50) 45%, rgba(0,0,0,0.20) 100%)',
    heading: 'Growing a\nSustainable Food\nSystem for Oman',
    sub: 'At Trufud Trading SPC, we are on a mission to redefine the future of agriculture through innovation, sustainability and quality.',
  },
  {
    id: '02',
    bg: '/Stunning_cinematic_aerial_202604271225.jpeg',
    overlay: 'linear-gradient(110deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.52) 48%, rgba(0,0,0,0.18) 100%)',
    heading: 'Vertical Farming.\nReimagined for Oman.',
    sub: 'State-of-the-art LED hydroponic towers delivering year-round harvests, independent of climate and season.',
  },
  {
    id: '03',
    bg: '/Macro_close-up_photography_202604271227.jpeg',
    overlay: 'linear-gradient(110deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.62) 48%, rgba(0,0,0,0.32) 100%)',
    heading: 'Roots in Science.\nGrowth in Purpose.',
    sub: 'Hydroponic systems that deliver 10× yields with 95% less water than traditional agriculture.',
  },
]

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
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M11 20A7 7 0 014 13c0-4 5-9 7-11 2 2 7 7 7 11a7 7 0 01-7 7z" />
    <path d="M11 20V9" />
  </svg>
)
const IconDrop = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M12 2C6 8.5 4 12.5 4 15a8 8 0 0016 0c0-2.5-2-6.5-8-13z" />
  </svg>
)
const IconBadge = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="12" cy="8" r="6" />
    <path d="M9 21l3-9 3 9M9 21l-4 1 1-5M15 21l4 1-1-5" />
  </svg>
)
const IconPlay = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5,3 19,12 5,21" />
  </svg>
)

function HeroSection() {
  const [active, setActive] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const goTo = useCallback((idx: number) => {
    setActive((cur) => (idx === cur ? cur : idx))
  }, [])

  useEffect(() => {
    timerRef.current = setTimeout(
      () => setActive((cur) => (cur + 1) % SLIDES.length),
      6000
    )
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [active])

  const slide = SLIDES[active]

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={active}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
          <img src={slide.bg} alt="" className="absolute inset-0 w-full h-full object-cover object-center" draggable={false} />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence initial={false}>
        <motion.div
          key={`overlay-${active}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: slide.overlay }}
        />
      </AnimatePresence>
      <div className="absolute inset-x-0 top-0 h-40 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.65), transparent)' }} />
      <div className="absolute inset-x-0 bottom-0 h-48 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }} />

      {/* Main content */}
      <div className="relative z-20 h-full flex flex-col justify-between px-5 sm:px-8 md:px-16 max-w-[1400px] mx-auto">
        <div className="h-[76px]" />

        {/* Hero text */}
        <div className="flex-1 flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
              className="w-full max-w-[620px]"
            >
              <h1
                className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[68px] font-bold leading-[1.08] mb-4 md:mb-6 whitespace-pre-line"
                style={{ color: 'rgba(255,255,255,0.95)', textShadow: '0 2px 40px rgba(0,0,0,0.4)' }}
              >
                {slide.heading}
              </h1>
              <p className="text-sm md:text-base leading-relaxed max-w-[440px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
                {slide.sub}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom bar */}
        <div className="pb-6 md:pb-8">
          {/* Scroll Down */}
          <div className="flex justify-center mb-4 md:mb-6">
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] tracking-[0.28em] uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>Scroll Down</span>
              <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2">
                  <path d="M12 5v14M5 13l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            </div>
          </div>

          {/* Bottom bar — stacks on mobile */}
          <div className="flex flex-col sm:grid sm:grid-cols-3 items-center gap-3 sm:gap-4">
            {/* Social */}
            <div className="flex items-center justify-center sm:justify-start gap-4">
              {[
                { icon: <IconFacebook />, label: 'Facebook', href: 'https://www.facebook.com/share/aWy4LzVVWCxqKSvj/' },
                { icon: <IconInstagram />, label: 'Instagram', href: 'https://www.instagram.com/trufudoman?igsh=cTBoZ3I1MXBmeDRr' },
                { icon: <IconLinkedin />, label: 'LinkedIn', href: 'https://www.linkedin.com/company/trufud-oman/' },
              ].map(({ icon, label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="transition-all duration-200 hover:scale-110 p-2"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}>
                  {icon}
                </a>
              ))}
            </div>

            {/* Feature pillars — hidden on small mobile */}
            <div className="hidden sm:flex items-center justify-center gap-3 md:gap-6">
              {[
                { icon: <IconLeaf />, label: 'Sustainable' },
                { icon: <IconDrop />, label: 'Water' },
                { icon: <IconBadge />, label: 'Quality' },
              ].map(({ icon, label }, i) => (
                <div key={label} className="flex items-center">
                  {i > 0 && <div className="w-px h-6 mr-3 md:mr-6" style={{ background: 'rgba(255,255,255,0.15)' }} />}
                  <div className="flex flex-col items-center gap-1 text-center">
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>{icon}</span>
                    <span className="text-[9px] leading-tight" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Watch Our Story */}
            <div className="flex justify-center sm:justify-end">
              <button
                className="flex items-center gap-2.5 group"
                aria-label="Watch Our Story"
                onClick={() => document.getElementById('video-showcase')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>Watch Our Story</span>
                <div className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                  style={{ border: '1px solid rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.08)' }}>
                  <IconPlay />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide counter — hidden on very small screens */}
      <div className="hidden sm:flex absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-3">
        {SLIDES.map((s, i) => (
          <button key={s.id} onClick={() => goTo(i)} className="flex flex-col items-center gap-1 group" aria-label={`Slide ${s.id}`}>
            <span className="text-xs font-mono font-semibold transition-all duration-300"
              style={{ color: i === active ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.28)', fontSize: i === active ? '13px' : '11px' }}>
              {s.id}
            </span>
            {i < SLIDES.length - 1 && (
              <div className="w-px transition-all duration-500"
                style={{ height: '20px', background: i < active ? '#7a9a4a' : i === active ? 'linear-gradient(to bottom, #7a9a4a, rgba(255,255,255,0.15))' : 'rgba(255,255,255,0.15)' }} />
            )}
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="hidden sm:block absolute right-4 md:right-10 bottom-28 md:bottom-32 z-30">
        <div className="w-0.5 rounded-full overflow-hidden" style={{ height: '60px', background: 'rgba(255,255,255,0.12)' }}>
          <motion.div className="w-full rounded-full" style={{ background: '#7a9a4a', originY: 0 }}
            animate={{ height: `${((active + 1) / SLIDES.length) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }} />
        </div>
      </div>
    </section>
  )
}

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true) }, { threshold: 0.5 })
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

function Stats() {
  const stats = [
    { value: 95, suffix: '%', label: 'Less Water Used', desc: 'Closed-loop recirculation eliminates wasteful runoff.' },
    { value: 365, suffix: '', label: 'Days of Harvest', desc: 'Year-round production, independent of seasons and climate.' },
    { value: 10, suffix: 'x', label: 'Higher Yield', desc: 'Per square metre versus conventional field agriculture.' },
    { value: 0, suffix: '', label: 'Pesticides Used', desc: 'Clean, chemical-free crops. Every single harvest.' },
  ]

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6" style={{ background: '#111a12' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="text-center mb-10 md:mb-16">
          <span className="block text-xs font-semibold tracking-[0.3em] uppercase mb-4" style={{ color: '#7a9a4a' }}>By the numbers</span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight" style={{ color: 'rgba(255,255,255,0.9)' }}>
            Agriculture reimagined at scale
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px"
          style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', overflow: 'hidden' }}>
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="flex flex-col p-5 sm:p-6 md:p-8" style={{ background: '#172019' }}>
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-2 tabular-nums" style={{ color: '#7a9a4a' }}>
                <Counter to={s.value} suffix={s.suffix} />
              </span>
              <span className="text-xs sm:text-sm font-semibold mb-1 md:mb-2" style={{ color: 'rgba(255,255,255,0.85)' }}>{s.label}</span>
              <p className="text-[11px] sm:text-xs leading-relaxed hidden sm:block" style={{ color: 'rgba(255,255,255,0.38)' }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

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
    <section className="py-16 md:py-24 px-4 sm:px-6" style={{ background: '#111a12' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="text-center mb-10 md:mb-16">
          <span className="block text-xs font-semibold tracking-[0.3em] uppercase mb-4" style={{ color: '#7a9a4a' }}>Technology</span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.9)' }}>
            Every system. Engineered to perfection.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px"
          style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', overflow: 'hidden' }}>
          {items.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="p-6 md:p-8 cursor-default transition-colors duration-300"
              style={{ background: '#172019' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#1e2e1f')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#172019')}>
              <span className="block text-2xl mb-3 md:mb-4" style={{ color: '#7a9a4a' }}>{item.icon}</span>
              <h3 className="text-sm md:text-base font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.88)' }}>{item.title}</h3>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)' }}>{item.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactBanner() {
  return (
    <section className="relative py-20 md:py-28 px-4 sm:px-6 overflow-hidden" style={{ background: '#111a12' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(140,159,78,0.07) 0%, transparent 70%)' }} />
      <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(140,159,78,0.25), transparent)' }} />

      <motion.div initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-[720px] mx-auto text-center">
        <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.3em] uppercase mb-5 md:mb-6"
          style={{ color: '#8C9F4E' }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#8C9F4E', boxShadow: '0 0 8px #8C9F4E' }} />
          Get In Touch
        </span>

        <h2 className="font-serif font-bold leading-tight mb-4 md:mb-5"
          style={{ fontSize: 'clamp(26px, 5vw, 62px)', color: 'rgba(255,255,255,0.95)' }}>
          Let&apos;s build the future<br />
          <span style={{ color: '#8C9F4E', fontStyle: 'italic' }}>of food together.</span>
        </h2>

        <p className="text-sm md:text-base lg:text-lg leading-relaxed mb-8 md:mb-10 max-w-[480px] mx-auto"
          style={{ color: 'rgba(255,255,255,0.45)' }}>
          Have a project in mind or want to learn more about Trufud farming systems? We&apos;d love to hear from you.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link href="/contact"
              className="inline-flex items-center gap-2.5 px-7 sm:px-9 py-3.5 sm:py-4 rounded-full font-semibold text-sm"
              style={{ background: 'linear-gradient(135deg, #8C9F4E, #5c6b2e)', color: '#fff', boxShadow: '0 0 40px rgba(140,159,78,0.28)' }}>
              Contact Us
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <a href="mailto:info@trufudoman.com"
              className="inline-flex items-center gap-2.5 px-7 sm:px-9 py-3.5 sm:py-4 rounded-full font-semibold text-sm"
              style={{ color: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.15)' }}>
              info@trufudoman.com
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

export default function Page() {
  return (
    <main style={{ background: '#111a12' }}>
      <Navbar activePage="Home" />
      <HeroSection />
      <HydroScroll />
      <AboutSection />
      <ProductsSection />
      <ProductShowcase />
      <Stats />
      <Features />
      <VideoShowcase />
      <ContactBanner />
      <Footer />
    </main>
  )
}
