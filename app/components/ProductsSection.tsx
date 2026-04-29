'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

/* ─── Products data ───────────────────────────────────────────────────────── */
const PRODUCTS = [
  {
    name: 'Lettuce',
    arabicName: 'سخ',
    img: '/Package_lettuce.png',
    tags: ['Hydroponics', 'Ready-to-Eat', 'Non-GMO'],
    weight: '100g',
    accentColor: '#00c47a',
    desc: 'Crisp, vibrant lettuce grown under precision-controlled LED lighting. Rinsed and ready straight from the pack.',
  },
  {
    name: 'Spinach & Green Mix',
    arabicName: 'سبانخ و مزيج',
    img: '/Package_spinach_greenmix.png',
    tags: ['Hydroponics', 'Ready-to-Eat', 'Non-GMO'],
    weight: '100g',
    accentColor: '#4caf72',
    desc: 'Tender baby spinach paired with a vibrant green crunchy mix — two nutrient powerhouses in one pack.',
  },
  {
    name: 'Super Salad Greens',
    arabicName: 'سوبر سالاد جرينز',
    img: '/Package_salad_greens.png',
    tags: ['Hydroponics', 'Ready-to-Eat', 'Non-GMO'],
    weight: '100g',
    accentColor: '#88c96a',
    desc: 'A chef-quality blend of Frisée, Lollo Bionda, Green Romaine, Lollo Rosso, and Red Oakleaf.',
  },
]

/* ─── Slide direction ─────────────────────────────────────────────────────── */
type Dir = 1 | -1

const slideVariants = {
  enter: (dir: Dir) => ({ x: dir * 260, opacity: 0, scale: 0.88 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: Dir) => ({ x: dir * -260, opacity: 0, scale: 0.88 }),
}

/* ─── Product carousel ────────────────────────────────────────────────────── */
function ProductCarousel() {
  const [[active, dir], setSlide] = useState<[number, Dir]>([0, 1])
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const goTo = useCallback((next: number, d: Dir) => {
    setSlide([next, d])
  }, [])

  const prev = () => {
    const n = (active - 1 + PRODUCTS.length) % PRODUCTS.length
    goTo(n, -1)
  }
  const next = () => {
    const n = (active + 1) % PRODUCTS.length
    goTo(n, 1)
  }

  /* Auto-advance every 4 s */
  useEffect(() => {
    timerRef.current = setTimeout(next, 4500)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [active])

  const product = PRODUCTS[active]

  return (
    <div className="relative flex flex-col items-center w-full">
      {/* Card stage */}
      <div className="relative w-full max-w-[380px] sm:max-w-[440px] mx-auto" style={{ height: '380px', minHeight: '320px' }}>

        {/* Ambient glow that changes colour per product */}
        <motion.div
          animate={{ background: `radial-gradient(ellipse 70% 60% at 50% 60%, ${product.accentColor}22 0%, transparent 70%)` }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 pointer-events-none rounded-[32px]"
        />

        <AnimatePresence initial={false} custom={dir} mode="wait">
          <motion.div
            key={active}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.48, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-0 flex items-center justify-center p-6"
          >
            {/* Product card */}
            <div
              className="relative w-full h-full flex flex-col items-center justify-center rounded-[28px] overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, #1a2e1c 0%, #111a12 100%)',
                border: `1px solid ${product.accentColor}30`,
                boxShadow: `0 40px 100px rgba(0,0,0,0.5), 0 0 60px ${product.accentColor}12`,
              }}
            >
              {/* Subtle top shimmer */}
              <div className="absolute top-0 inset-x-0 h-32 pointer-events-none"
                style={{ background: `linear-gradient(to bottom, ${product.accentColor}10, transparent)` }} />

              {/* Weight badge */}
              <div
                className="absolute top-5 right-5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase"
                style={{ background: `${product.accentColor}20`, color: product.accentColor, border: `1px solid ${product.accentColor}30` }}
              >
                {product.weight}
              </div>

              {/* Arabic name */}
              <p className="absolute top-5 left-5 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'serif', direction: 'rtl' }}>
                {product.arabicName}
              </p>

              {/* Product image */}
              <motion.img
                src={product.img}
                alt={product.name}
                className="w-4/5 object-contain drop-shadow-2xl"
                style={{ maxHeight: '220px' }}
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                draggable={false}
              />

              {/* Tags */}
              <div className="absolute bottom-5 inset-x-5 flex justify-center gap-2 flex-wrap">
                {product.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Product name */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
          className="text-center mt-4"
        >
          <p className="text-lg font-bold" style={{ color: '#fff' }}>{product.name}</p>
          <p className="text-sm mt-1 max-w-[340px] mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {product.desc}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Nav arrows + dots */}
      <div className="flex items-center gap-6 mt-8">
        {/* Prev */}
        <button
          onClick={prev}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
          aria-label="Previous product"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {PRODUCTS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > active ? 1 : -1)}
              className="transition-all duration-300"
              style={{
                width: i === active ? '24px' : '6px',
                height: '6px',
                borderRadius: '999px',
                background: i === active ? PRODUCTS[active].accentColor : 'rgba(255,255,255,0.2)',
              }}
              aria-label={`Go to product ${i + 1}`}
            />
          ))}
        </div>

        {/* Next */}
        <button
          onClick={next}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
          aria-label="Next product"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  )
}

/* ─── Left content ────────────────────────────────────────────────────────── */
function LeftContent({ inView }: { inView: boolean }) {
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15, delayChildren: 0.05 } },
  }
  const fadeUp = {
    hidden: { opacity: 0, y: 36 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="flex flex-col justify-center"
    >
      {/* Badge */}
      <motion.div variants={fadeUp} className="mb-8">
        <span
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
          style={{ background: 'rgba(0,168,107,0.12)', color: '#5ecf9a', border: '1px solid rgba(0,168,107,0.2)' }}
        >
          <span>🛒</span> Our Products
        </span>
      </motion.div>

      {/* Heading */}
      <motion.h2 variants={fadeUp} className="font-serif leading-tight mb-4 md:mb-6">
        <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold" style={{ color: 'rgba(255,255,255,0.92)' }}>
          Packed with
        </span>
        <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold italic" style={{ color: '#00c47a' }}>
          Goodness
        </span>
      </motion.h2>

      {/* Body */}
      <motion.p variants={fadeUp} className="text-sm md:text-base leading-relaxed mb-6 max-w-[480px]" style={{ color: 'rgba(255,255,255,0.52)' }}>
        Our ready-to-eat salad mixes and packaged greens are carefully designed to deliver fresh flavours and wholesome nutrition in every bite. Conveniently packaged for your busy lifestyle, each serving is a perfect blend of quality and taste, making healthy eating effortless and delicious.
      </motion.p>

      {/* Store info */}
      <motion.div variants={fadeUp} className="flex items-start gap-3 p-4 rounded-2xl mb-8" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <span className="text-lg mt-0.5">📍</span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#5ecf9a' }}>Available In-Store</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
            The Sultan Centre, Al Fair and Spinneys stores across Oman.
          </p>
        </div>
      </motion.div>

      {/* Attributes */}
      <motion.div variants={fadeUp} className="grid grid-cols-3 gap-2 md:gap-3 mb-6 md:mb-8">
        {[
          { icon: '🌿', label: 'Hydroponics' },
          { icon: '✅', label: 'Ready-to-Eat' },
          { icon: '🚫', label: 'Non-GMO' },
        ].map(({ icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2 p-3 rounded-xl text-center"
            style={{ background: 'rgba(0,168,107,0.07)', border: '1px solid rgba(0,168,107,0.12)' }}
          >
            <span className="text-xl">{icon}</span>
            <span className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>{label}</span>
          </div>
        ))}
      </motion.div>

      {/* View All CTA */}
      <motion.div variants={fadeUp}>
        <a
          href="/products"
          className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl font-semibold text-sm group transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(0,168,107,0.18), rgba(0,168,107,0.08))',
            border: '1px solid rgba(0,168,107,0.3)',
            color: '#5ecf9a',
          }}
        >
          <span>Explore All 14 Fresh Products</span>
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </motion.div>
    </motion.div>
  )
}

/* ─── Main export ─────────────────────────────────────────────────────────── */
export default function ProductsSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ background: '#111a12' }}
    >
      {/* Top divider */}
      <div className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,168,107,0.2), transparent)' }} />

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,200,120,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,120,0.8) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 20% 50%, rgba(0,100,60,0.08) 0%, transparent 70%)' }} />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-16 md:py-28 lg:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left */}
          <LeftContent inView={inView} />

          {/* Right — carousel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          >
            <ProductCarousel />
          </motion.div>

        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,168,107,0.15), transparent)' }} />
    </section>
  )
}
