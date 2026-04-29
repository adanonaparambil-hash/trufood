'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import {
  motion, AnimatePresence, useInView,
  useMotionValue, useSpring, useTransform,
} from 'framer-motion'

/* ─── Types & Data ───────────────────────────────────────────────────────── */
type Product = { file: string; name: string; desc: string; category: string; origin: string; tags: string[] }

const PRODUCTS: Product[] = [
  { file: 'Arabic_Parsley.png',   name: 'Arabic Parsley',     desc: 'The soul of Middle Eastern cuisine, offering fresh, aromatic depth with a subtle earthy complexity that elevates every dish.',              category: 'Herbs',   origin: 'Vertical Farm', tags: ['Aromatic', 'Fresh']         },
  { file: 'Arugula.png',          name: 'Arugula',            desc: 'A peppery and slightly bitter leafy green, adding a sharp, zesty personality to sophisticated salads and gourmet plates.',                  category: 'Greens',  origin: 'Vertical Farm', tags: ['Peppery', 'Salad']          },
  { file: 'Basil.png',            name: 'Basil',              desc: 'Flavoursome, micro-nutrient rich herb, bringing a sweet and savory warmth to your table every day of the year.',                            category: 'Herbs',   origin: 'Vertical Farm', tags: ['Sweet', 'Aromatic']         },
  { file: 'Cherry_Tomatoes.jpeg', name: 'Cherry Tomatoes',    desc: 'Sweet, tangy, and bursting with natural freshness. Small, vibrant gems that define modern flavor in every bite.',                           category: 'Fruits',  origin: 'Vertical Farm', tags: ['Sweet', 'Vibrant']          },
  { file: 'Curly_Kale.jpeg',      name: 'Curly Kale',         desc: 'Crisp, hearty, and exceptionally rich in nutrients. Defines a new era of robust, healthy eating for the discerning palate.',               category: 'Greens',  origin: 'Vertical Farm', tags: ['Nutrient-Dense', 'Crisp']   },
  { file: 'Encore_Mix.jpeg',      name: 'Encore Mix Lettuce', desc: 'A masterfully curated blend of crisp, tender leaves. The ideal foundation for vibrant, balanced salads with complex texture.',              category: 'Lettuce', origin: 'Vertical Farm', tags: ['Blend', 'Tender']           },
  { file: 'Grapes.jpeg',          name: 'Grapes',             desc: 'Fresh, juicy, and naturally sweet. A timeless jewel for snacking, juicing, and elegant plating at any occasion.',                           category: 'Fruits',  origin: 'Vertical Farm', tags: ['Juicy', 'Sweet']            },
  { file: 'Green_Kale.jpeg',      name: 'Green Kale',         desc: 'A hearty, nutrient-dense green with a bitter complexity, essential for high-performance nutrition and powerful smoothies.',                  category: 'Greens',  origin: 'Vertical Farm', tags: ['Hearty', 'Nutrition']       },
  { file: 'Lettuce_Oakleaf.jpeg', name: 'Lettuce Oakleaf',    desc: 'Delicate, frilled leaves with a mild sweetness. A crisp, elegant foundation for the modern, light palate and refined salads.',              category: 'Lettuce', origin: 'Vertical Farm', tags: ['Delicate', 'Mild']          },
  { file: 'Lollo_Bionda.jpeg',    name: 'Lollo Bionda Green', desc: 'Crunchy, mildly flavoured and refreshing. Offers exceptional texture and architectural form for vibrant, textured salads.',                  category: 'Lettuce', origin: 'Vertical Farm', tags: ['Crunchy', 'Refreshing']     },
  { file: 'Lollo_Rosso.jpeg',     name: 'Lollo Rosso Red',    desc: 'Intense burgundy frilled leaves with a mild flavor and a nutrient-dense architectural form that elevates any presentation.',                 category: 'Lettuce', origin: 'Vertical Farm', tags: ['Burgundy', 'Architectural']  },
  { file: 'Rosemary.jpeg',        name: 'Rosemary',           desc: 'Zesty, fragrant, and bold. A powerful aromatic that brings structural, timeless flavor to every culinary creation.',                        category: 'Herbs',   origin: 'Vertical Farm', tags: ['Bold', 'Fragrant']          },
  { file: 'Thyme.jpeg',           name: 'Thyme',              desc: 'Fragrant, earthy, and classic. The essential savory component for timeless, sophisticated cuisine from every corner of the world.',           category: 'Herbs',   origin: 'Vertical Farm', tags: ['Earthy', 'Classic']         },
  { file: 'Tomatoes.jpeg',        name: 'Tomatoes',           desc: 'Juicy, vibrant, and full of flavor. The cornerstone of freshness in every premium harvest, grown with zero compromise.',                     category: 'Fruits',  origin: 'Vertical Farm', tags: ['Juicy', 'Premium']          },
]

const CATEGORIES = ['All', 'Greens', 'Herbs', 'Lettuce', 'Fruits']

/* ─── Depth config (cycles per card index) ───────────────────────────────── */
const DEPTHS = [
  { z: -22, rx: -1.8, ry: -2.8, phase: 0,   amp: 6  },
  { z: 12,  rx: 1.2,  ry: 1.8,  phase: 1.1, amp: 10 },
  { z: 42,  rx: -2.2, ry: -1.2, phase: 2.2, amp: 13 },
  { z: 8,   rx: 1.8,  ry: -2.2, phase: 3.3, amp: 8  },
  { z: -28, rx: -1.2, ry: 2.2,  phase: 4.4, amp: 5  },
]

/* ─── CSS-only particles (zero JS animation cost) ────────────────────────── */
function ParticleField() {
  const pts = useMemo(() =>
    Array.from({ length: 14 }, (_, i) => ({
      id:    i,
      left:  `${7 + (i * 6.5) % 86}%`,
      top:   `${10 + (i * 8.1) % 80}%`,
      size:  1.4 + (i % 3) * 0.8,
      dur:   `${9 + (i % 5) * 2.2}s`,
      del:   `${-(i * 1.3) % 9}s`,
      op:    0.045 + (i % 4) * 0.022,
      green: i % 3 !== 0,
      dx:    `${(i % 2 === 0 ? 1 : -1) * (7 + (i % 4) * 4)}px`,
      dy:    `-${20 + (i % 5) * 12}px`,
    })), [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {pts.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left, top: p.top,
            width: p.size, height: p.size,
            background: p.green ? 'rgba(140,159,78,0.9)' : 'rgba(255,255,255,0.7)',
            // CSS custom properties for the keyframe
            ['--p-op' as string]: p.op,
            ['--p-dx' as string]: p.dx,
            ['--p-dy' as string]: p.dy,
            animation: `particle-drift ${p.dur} ${p.del} infinite ease-in-out`,
          }}
        />
      ))}
    </div>
  )
}

/* ─── Cursor glow ────────────────────────────────────────────────────────── */
function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (!ref.current) return
      ref.current.style.left = e.clientX + 'px'
      ref.current.style.top  = e.clientY + 'px'
    }
    window.addEventListener('mousemove', fn)
    return () => window.removeEventListener('mousemove', fn)
  }, [])
  return (
    <div
      ref={ref}
      className="pointer-events-none fixed z-[9990] -translate-x-1/2 -translate-y-1/2"
      style={{
        width: 480, height: 480,
        background: 'radial-gradient(circle, rgba(140,159,78,0.052) 0%, transparent 65%)',
        borderRadius: '50%',
        transition: 'left 0.18s ease, top 0.18s ease',
      }}
    />
  )
}

/* ─── Premium product card ───────────────────────────────────────────────── */
function ProductCard({
  product, index, depthIdx, anyOpen, thisOpen, onClick,
}: {
  product: Product; index: number; depthIdx: number
  anyOpen: boolean; thisOpen: boolean
  onClick: () => void
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const inView  = useInView(wrapRef, { once: true, margin: '-70px' })
  const dep     = DEPTHS[depthIdx % DEPTHS.length]

  /* per-card mouse tilt */
  const mx   = useMotionValue(0)
  const my   = useMotionValue(0)
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 260, damping: 26 })
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 260, damping: 26 })
  const finalRotX = useTransform(rotX, v => v + dep.rx)
  const finalRotY = useTransform(rotY, v => v + dep.ry)

  /* glare position */
  const glX = useTransform(mx, [-0.5, 0.5], ['8%', '92%'])
  const glY = useTransform(my, [-0.5, 0.5], ['8%', '92%'])

  const [hov, setHov]     = useState(false)
  const [swept, setSwept] = useState(false)

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = wrapRef.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - r.left) / r.width  - 0.5)
    my.set((e.clientY - r.top)  / r.height - 0.5)
  }, [mx, my])

  const onEnter = useCallback(() => {
    setHov(true)
    setSwept(false)
    requestAnimationFrame(() => {
      setSwept(true)
      setTimeout(() => setSwept(false), 900)
    })
  }, [])

  const onLeave = useCallback(() => {
    mx.set(0); my.set(0); setHov(false)
  }, [mx, my])

  const isFront    = dep.z > 30
  const baseScale  = isFront ? 1.045 : dep.z > 0 ? 1.01 : 0.972
  const stagger    = (index % 5) * 0.09
  const isDefocused = anyOpen && !thisOpen

  return (
    <div ref={wrapRef}>
      {/* ── Layer 1: scroll-in visibility ── */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={inView ? {
          opacity: isDefocused ? 0.28 : 1,
          y:  0,
          scale: isDefocused ? 0.93 : 1,
          filter: isDefocused ? 'blur(3.5px)' : 'blur(0px)',
        } : {}}
        transition={{
          opacity: { duration: 0.72, delay: stagger, ease: [0.22, 1, 0.36, 1] },
          scale:   { duration: 0.72, delay: stagger, ease: [0.22, 1, 0.36, 1] },
          y:       { duration: 0.72, delay: stagger, ease: [0.22, 1, 0.36, 1] },
          filter:  { duration: 0.45 },
        }}
      >
        {/* ── Layer 2: CSS idle float (separate element, no transform conflict) ── */}
        <div
          style={inView ? {
            ['--amp' as string]: `${dep.amp}px`,
            animation: `card-float ${4.8 + dep.phase * 0.28}s ${dep.phase * 0.6}s infinite ease-in-out`,
          } : {}}
        >
        {/* ── Layer 3: tilt + depth ── */}
        <motion.div
          style={{
            rotateX: finalRotX,
            rotateY: finalRotY,
            z: dep.z,
            perspective: 900,
            transformStyle: 'preserve-3d',
            willChange: 'transform',
            borderRadius: 22,
          }}
          animate={{ scale: hov ? baseScale * 1.062 : baseScale }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          onMouseMove={onMove}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          onClick={onClick}
          className="relative cursor-pointer"
        >
              {/* Glass shell */}
              <div
                className="absolute inset-0"
                style={{
                  borderRadius: 22,
                  background: hov
                    ? 'linear-gradient(148deg, rgba(30,52,20,0.97) 0%, rgba(20,32,18,0.99) 100%)'
                    : 'linear-gradient(148deg, rgba(20,30,18,0.88) 0%, rgba(15,22,14,0.93) 100%)',
                  backdropFilter:       'blur(22px)',
                  WebkitBackdropFilter: 'blur(22px)',
                  border: `1px solid ${hov ? 'rgba(140,159,78,0.58)' : 'rgba(140,159,78,0.11)'}`,
                  boxShadow: hov
                    ? '0 0 0 1px rgba(140,159,78,0.18), 0 28px 75px rgba(0,0,0,0.68), 0 0 55px rgba(140,159,78,0.07), inset 0 1px 0 rgba(255,255,255,0.08)'
                    : `0 ${5 + dep.z / 8}px 32px rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,255,255,0.03)`,
                  transition: 'border-color 0.4s, box-shadow 0.4s, background 0.4s',
                }}
              />

              {/* Top gradient border shine */}
              <div
                className="absolute top-0 inset-x-5 h-px pointer-events-none"
                style={{
                  borderRadius: 1,
                  background: `linear-gradient(90deg, transparent, rgba(140,159,78,${hov ? 0.95 : 0.28}), transparent)`,
                  transition: 'opacity 0.4s',
                }}
              />

              {/* Dynamic glare */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  borderRadius: 22,
                  background: `radial-gradient(circle at ${glX} ${glY}, rgba(140,159,78,0.18) 0%, transparent 58%)`,
                  opacity: hov ? 1 : 0,
                  transition: 'opacity 0.32s',
                }}
              />

              {/* Light sweep on enter */}
              {swept && (
                <div
                  className="absolute inset-0 overflow-hidden pointer-events-none"
                  style={{ borderRadius: 22, zIndex: 8 }}
                >
                  <motion.div
                    style={{
                      position: 'absolute',
                      top: '-15%', left: 0,
                      width: '38%', height: '130%',
                      background: 'linear-gradient(108deg, transparent 28%, rgba(255,255,255,0.072) 50%, transparent 72%)',
                      transform: 'skewX(-14deg)',
                    }}
                    initial={{ x: '-90%' }}
                    animate={{ x: '420%' }}
                    transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              )}

              {/* Front-card accent line (left) */}
              {isFront && (
                <div
                  className="absolute left-0 top-8 bottom-8 w-0.5"
                  style={{
                    borderRadius: 1,
                    background: 'linear-gradient(180deg, transparent, rgba(140,159,78,0.55), transparent)',
                  }}
                />
              )}

              {/* ── Image zone ── */}
              <div
                className="relative flex items-center justify-center overflow-hidden"
                style={{ height: 192, background: 'rgba(255,255,255,0.008)' }}
              >
                {/* Ghost name watermark */}
                <span
                  className="absolute inset-0 flex items-center justify-center font-serif font-black select-none pointer-events-none text-center"
                  style={{
                    fontSize: 'clamp(20px, 2.6vw, 34px)',
                    color: `rgba(140,159,78,${hov ? 0.1 : 0.033})`,
                    letterSpacing: '-0.02em',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    transition: 'color 0.5s',
                    padding: '0 12px',
                  }}
                >
                  {product.name}
                </span>

                {/* Ambient light behind product */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse 65% 65% at 50% 68%, rgba(140,159,78,${hov ? 0.14 : 0.04}) 0%, transparent 72%)`,
                    transition: 'background 0.5s',
                  }}
                />

                {/* Product image */}
                <motion.img
                  src={`/products/${product.file}`}
                  alt={product.name}
                  className="relative z-10 object-contain select-none"
                  style={{ width: '76%', height: '76%', objectFit: 'contain', pointerEvents: 'none' }}
                  animate={{
                    scale: hov ? 1.14 : 1,
                    y: hov ? -8 : 0,
                    filter: hov
                      ? 'drop-shadow(0 20px 38px rgba(0,0,0,0.58)) drop-shadow(0 0 22px rgba(140,159,78,0.2))'
                      : 'drop-shadow(0 10px 22px rgba(0,0,0,0.52))',
                  }}
                  transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
                  draggable={false}
                />

                {/* Category pill */}
                <div
                  className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full"
                  style={{
                    background:       'rgba(17,26,15,0.88)',
                    backdropFilter:   'blur(12px)',
                    border:           '1px solid rgba(140,159,78,0.2)',
                    fontSize:          7.5,
                    fontWeight:        700,
                    letterSpacing:    '0.14em',
                    textTransform:    'uppercase',
                    color:            'rgba(140,159,78,0.78)',
                  }}
                >
                  {product.category}
                </div>

                {/* Index */}
                <div
                  className="absolute bottom-2.5 right-3 font-mono z-20"
                  style={{ fontSize: 9, color: 'rgba(140,159,78,0.28)', letterSpacing: '0.06em' }}
                >
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>

              {/* ── Info zone ── */}
              <div
                className="relative px-4 pt-3.5 pb-4"
                style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
              >
                <h3
                  className="text-[13px] font-semibold leading-tight mb-2"
                  style={{
                    color: hov ? '#c8da8e' : 'rgba(255,255,255,0.86)',
                    transition: 'color 0.3s',
                  }}
                >
                  {product.name}
                </h3>

                {/* Description — slides in on hover */}
                <AnimatePresence initial={false}>
                  {hov && (
                    <motion.p
                      key="desc"
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginBottom: 10 }}
                      exit={  { opacity: 0, height: 0,    marginBottom: 0  }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="overflow-hidden text-[10px] leading-relaxed"
                      style={{ color: 'rgba(255,255,255,0.42)' }}
                    >
                      {product.desc.split(' ').slice(0, 14).join(' ')}…
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Glowing tag pills */}
                <div className="flex gap-1.5 flex-wrap mb-3">
                  {product.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full text-[8px] font-semibold"
                      style={{
                        background:  hov ? 'rgba(140,159,78,0.16)' : 'rgba(140,159,78,0.07)',
                        color:       hov ? '#b8d07e'               : 'rgba(140,159,78,0.48)',
                        border:     `1px solid ${hov ? 'rgba(140,159,78,0.35)' : 'rgba(140,159,78,0.1)'}`,
                        boxShadow:   hov ? '0 0 10px rgba(140,159,78,0.14)' : 'none',
                        transition: 'all 0.35s',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA — slides up on hover */}
                <AnimatePresence initial={false}>
                  {hov && (
                    <motion.div
                      key="cta"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={  { opacity: 0, y: 5 }}
                      transition={{ duration: 0.24, delay: 0.06 }}
                    >
                      <button
                        className="w-full py-2 rounded-xl text-[9px] font-bold tracking-[0.16em] uppercase"
                        style={{
                          background: 'rgba(140,159,78,0.1)',
                          border:    '1px solid rgba(140,159,78,0.32)',
                          color:     '#a8c46e',
                          boxShadow: '0 0 18px rgba(140,159,78,0.09)',
                        }}
                      >
                        Explore Product →
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom shimmer line */}
              <motion.div
                className="absolute bottom-0 inset-x-0 h-px pointer-events-none"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(140,159,78,0.75), transparent)' }}
                animate={{ opacity: hov ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

/* ─── Hero expand modal ──────────────────────────────────────────────────── */
function HeroModal({
  product, index, total, onClose, onPrev, onNext,
}: {
  product: Product; index: number; total: number
  onClose: () => void; onPrev: () => void; onNext: () => void
}) {
  const imgMX = useMotionValue(0.5)
  const imgMY = useMotionValue(0.5)
  const dynRotY = useSpring(useTransform(imgMX, [0, 1], [-18, 18]), { stiffness: 70, damping: 18 })
  const dynRotX = useSpring(useTransform(imgMY, [0, 1], [ 9, -9]), { stiffness: 70, damping: 18 })

  const onMove = (e: React.MouseEvent) => {
    imgMX.set(e.clientX / window.innerWidth)
    imgMY.set(e.clientY / window.innerHeight)
  }

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape')      onClose()
      if (e.key === 'ArrowLeft')   onPrev()
      if (e.key === 'ArrowRight')  onNext()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose, onPrev, onNext])

  /* staggered detail reveal */
  const detail = {
    hidden:  { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { delay: 0.08 + i * 0.075, duration: 0.48, ease: [0.22, 1, 0.36, 1] },
    }),
  }

  return (
    <motion.div
      className="fixed inset-0 z-[9000] flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={  { opacity: 0 }}
      transition={{ duration: 0.32 }}
      onMouseMove={onMove}
    >
      {/* Blurred backdrop */}
      <motion.div
        className="absolute inset-0 cursor-pointer"
        style={{ background: 'rgba(17,26,18,0.96)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)' }}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={  { opacity: 0 }}
        transition={{ duration: 0.38 }}
      />

      {/* Modal card */}
      <motion.div
        className="relative z-10 w-full max-w-5xl overflow-hidden overflow-y-auto"
        style={{
          borderRadius: 24,
          border:     '1px solid rgba(140,159,78,0.24)',
          boxShadow:  '0 55px 150px rgba(0,0,0,0.82), 0 0 90px rgba(140,159,78,0.065)',
          maxHeight: '90vh',
        }}
        initial={{ scale: 0.82, y: 55, opacity: 0 }}
        animate={{ scale: 1,    y: 0,  opacity: 1 }}
        exit={  { scale: 0.88, y: 28,  opacity: 0 }}
        transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* LEFT — 3D image */}
          <div
            className="relative flex items-center justify-center overflow-hidden"
            style={{ background: 'linear-gradient(148deg, #1a3020, #111a12)', minHeight: 260, maxHeight: 420 }}
          >
            {/* Radial ambient glow */}
            <div
              className="absolute inset-0"
              style={{ background: 'radial-gradient(ellipse 72% 72% at 50% 52%, rgba(140,159,78,0.12) 0%, transparent 70%)' }}
            />

            {/* Ghost name */}
            <span
              className="absolute inset-0 flex items-center justify-center font-serif font-black select-none pointer-events-none text-center px-8"
              style={{
                fontSize: 'clamp(44px, 7vw, 86px)',
                color: 'rgba(140,159,78,0.038)',
                letterSpacing: '-0.03em',
                lineHeight: 1,
              }}
            >
              {product.name}
            </span>

            {/* Top accent */}
            <div
              className="absolute top-0 inset-x-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(140,159,78,0.55), transparent)' }}
            />

            {/* Corner shine */}
            <div
              className="absolute top-0 right-0 w-36 h-36 pointer-events-none"
              style={{ background: 'radial-gradient(circle at top right, rgba(140,159,78,0.09) 0%, transparent 60%)' }}
            />

            {/* 3D rotating product image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={product.file}
                className="relative z-10 flex items-center justify-center"
                style={{
                  width: '74%', height: '74%',
                  perspective: 1100,
                }}
                initial={{ opacity: 0, scale: 0.78, rotateY: -25 }}
                animate={{ opacity: 1, scale: 1,    rotateY: 0   }}
                exit={  { opacity: 0, scale: 0.86,  rotateY: 18  }}
                transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.img
                  src={`/products/${product.file}`}
                  alt={product.name}
                  className="w-full h-full object-contain select-none"
                  style={{
                    rotateX: dynRotX,
                    rotateY: dynRotY,
                    filter: 'drop-shadow(0 28px 60px rgba(0,0,0,0.68)) drop-shadow(0 0 34px rgba(140,159,78,0.14))',
                  }}
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>

            {/* Progress counter */}
            <div
              className="absolute bottom-5 left-6 font-mono"
              style={{ fontSize: 10, color: 'rgba(140,159,78,0.42)', letterSpacing: '0.14em' }}
            >
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </div>

            {/* Scan line */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.015) 3px, rgba(0,0,0,0.015) 4px)',
              }}
            />
          </div>

          {/* RIGHT — details */}
          <div
            className="relative flex flex-col p-8 md:p-10"
            style={{ background: 'linear-gradient(148deg, #172019, #111a12)', minHeight: 300 }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border:     '1px solid rgba(255,255,255,0.1)',
                color:      'rgba(255,255,255,0.42)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={product.name}
                className="flex flex-col h-full"
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {/* Category + tags — hidden in modal header */}

                {/* Name */}
                <motion.h2
                  custom={1}
                  variants={detail}
                  className="font-serif font-bold leading-[1.05] mb-4"
                  style={{
                    fontSize: 'clamp(26px, 4vw, 50px)',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(200,218,142,0.88) 60%, rgba(140,159,78,0.75) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor:  'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {product.name}
                </motion.h2>

                {/* Description */}
                <motion.p
                  custom={2}
                  variants={detail}
                  className="text-sm leading-relaxed mb-8"
                  style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 380 }}
                >
                  {product.desc}
                </motion.p>

                {/* Specs */}
                <motion.div custom={3} variants={detail} className="flex flex-col mb-8">
                  {[
                    { label: 'Origin',        value: product.origin      },
                    { label: 'Method',        value: 'NFT Hydroponics'   },
                    { label: 'Pesticides',    value: 'Zero'              },
                    { label: 'Availability',  value: 'Year-round'        },
                    { label: 'Certification', value: 'Premium Organic'   },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between py-3"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.27)' }}>{label}</span>
                      <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{value}</span>
                    </div>
                  ))}
                </motion.div>

                {/* Navigation */}
                <motion.div custom={4} variants={detail} className="flex items-center gap-3 mt-auto">
                  <button
                    onClick={onPrev}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold"
                    style={{
                      background: 'rgba(140,159,78,0.1)',
                      border:     '1px solid rgba(140,159,78,0.24)',
                      color:      '#8C9F4E',
                      transition: 'transform 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Prev
                  </button>

                  <button
                    onClick={onNext}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold"
                    style={{
                      background: 'rgba(140,159,78,0.1)',
                      border:     '1px solid rgba(140,159,78,0.24)',
                      color:      '#8C9F4E',
                      transition: 'transform 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    Next
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {/* Dot progress */}
                  <div className="flex items-center gap-1 ml-auto">
                    {Array.from({ length: Math.min(total, 14) }).map((_, i) => (
                      <span
                        key={i}
                        className="block rounded-full"
                        style={{
                          width:      i === index ? 18 : 4,
                          height:     4,
                          background: i === index ? '#8C9F4E' : 'rgba(255,255,255,0.1)',
                          transition: 'all 0.3s',
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Main export ────────────────────────────────────────────────────────── */
export default function ProductShowcase() {
  const [activeCat,   setActiveCat]   = useState('All')
  const [modalIndex,  setModalIndex]  = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const inView     = useInView(sectionRef, { once: true, margin: '-100px' })

  const filtered = activeCat === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === activeCat)

  const openModal  = (i: number) => setModalIndex(i)
  const closeModal = ()           => setModalIndex(null)
  const prevModal  = ()           => setModalIndex(i => i !== null ? (i - 1 + filtered.length) % filtered.length : 0)
  const nextModal  = ()           => setModalIndex(i => i !== null ? (i + 1)                   % filtered.length : 0)

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ background: '#111a12', minHeight: '100vh' }}
    >
      <CursorGlow />
      <ParticleField />

      {/* Ambient layers */}
      <div className="absolute top-0  inset-x-0 h-px pointer-events-none"  style={{ background: 'linear-gradient(90deg, transparent, rgba(140,159,78,0.38), transparent)' }} />
      <div className="absolute bottom-0 inset-x-0 h-px pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, rgba(140,159,78,0.14), transparent)' }} />
      <div className="absolute inset-0 pointer-events-none"                  style={{ background: 'radial-gradient(ellipse 55% 28% at 50% 0%, rgba(140,159,78,0.065) 0%, transparent 55%)' }} />
      <div className="absolute left-0  top-1/3  w-80 h-80 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(140,159,78,0.028) 0%, transparent 70%)' }} />
      <div className="absolute right-0 bottom-1/4 w-80 h-80 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(140,159,78,0.022) 0%, transparent 70%)' }} />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-5 md:px-10 lg:px-16 py-14 md:py-24">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 md:mb-14"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 sm:gap-8">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8" style={{ background: 'rgba(140,159,78,0.65)' }} />
                <span className="text-[10px] font-bold tracking-[0.24em] uppercase" style={{ color: 'rgba(140,159,78,0.72)' }}>
                  Vertical Farm Collection
                </span>
              </div>

              <h2
                className="font-serif font-bold leading-[0.92] mb-4"
                style={{
                  fontSize: 'clamp(40px, 5.8vw, 76px)',
                  background: 'linear-gradient(138deg, rgba(255,255,255,0.96) 0%, rgba(200,218,142,0.84) 50%, rgba(140,159,78,0.68) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor:  'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.035em',
                }}
              >
                Living<br />Greens
              </h2>

              <p className="text-sm leading-relaxed max-w-[280px]" style={{ color: 'rgba(255,255,255,0.36)' }}>
                Precision-grown in climate-controlled vertical farms. Harvested at peak freshness with zero compromise.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-8 items-end pb-1">
              {[
                { n: '14+', l: 'Varieties'  },
                { n: '0',   l: 'Pesticides' },
                { n: '365', l: 'Days/Year'  },
              ].map(({ n, l }) => (
                <div key={l} className="text-right">
                  <div
                    className="font-serif font-bold leading-none mb-1"
                    style={{ fontSize: 'clamp(24px, 3.2vw, 40px)', color: 'rgba(168,196,110,0.88)' }}
                  >
                    {n}
                  </div>
                  <div className="text-[9px] tracking-[0.16em] uppercase" style={{ color: 'rgba(255,255,255,0.22)' }}>
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Category filter ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.2 }}
          className="flex items-center gap-2 mb-8 md:mb-11 overflow-x-auto pb-2 scrollbar-none"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className="relative px-5 py-2 rounded-full text-[11px] font-semibold tracking-wide"
              style={{
                background:  cat === activeCat ? 'rgba(140,159,78,0.16)' : 'rgba(255,255,255,0.04)',
                border:     `1px solid ${cat === activeCat ? 'rgba(140,159,78,0.48)' : 'rgba(255,255,255,0.07)'}`,
                color:       cat === activeCat ? '#c8da8e'               : 'rgba(255,255,255,0.36)',
                boxShadow:   cat === activeCat ? '0 0 26px rgba(140,159,78,0.13)' : 'none',
                transition:  'all 0.3s',
              }}
            >
              {cat}
              {cat !== 'All' && (
                <span className="ml-1.5 text-[9px]" style={{ color: 'rgba(140,159,78,0.45)' }}>
                  {PRODUCTS.filter(p => p.category === cat).length}
                </span>
              )}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2.5">
            <div className="h-px w-5" style={{ background: 'rgba(140,159,78,0.28)' }} />
            <span className="font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.17)' }}>
              {filtered.length} items
            </span>
          </div>
        </motion.div>

        {/* ── 3D depth product grid ── */}
        <div style={{ perspective: '1100px', perspectiveOrigin: '50% 38%' }}>
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => (
                <motion.div
                  key={p.file}
                  layout
                  initial={{ opacity: 0, scale: 0.86 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={  { opacity: 0, scale: 0.82 }}
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ProductCard
                    product={p}
                    index={PRODUCTS.indexOf(p)}
                    depthIdx={i}
                    anyOpen={modalIndex !== null}
                    thisOpen={modalIndex === i}
                    onClick={() => openModal(i)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ── Footer hint ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.1 }}
          className="flex items-center justify-center gap-5 mt-16"
        >
          <div className="h-px flex-1 max-w-20" style={{ background: 'linear-gradient(90deg, transparent, rgba(140,159,78,0.22))' }} />
          <p className="text-[10px] tracking-[0.22em] uppercase" style={{ color: 'rgba(255,255,255,0.13)' }}>
            Click to explore · ← → keys to navigate
          </p>
          <div className="h-px flex-1 max-w-20" style={{ background: 'linear-gradient(90deg, rgba(140,159,78,0.22), transparent)' }} />
        </motion.div>
      </div>

      {/* ── Hero modal ── */}
      <AnimatePresence>
        {modalIndex !== null && (
          <HeroModal
            product={filtered[modalIndex]}
            index={modalIndex}
            total={filtered.length}
            onClose={closeModal}
            onPrev={prevModal}
            onNext={nextModal}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
