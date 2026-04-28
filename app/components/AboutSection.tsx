'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

/* ─── Content ─────────────────────────────────────────────────────────────── */
const BLOCKS = [
  {
    headingPlain: 'Farming with a ',
    headingBold: 'Difference',
    body: 'We launched Trufud Trading SPC as a result of our commitment to provide sustainable food production efficacy and support Oman in farming the country in the long run. Through our optimised and innovative farming techniques, we are on a mission to future-proof food production for now and in the times ahead.',
  },
  {
    headingPlain: "Freshness That's ",
    headingBold: 'Superior',
    body: "Vertical farms strategically located near urban centres shortens the distance food travels from farm to table. This minimises transportation's environmental impact and ensures our customers receive the freshest, most nutrient-dense products.",
  },
  {
    headingPlain: 'Fresh Produce, ',
    headingBold: 'Every Day',
    body: 'As a result of precise control over temperature, lighting, and other growing conditions, our farms can produce crops 365 days a year, providing a consistent and reliable supply of fresh, locally-grown produce.',
  },
]

/* ─── Animation variants ──────────────────────────────────────────────────── */
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.16, delayChildren: 0.05 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 44 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}

const fadeUpFast = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}

/* ─── Magnetic button ─────────────────────────────────────────────────────── */
function MagneticButton() {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left - rect.width / 2) * 0.35
    const y = (e.clientY - rect.top - rect.height / 2) * 0.35
    setPos({ x, y })
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setPos({ x: 0, y: 0 }); setHovered(false) }}
      className="inline-block mt-2"
    >
      <motion.a
        href="#"
        animate={{ x: pos.x, y: pos.y, scale: hovered ? 1.06 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-sm overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #00a86b, #006644)', color: '#fff', boxShadow: '0 0 32px rgba(0,168,107,0.25)' }}
      >
        <motion.span
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, transparent 55%)' }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.22 }}
        />
        <span className="relative z-10">Know More</span>
        <motion.span
          className="relative z-10"
          animate={{ x: hovered ? 0 : -6, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </motion.span>
      </motion.a>
    </div>
  )
}

/* ─── Component ───────────────────────────────────────────────────────────── */
export default function AboutSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ background: '#06100a' }}
    >
      {/* Subtle radial glow behind the image side */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 70% at 75% 50%, rgba(0,120,70,0.07) 0%, transparent 70%)' }} />

      {/* Green accent line at top */}
      <div className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,168,107,0.4), transparent)' }} />

      <div className="max-w-[1320px] mx-auto px-6 md:px-12 lg:px-16 py-28 md:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-center">

          {/* ── LEFT — text ── */}
          <motion.div variants={container} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="flex flex-col">

            {/* Badge */}
            <motion.div variants={fadeUp} className="mb-10">
              <span
                className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
                style={{ background: 'rgba(0,168,107,0.12)', color: '#5ecf9a', border: '1px solid rgba(0,168,107,0.2)' }}
              >
                About Trufud Trading SPC
              </span>
            </motion.div>

            {/* Blocks */}
            <div className="flex flex-col divide-y" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              {BLOCKS.map((b, i) => (
                <motion.div key={i} variants={fadeUpFast} className="py-8 first:pt-0 last:pb-0">
                  <h2 className="font-serif text-2xl md:text-3xl mb-3 leading-snug">
                    <span style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 400 }}>{b.headingPlain}</span>
                    <span style={{ color: '#7ecba1', fontWeight: 700, fontStyle: 'italic' }}>{b.headingBold}</span>
                  </h2>
                  <p className="text-sm md:text-base leading-relaxed max-w-[540px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {b.body}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div variants={fadeUp}><MagneticButton /></motion.div>
          </motion.div>

          {/* ── RIGHT — floating image ── */}
          <motion.div
            initial={{ opacity: 0, x: 48 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            {/* Decorative glow blob */}
            <div className="absolute inset-0 pointer-events-none rounded-[32px]"
              style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(0,168,107,0.12) 0%, transparent 65%)' }} />

            {/* Float wrapper */}
            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut' }}
              className="relative w-full max-w-[500px]"
            >
              {/* Shadow ellipse */}
              <motion.div
                animate={{ scaleX: [1, 0.86, 1], opacity: [0.22, 0.1, 0.22] }}
                transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut' }}
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-4/5 h-8 rounded-full pointer-events-none"
                style={{ background: '#00a86b', filter: 'blur(20px)' }}
              />

              {/* Image card */}
              <div className="relative overflow-hidden" style={{ borderRadius: '28px', border: '1px solid rgba(0,168,107,0.15)', boxShadow: '0 40px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,168,107,0.08)' }}>
                <div className="absolute inset-0 z-10 pointer-events-none"
                  style={{ background: 'linear-gradient(160deg, rgba(0,168,107,0.08) 0%, transparent 55%)' }} />
                <img
                  src="/Landing_layoutAbout.jpeg"
                  alt="Trufud vertical hydroponic farm"
                  className="w-full object-cover block"
                  style={{ aspectRatio: '3/4' }}
                  draggable={false}
                />
              </div>

              {/* Chip — top left */}
              <motion.div
                initial={{ opacity: 0, scale: 0.75, x: -10 }}
                animate={inView ? { opacity: 1, scale: 1, x: 0 } : {}}
                transition={{ delay: 0.75, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -left-7 top-10 flex items-center gap-2.5 px-4 py-3 rounded-2xl"
                style={{ background: '#0f1f14', border: '1px solid rgba(0,168,107,0.25)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full text-base" style={{ background: 'rgba(0,168,107,0.15)' }}>🌱</span>
                <div>
                  <p className="text-xs font-bold leading-none" style={{ color: '#5ecf9a' }}>95% Less Water</p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>vs. conventional farming</p>
                </div>
              </motion.div>

              {/* Chip — bottom right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.75, x: 10 }}
                animate={inView ? { opacity: 1, scale: 1, x: 0 } : {}}
                transition={{ delay: 0.95, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -right-7 bottom-16 flex items-center gap-2.5 px-4 py-3 rounded-2xl"
                style={{ background: 'linear-gradient(135deg,#00a86b,#006644)', boxShadow: '0 8px 32px rgba(0,168,107,0.3)' }}
              >
                <span className="text-base">⚡</span>
                <div>
                  <p className="text-xs font-bold leading-none text-white">365 Days</p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.65)' }}>Year-round harvest</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,168,107,0.15), transparent)' }} />
    </section>
  )
}
