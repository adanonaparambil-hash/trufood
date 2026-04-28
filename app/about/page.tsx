'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Navbar from '../components/Navbar'

/* ─── Section data ───────────────────────────────────────────────────────────*/
const SECTIONS = [
  { id: 'about-trufud',       label: 'About Trufud',      number: '01' },
  { id: 'our-farms',          label: 'Our Farms',          number: '02' },
  { id: 'farming-systems',    label: 'Farming Systems',    number: '03' },
]

const FARM_STATS = [
  { value: '10,000 m²', label: 'Shade Net Greenhouse' },
  { value: '3,600 m²',  label: 'Indoor Vertical System' },
  { value: '10,000',    label: 'Dutch Buckets' },
  { value: '128,000',   label: 'NFT Grow Holes' },
]

/* ─── Scroll-linked hero ─────────────────────────────────────────────────────*/
function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y   = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const op  = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const scl = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ height: '92vh', minHeight: '580px' }}>
      {/* Parallax image */}
      <motion.div className="absolute inset-0" style={{ y, scale: scl }}>
        <img
          src="/about-1.jpeg"
          alt="Trufud vertical farm"
          className="w-full h-full object-cover object-center"
          draggable={false}
        />
      </motion.div>

      {/* Gradient overlays */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(5,8,5,0.82) 0%, rgba(5,8,5,0.4) 55%, rgba(5,8,5,0.7) 100%)' }} />
      <div className="absolute inset-x-0 bottom-0 h-56" style={{ background: 'linear-gradient(to top, #050805 0%, transparent 100%)' }} />
      <div className="absolute inset-x-0 top-0 h-36" style={{ background: 'linear-gradient(to bottom, rgba(5,8,5,0.6) 0%, transparent 100%)' }} />

      {/* Content */}
      <motion.div
        style={{ opacity: op }}
        className="relative z-10 h-full flex flex-col justify-end pb-24 px-8 md:px-16 max-w-[1400px] mx-auto"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-6"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-[0.28em] uppercase"
            style={{ background: 'rgba(140,159,78,0.12)', color: '#8C9F4E', border: '1px solid rgba(140,159,78,0.25)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#8C9F4E' }} />
            Our Story
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif font-bold leading-[0.96] mb-6"
          style={{ fontSize: 'clamp(52px, 8vw, 110px)', color: 'rgba(255,255,255,0.95)' }}
        >
          About<br />
          <span style={{ color: '#8C9F4E', fontStyle: 'italic' }}>Us.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
          className="text-base md:text-lg max-w-[520px] leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.55)' }}
        >
          Born in 2021, Trufud Trading SPC is rewriting the rules of food production in Oman — one precision-grown harvest at a time.
        </motion.p>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
          className="flex items-center gap-3 mt-10"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(140,159,78,0.7)" strokeWidth="2">
              <path d="M12 5v14M5 13l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
          <span className="text-[9px] tracking-[0.28em] uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>Scroll to explore</span>
        </motion.div>
      </motion.div>
    </div>
  )
}

/* ─── Sidebar nav — tracks active section ────────────────────────────────────*/
function SideNav({ active }: { active: string }) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  return (
    <div className="hidden xl:flex flex-col gap-6 sticky top-32 self-start">
      <p className="text-[9px] font-semibold tracking-[0.3em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.25)' }}>Sections</p>
      {SECTIONS.map((s) => (
        <button key={s.id} onClick={() => scrollTo(s.id)} className="flex items-center gap-3 group text-left">
          <motion.span
            animate={{ width: active === s.id ? '28px' : '10px', background: active === s.id ? '#8C9F4E' : 'rgba(255,255,255,0.2)' }}
            transition={{ duration: 0.35 }}
            className="block h-px rounded-full flex-shrink-0"
          />
          <span
            className="text-[11px] font-medium tracking-wide transition-colors duration-300"
            style={{ color: active === s.id ? '#8C9F4E' : 'rgba(255,255,255,0.3)' }}
          >
            {s.label}
          </span>
        </button>
      ))}
    </div>
  )
}

/* ─── Section wrapper — reveals on scroll ────────────────────────────────────*/
function RevealSection({
  id, children, onEnter,
}: {
  id: string
  children: React.ReactNode
  onEnter: (id: string) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-35% 0px -35% 0px', once: false })

  useEffect(() => {
    if (inView) onEnter(id)
  }, [inView, id, onEnter])

  return (
    <motion.div
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: '-80px' }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* ─── Image card component ───────────────────────────────────────────────────*/
function ImageCard({ src, alt, aspect = '4/3' }: { src: string; alt: string; aspect?: string }) {
  return (
    <div
      className="relative overflow-hidden w-full"
      style={{ borderRadius: '20px', border: '1px solid rgba(140,159,78,0.12)', boxShadow: '0 32px 80px rgba(0,0,0,0.5)', aspectRatio: aspect }}
    >
      <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'linear-gradient(160deg, rgba(140,159,78,0.06) 0%, transparent 55%)' }} />
      <img src={src} alt={alt} className="w-full h-full object-cover" draggable={false} />
    </div>
  )
}

/* ─── Label chip ─────────────────────────────────────────────────────────────*/
function Chip({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-[0.22em] uppercase"
      style={{ background: 'rgba(140,159,78,0.1)', color: '#8C9F4E', border: '1px solid rgba(140,159,78,0.2)' }}
    >
      {label}
    </span>
  )
}

/* ─── Main page ──────────────────────────────────────────────────────────────*/
export default function AboutPage() {
  const [activeSection, setActiveSection] = useState('about-trufud')

  return (
    <main style={{ background: '#050805', minHeight: '100vh' }}>
      <Navbar activePage="About Us" />

      {/* ── Hero ── */}
      <HeroSection />

      {/* ── Body — sidebar + content ── */}
      <div className="max-w-[1320px] mx-auto px-6 md:px-12 lg:px-16 py-24 md:py-32">
        <div className="grid grid-cols-1 xl:grid-cols-[180px_1fr] gap-16 xl:gap-24">

          {/* Left — sticky nav */}
          <SideNav active={activeSection} />

          {/* Right — sections */}
          <div className="flex flex-col gap-32 md:gap-40">

            {/* ══════════════════════════════════════════════════════════
                SECTION 01 — About Trufud Trading SPC
            ══════════════════════════════════════════════════════════ */}
            <RevealSection id="about-trufud" onEnter={setActiveSection}>
              <div className="space-y-16">

                {/* Header row */}
                <div className="flex flex-col gap-4">
                  <Chip label="01 — About Trufud" />
                  <h2 className="font-serif font-bold leading-tight" style={{ fontSize: 'clamp(32px,4.5vw,60px)', color: 'rgba(255,255,255,0.93)' }}>
                    About Trufud<br />
                    <span style={{ color: '#8C9F4E', fontStyle: 'italic' }}>Trading SPC</span>
                  </h2>
                </div>

                {/* Two-column: text | image */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-10 lg:gap-16 items-start">
                  {/* Text block */}
                  <div className="space-y-6">
                    <p className="text-base md:text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                      Trufud Trading SPC was born in 2021 out of a deep commitment to sustainable and efficient food production. Conventional horizontal farming frequently necessitates large areas of land, substantial water use, and a strong reliance on chemical inputs.
                    </p>
                    <p className="text-base md:text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                      On the other hand, vertical farming enables us to cultivate a diverse array of crops in a compact, controlled space. By stacking growing layers vertically, we maximize the use of available space — growing more food in a smaller footprint and significantly reducing the land and resources required.
                    </p>
                    <p className="text-base md:text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                      Our state-of-the-art facilities utilise advanced hydroponic systems that allow us to precisely monitor and optimise the growing conditions for each crop.
                    </p>

                    {/* Key metrics */}
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      {[
                        { stat: '2021',  label: 'Founded in Oman' },
                        { stat: '95%',   label: 'Less water used' },
                        { stat: '10×',   label: 'Higher crop yield' },
                        { stat: '365',   label: 'Days of harvest' },
                      ].map(({ stat, label }) => (
                        <div
                          key={stat}
                          className="p-4 rounded-2xl"
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(140,159,78,0.12)' }}
                        >
                          <p className="text-2xl font-black font-serif mb-0.5" style={{ color: '#8C9F4E' }}>{stat}</p>
                          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Image stack */}
                  <div className="relative">
                    <ImageCard src="/about-2.jpeg" alt="Trufud hydroponic farm" aspect="3/4" />
                    {/* Floating stat chip */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6, duration: 0.6 }}
                      className="absolute -left-6 top-12 flex items-center gap-2.5 px-4 py-3 rounded-2xl"
                      style={{ background: '#0d1a0a', border: '1px solid rgba(140,159,78,0.25)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
                    >
                      <span className="flex items-center justify-center w-8 h-8 rounded-full text-base" style={{ background: 'rgba(140,159,78,0.15)' }}>🌱</span>
                      <div>
                        <p className="text-xs font-bold leading-none" style={{ color: '#8C9F4E' }}>Zero Pesticides</p>
                        <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>Clean, chemical-free</p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </RevealSection>

            {/* Divider */}
            <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, rgba(140,159,78,0.2), transparent)' }} />

            {/* ══════════════════════════════════════════════════════════
                SECTION 02 — Our Farms
            ══════════════════════════════════════════════════════════ */}
            <RevealSection id="our-farms" onEnter={setActiveSection}>
              <div className="space-y-16">

                {/* Header */}
                <div className="flex flex-col gap-4">
                  <Chip label="02 — Our Farms" />
                  <h2 className="font-serif font-bold leading-tight" style={{ fontSize: 'clamp(32px,4.5vw,60px)', color: 'rgba(255,255,255,0.93)' }}>
                    Our <span style={{ color: '#8C9F4E', fontStyle: 'italic' }}>Farms</span>
                  </h2>
                </div>

                {/* Full-width image */}
                <div className="relative w-full overflow-hidden" style={{ borderRadius: '24px', aspectRatio: '16/7', border: '1px solid rgba(140,159,78,0.1)' }}>
                  <img src="/about-3.jpeg" alt="Our farm facility" className="w-full h-full object-cover" draggable={false} />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(5,8,5,0.7) 0%, transparent 50%)' }} />
                  <div className="absolute inset-0 flex items-center px-10 md:px-16">
                    <div className="max-w-[400px]">
                      <p className="font-serif text-2xl md:text-3xl font-bold leading-snug mb-3" style={{ color: 'rgba(255,255,255,0.93)' }}>
                        Precision farming<br />
                        <span style={{ color: '#8C9F4E' }}>at scale</span>
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                        Urban-located vertical farms delivering the freshest produce, from our system to your shelf.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Body text */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
                  <p className="text-base md:text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.62)' }}>
                    Trufud Trading SPC's vertical hydroponic farming module is an innovative solution for growing crops in limited spaces. Our compact, self-contained units allow for efficient, high-yield food production, even in urban environments or areas with limited arable land.
                  </p>
                  <p className="text-base md:text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.62)' }}>
                    Hydroponics provides plants with precisely controlled nutrients and optimal growing conditions, resulting in faster growth and higher yields than traditional farming. Our modules are easy to set up and maintain, making them accessible for commercial and residential applications.
                  </p>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden" style={{ borderRadius: '16px', background: 'rgba(255,255,255,0.04)' }}>
                  {FARM_STATS.map(({ value, label }, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08, duration: 0.6 }}
                      className="flex flex-col p-6 md:p-8"
                      style={{ background: '#070d07' }}
                    >
                      <span className="text-2xl md:text-3xl font-black font-serif mb-2 tracking-tight" style={{ color: '#8C9F4E' }}>{value}</span>
                      <span className="text-xs leading-snug" style={{ color: 'rgba(255,255,255,0.42)' }}>{label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </RevealSection>

            {/* Divider */}
            <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, rgba(140,159,78,0.2), transparent)' }} />

            {/* ══════════════════════════════════════════════════════════
                SECTION 03 — Farming Systems
            ══════════════════════════════════════════════════════════ */}
            <RevealSection id="farming-systems" onEnter={setActiveSection}>
              <div className="space-y-16">

                {/* Header */}
                <div className="flex flex-col gap-4">
                  <Chip label="03 — Farming Systems" />
                  <h2 className="font-serif font-bold leading-tight" style={{ fontSize: 'clamp(32px,4.5vw,60px)', color: 'rgba(255,255,255,0.93)' }}>
                    Two Systems,<br />
                    <span style={{ color: '#8C9F4E', fontStyle: 'italic' }}>One Vision</span>
                  </h2>
                </div>

                {/* Two system cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* System 1 */}
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.35 }}
                    className="relative overflow-hidden rounded-[20px] p-8 flex flex-col justify-between gap-8"
                    style={{ background: 'linear-gradient(145deg, #0d180d 0%, #070d07 100%)', border: '1px solid rgba(140,159,78,0.15)', minHeight: '380px' }}
                  >
                    {/* Background image */}
                    <div className="absolute inset-0 opacity-20">
                      <img src="/about-4.jpeg" alt="" className="w-full h-full object-cover" draggable={false} />
                    </div>
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(7,13,7,0.4) 0%, rgba(7,13,7,0.85) 100%)' }} />

                    <div className="relative z-10">
                      <div
                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-6 text-lg"
                        style={{ background: 'rgba(140,159,78,0.15)', border: '1px solid rgba(140,159,78,0.25)' }}
                      >
                        🌿
                      </div>
                      <h3 className="font-serif text-xl md:text-2xl font-bold mb-3" style={{ color: 'rgba(255,255,255,0.92)' }}>
                        Fan & Pad Hydroponic System
                      </h3>
                      <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.52)' }}>
                        Set in a 10,000 m² shade net greenhouse featuring Dutch Buckets and Nutrient Film Technique (NFT) hydroponics for high-volume outdoor-style cultivation.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {['Dutch Buckets', 'NFT Hydroponics', '10,000 m²'].map(t => (
                          <span key={t} className="px-2.5 py-1 rounded-full text-[10px] font-medium" style={{ background: 'rgba(140,159,78,0.1)', color: '#8C9F4E', border: '1px solid rgba(140,159,78,0.18)' }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="relative z-10 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.28)' }}>System 01</span>
                        <span className="font-serif text-3xl font-black" style={{ color: 'rgba(140,159,78,0.3)' }}>01</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* System 2 */}
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.35 }}
                    className="relative overflow-hidden rounded-[20px] p-8 flex flex-col justify-between gap-8"
                    style={{ background: 'linear-gradient(145deg, #0a1510 0%, #070d07 100%)', border: '1px solid rgba(140,159,78,0.15)', minHeight: '380px' }}
                  >
                    <div className="absolute inset-0 opacity-15">
                      <img src="/about-2.jpeg" alt="" className="w-full h-full object-cover" draggable={false} />
                    </div>
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(7,13,7,0.4) 0%, rgba(7,13,7,0.88) 100%)' }} />

                    <div className="relative z-10">
                      <div
                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-6 text-lg"
                        style={{ background: 'rgba(140,159,78,0.15)', border: '1px solid rgba(140,159,78,0.25)' }}
                      >
                        ⚡
                      </div>
                      <h3 className="font-serif text-xl md:text-2xl font-bold mb-3" style={{ color: 'rgba(255,255,255,0.92)' }}>
                        Vertical Ebb & Flow Table System
                      </h3>
                      <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.52)' }}>
                        A fully automated indoor controlled environment spanning 3,600 m² — housing 10,000 Dutch buckets and 128,000 NFT grow holes for precision vertical production.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {['Full Automation', '3,600 m²', '128K NFT Holes'].map(t => (
                          <span key={t} className="px-2.5 py-1 rounded-full text-[10px] font-medium" style={{ background: 'rgba(140,159,78,0.1)', color: '#8C9F4E', border: '1px solid rgba(140,159,78,0.18)' }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="relative z-10 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.28)' }}>System 02</span>
                        <span className="font-serif text-3xl font-black" style={{ color: 'rgba(140,159,78,0.3)' }}>02</span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Combined statement */}
                <div
                  className="relative overflow-hidden rounded-[20px] p-10 md:p-14"
                  style={{ background: 'linear-gradient(135deg, rgba(140,159,78,0.08) 0%, rgba(5,8,5,0) 100%)', border: '1px solid rgba(140,159,78,0.14)' }}
                >
                  <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(140,159,78,0.07) 0%, transparent 65%)' }} />
                  <p className="font-serif text-xl md:text-2xl leading-relaxed max-w-[640px]" style={{ color: 'rgba(255,255,255,0.75)' }}>
                    "With their capability to cultivate a variety of fresh produce year-round, the vertical hydroponic farming modules used by Trufud Trading SPC are not only sustainable but also{' '}
                    <span style={{ color: '#8C9F4E', fontStyle: 'italic' }}>pave the way for the future of agriculture."</span>
                  </p>
                </div>

                {/* Bottom image */}
                <ImageCard src="/about-3.jpeg" alt="Farm systems overview" aspect="21/9" />

              </div>
            </RevealSection>

          </div>
        </div>
      </div>

      {/* ── Sustainable farming ribbon ── */}
      <section className="relative py-28 overflow-hidden" style={{ background: '#030603' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(140,159,78,0.06) 0%, transparent 70%)' }} />
        <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(140,159,78,0.2), transparent)' }} />

        <div className="max-w-[1320px] mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <div>
              <Chip label="Sustainable Farming" />
              <h2 className="font-serif text-3xl md:text-5xl font-bold mt-6 mb-6 leading-tight" style={{ color: 'rgba(255,255,255,0.92)' }}>
                Growing a Sustainable<br />
                <span style={{ color: '#8C9F4E', fontStyle: 'italic' }}>Food System for Oman</span>
              </h2>
              <p className="text-base leading-relaxed mb-8 max-w-[480px]" style={{ color: 'rgba(255,255,255,0.52)' }}>
                We launched Trufud Trading SPC as a result of our commitment to provide sustainable food production efficacy and support Oman in farming the country in the long run. Through our optimised and innovative farming techniques, we are on a mission to future-proof food production for now and the times ahead.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-sm"
                style={{ background: 'linear-gradient(135deg, #8C9F4E, #5c6b2e)', color: '#fff', boxShadow: '0 0 32px rgba(140,159,78,0.22)' }}
              >
                Back to Home
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            {/* Feature list */}
            <div className="flex flex-col gap-4">
              {[
                { icon: '🌿', title: '95% Less Water', body: 'Closed-loop recirculation eliminates wasteful runoff, drastically reducing our freshwater footprint.' },
                { icon: '☀️', title: 'Year-Round Harvest', body: 'Precise environmental control enables 365-day production, independent of weather or season.' },
                { icon: '🚫', title: 'Zero Pesticides', body: 'Clean, chemical-free crops in a hermetically sealed environment. Every single harvest.' },
                { icon: '📍', title: 'Local & Fresh', body: 'Urban farms near city centres minimise food miles, delivering maximum freshness to your table.' },
              ].map(({ icon, title, body }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.09, duration: 0.6 }}
                  className="flex items-start gap-4 p-5 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(140,159,78,0.1)' }}
                >
                  <span className="text-xl mt-0.5 flex-shrink-0">{icon}</span>
                  <div>
                    <p className="text-sm font-bold mb-1" style={{ color: 'rgba(255,255,255,0.88)' }}>{title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.42)' }}>{body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t py-10 px-6" style={{ background: '#050805', borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-[1320px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Trufud" className="h-7 w-auto" style={{ filter: 'brightness(0) invert(1)', opacity: 0.7 }} />
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>Trading SPC</span>
          </div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.22)' }}>© 2026 Trufud Trading SPC. All rights reserved.</p>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.22)' }}>
            <span>Sustainable since 2024</span>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#8C9F4E', boxShadow: '0 0 6px #8C9F4E' }} />
          </div>
        </div>
      </footer>
    </main>
  )
}
