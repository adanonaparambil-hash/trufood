'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'

/* ─── Content ────────────────────────────────────────────────────────────────*/
const PILLARS = [
  {
    number: '01',
    title: 'Food Security',
    body: 'By harnessing the power of vertical farming, we are tackling global challenges like food security and resource scarcity head-on — growing more with less, closer to where it matters.',
    icon: '🌾',
  },
  {
    number: '02',
    title: 'Resource Efficiency',
    body: 'Technology that is soft on nature. Our systems use 95% less water than conventional farming, with zero pesticides and minimal land footprint.',
    icon: '💧',
  },
  {
    number: '03',
    title: 'Endless Possibilities',
    body: 'From leafy greens to juicy tomatoes — everything grown indoors under the watchful eye of cutting-edge technology. The future is here, and it\'s delicious.',
    icon: '🍃',
  },
  {
    number: '04',
    title: 'Sustainable Tomorrow',
    body: 'Technology that sets a foundation for a more sustainable, efficient and environmentally friendly food system — envisioning a world where agriculture works with nature, not against it.',
    icon: '🌍',
  },
]

/* ─── Hero ───────────────────────────────────────────────────────────────────*/
function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y   = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const op  = useTransform(scrollYProgress, [0, 0.65], [1, 0])
  const scl = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ height: '100vh', minHeight: 600 }}>
      <motion.div className="absolute inset-0" style={{ y, scale: scl }}>
        <img src="/philosophy-1.jpeg" alt="Our Philosophy" className="w-full h-full object-cover object-center" draggable={false} />
      </motion.div>

      {/* Overlays */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(3,6,3,0.88) 0%, rgba(3,6,3,0.45) 55%, rgba(3,6,3,0.72) 100%)' }} />
      <div className="absolute inset-x-0 bottom-0 h-64" style={{ background: 'linear-gradient(to top, #040804 0%, transparent 100%)' }} />
      <div className="absolute inset-x-0 top-0 h-40" style={{ background: 'linear-gradient(to bottom, rgba(3,6,3,0.65) 0%, transparent 100%)' }} />

      <motion.div style={{ opacity: op }}
        className="relative z-10 h-full flex flex-col justify-end pb-28 px-8 md:px-16 max-w-[1400px] mx-auto">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-[0.28em] uppercase"
            style={{ background: 'rgba(140,159,78,0.12)', color: '#8C9F4E', border: '1px solid rgba(140,159,78,0.25)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#8C9F4E' }} />
            Our Beliefs
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif font-bold leading-[0.94] mb-6"
          style={{ fontSize: 'clamp(56px, 9vw, 120px)', color: 'rgba(255,255,255,0.96)' }}>
          Our<br />
          <span style={{ color: '#8C9F4E', fontStyle: 'italic' }}>Philosophy.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.42 }}
          className="text-lg md:text-xl max-w-[560px] leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.72)' }}>
          Growing the future — by harnessing vertical farming to tackle food security, resource scarcity, and environmental degradation head-on.
        </motion.p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
          className="flex items-center gap-3 mt-10">
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}>
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

/* ─── Pillars section ────────────────────────────────────────────────────────*/
function PillarCard({ pillar, index }: { pillar: typeof PILLARS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden cursor-default"
      style={{ borderRadius: 24 }}
    >
      <motion.div
        animate={{ scale: hovered ? 1.02 : 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative p-8 md:p-10 h-full flex flex-col"
        style={{
          background: hovered
            ? 'linear-gradient(145deg, rgba(18,30,14,0.98) 0%, rgba(10,18,10,0.99) 100%)'
            : 'linear-gradient(145deg, rgba(10,16,10,0.9) 0%, rgba(6,10,6,0.95) 100%)',
          border: `1px solid ${hovered ? 'rgba(140,159,78,0.4)' : 'rgba(140,159,78,0.1)'}`,
          borderRadius: 24,
          boxShadow: hovered ? '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(140,159,78,0.08)' : '0 8px 32px rgba(0,0,0,0.3)',
          transition: 'border-color 0.35s, box-shadow 0.35s, background 0.35s',
          minHeight: 280,
        }}
      >
        {/* Glow on hover */}
        <motion.div className="absolute inset-0 pointer-events-none"
          animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.4 }}
          style={{ background: 'radial-gradient(ellipse 80% 60% at 20% 20%, rgba(140,159,78,0.08) 0%, transparent 70%)', borderRadius: 24 } as any}
        />

        {/* Number */}
        <div className="flex items-start justify-between mb-6">
          <span className="text-[11px] font-mono tracking-[0.2em]" style={{ color: 'rgba(140,159,78,0.45)' }}>
            {pillar.number}
          </span>
          <motion.span
            className="text-2xl"
            animate={{ scale: hovered ? 1.2 : 1, rotate: hovered ? 8 : 0 }}
            transition={{ duration: 0.4 }}
          >
            {pillar.icon}
          </motion.span>
        </div>

        {/* Title */}
        <h3 className="font-serif font-bold mb-4 leading-tight"
          style={{ fontSize: 'clamp(22px, 2.2vw, 32px)', color: hovered ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.88)', transition: 'color 0.3s' }}>
          {pillar.title}
        </h3>

        {/* Divider */}
        <motion.div className="h-px mb-5"
          animate={{ width: hovered ? '100%' : '40%' }}
          transition={{ duration: 0.5 }}
          style={{ background: 'linear-gradient(90deg, rgba(140,159,78,0.5), transparent)' }}
        />

        {/* Body */}
        <p className="text-[15px] leading-[1.75] flex-1"
          style={{ color: hovered ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.48)', transition: 'color 0.3s' }}>
          {pillar.body}
        </p>

        {/* Bottom shimmer */}
        <motion.div className="absolute bottom-0 inset-x-0 h-px"
          animate={{ opacity: hovered ? 0.7 : 0 }} transition={{ duration: 0.3 }}
          style={{ background: 'linear-gradient(90deg, transparent, #8C9F4E, transparent)' }}
        />
      </motion.div>
    </motion.div>
  )
}

/* ─── Manifesto section ──────────────────────────────────────────────────────*/
function Manifesto() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y   = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])
  const scl = useTransform(scrollYProgress, [0, 1], [1.05, 1.0])

  return (
    <div ref={ref} className="relative overflow-hidden" style={{ minHeight: '70vh' }}>
      {/* Parallax image */}
      <motion.div className="absolute inset-0" style={{ y, scale: scl }}>
        <img src="/philosophy-2.jpeg" alt="Sustainable farming" className="w-full h-full object-cover object-center" draggable={false} />
      </motion.div>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(3,6,3,0.92) 0%, rgba(3,6,3,0.6) 50%, rgba(3,6,3,0.85) 100%)' }} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-8 md:px-16 py-28 md:py-36 flex flex-col md:flex-row items-center gap-16">

        {/* Left — big quote */}
        <motion.div
          initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-bold tracking-[0.25em] uppercase mb-8"
            style={{ background: 'rgba(140,159,78,0.1)', color: '#8C9F4E', border: '1px solid rgba(140,159,78,0.2)' }}>
            Our Vision
          </span>
          <blockquote className="font-serif font-bold leading-[1.1]"
            style={{ fontSize: 'clamp(32px, 5vw, 68px)', color: 'rgba(255,255,255,0.95)' }}>
            "Envisioning a<br />
            <span style={{ color: '#8C9F4E', fontStyle: 'italic' }}>sustainable tomorrow</span><br />
            with advanced<br />technology."
          </blockquote>
        </motion.div>

        {/* Right — two text blocks */}
        <motion.div
          initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 flex flex-col gap-8"
        >
          {[
            {
              label: 'Soft on Nature',
              text: 'Technology that addresses the current food production challenges without compromising the planet. Every system we build is designed to give back more than it takes.',
            },
            {
              label: 'Built for the Future',
              text: 'Technology that sets a foundation for a more sustainable, efficient and environmentally friendly food system — for Oman and for the world.',
            },
          ].map(({ label, text }) => (
            <motion.div key={label}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="p-7 rounded-2xl"
              style={{ background: 'rgba(5,10,5,0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(140,159,78,0.15)' }}>
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase mb-3" style={{ color: '#8C9F4E' }}>{label}</p>
              <p className="text-[15px] leading-[1.75]" style={{ color: 'rgba(255,255,255,0.72)' }}>{text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

/* ─── Stats bar ──────────────────────────────────────────────────────────────*/
function StatsBar() {
  const stats = [
    { val: '95%', label: 'Less water used' },
    { val: '0',   label: 'Pesticides' },
    { val: '10×', label: 'Higher yield' },
    { val: '365', label: 'Days of harvest' },
  ]
  return (
    <div className="relative" style={{ background: '#030603', borderTop: '1px solid rgba(140,159,78,0.1)', borderBottom: '1px solid rgba(140,159,78,0.1)' }}>
      <div className="max-w-[1400px] mx-auto px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden" style={{ borderRadius: 0 }}>
        {stats.map(({ val, label }, i) => (
          <motion.div key={label}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.08 }}
            className="flex flex-col items-center py-6 px-4 text-center"
            style={{ borderRight: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
            <span className="font-serif font-black mb-1" style={{ fontSize: 'clamp(36px, 4vw, 56px)', color: '#8C9F4E' }}>{val}</span>
            <span className="text-[11px] tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────────────────────────*/
export default function PhilosophyPage() {
  return (
    <main style={{ background: '#040804', minHeight: '100vh' }}>
      <Navbar activePage="Our Philosophy" />
      <Hero />
      <StatsBar />

      {/* Pillars grid */}
      <section className="relative" style={{ background: '#040804' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(140,159,78,0.04) 0%, transparent 60%)' }} />
        <div className="max-w-[1400px] mx-auto px-8 md:px-12 lg:px-16 py-24 md:py-32">

          <motion.div
            initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16 max-w-[640px]"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-[0.28em] uppercase mb-6"
              style={{ background: 'rgba(140,159,78,0.1)', color: '#8C9F4E', border: '1px solid rgba(140,159,78,0.2)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#8C9F4E' }} />
              What We Stand For
            </span>
            <h2 className="font-serif font-bold leading-tight"
              style={{ fontSize: 'clamp(36px, 5vw, 64px)', color: 'rgba(255,255,255,0.95)' }}>
              Growing the<br />
              <span style={{ color: '#8C9F4E', fontStyle: 'italic' }}>Future.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PILLARS.map((p, i) => <PillarCard key={p.number} pillar={p} index={i} />)}
          </div>
        </div>
      </section>

      <Manifesto />

      {/* Footer CTA */}
      <section className="relative py-28" style={{ background: '#030603' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(140,159,78,0.05) 0%, transparent 70%)' }} />
        <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(140,159,78,0.2), transparent)' }} />
        <motion.div
          initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-[700px] mx-auto px-8 text-center"
        >
          <h2 className="font-serif font-bold leading-tight mb-6"
            style={{ fontSize: 'clamp(32px, 5vw, 60px)', color: 'rgba(255,255,255,0.95)' }}>
            The future is here,<br />
            <span style={{ color: '#8C9F4E', fontStyle: 'italic' }}>and it's delicious.</span>
          </h2>
          <p className="text-base md:text-lg leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Join us in building a food system that works for people and the planet.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/products"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold text-sm"
              style={{ background: 'linear-gradient(135deg, #8C9F4E, #5c6b2e)', color: '#fff', boxShadow: '0 0 40px rgba(140,159,78,0.2)' }}>
              Explore Our Products
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href="/about"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold text-sm"
              style={{ color: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.15)' }}>
              About Us
            </a>
          </div>
        </motion.div>
      </section>
    </main>
  )
}
