'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'

/* ─── Products ──────────────────────────────────────────────────────────────*/
type Product = { file: string; name: string; desc: string; category: string; origin: string; tags: string[] }

const PRODUCTS: Product[] = [
  { file: 'Arabic_Parsley.png',   name: 'Arabic Parsley',     desc: 'The soul of Middle Eastern cuisine, offering fresh, aromatic depth with a subtle earthy complexity.',                                    category: 'Herbs',    origin: 'Vertical Farm', tags: ['Aromatic', 'Fresh'] },
  { file: 'Arugula.png',          name: 'Arugula',            desc: 'A peppery and slightly bitter leafy green, adding a sharp, zesty personality to sophisticated salads.',                                    category: 'Greens',   origin: 'Vertical Farm', tags: ['Peppery', 'Salad'] },
  { file: 'Basil.png',            name: 'Basil',              desc: 'Flavoursome, micro-nutrient rich herb, bringing a sweet and savory warmth to your table, year-round.',                                     category: 'Herbs',    origin: 'Vertical Farm', tags: ['Sweet', 'Aromatic'] },
  { file: 'Cherry_Tomatoes.jpeg', name: 'Cherry Tomatoes',    desc: 'Sweet, tangy, and bursting with natural freshness. Small, vibrant gems that define modern flavor.',                                        category: 'Fruits',   origin: 'Vertical Farm', tags: ['Sweet', 'Vibrant'] },
  { file: 'Curly_Kale.jpeg',      name: 'Curly Kale',         desc: 'Crisp, hearty, and exceptionally rich in nutrients. Defines a new era of robust, healthy eating.',                                         category: 'Greens',   origin: 'Vertical Farm', tags: ['Nutrient-Dense', 'Crisp'] },
  { file: 'Encore_Mix.jpeg',      name: 'Encore Mix Lettuce', desc: 'A masterfully curated blend of crisp, tender leaves. The ideal foundation for vibrant, balanced salads.',                                  category: 'Lettuce',  origin: 'Vertical Farm', tags: ['Blend', 'Tender'] },
  { file: 'Grapes.jpeg',          name: 'Grapes',             desc: 'Fresh, juicy, and naturally sweet. A timeless jewel for snacking, juicing, and elegant plating.',                                          category: 'Fruits',   origin: 'Vertical Farm', tags: ['Juicy', 'Sweet'] },
  { file: 'Green_Kale.jpeg',      name: 'Green Kale',         desc: 'A hearty, nutrient-dense green with a bitter complexity, essential for high-performance nutrition.',                                        category: 'Greens',   origin: 'Vertical Farm', tags: ['Hearty', 'Nutrition'] },
  { file: 'Lettuce_Oakleaf.jpeg', name: 'Lettuce Oakleaf',    desc: 'Delicate, frilled leaves with a mild sweetness. A crisp foundation for the modern, light palate.',                                         category: 'Lettuce',  origin: 'Vertical Farm', tags: ['Delicate', 'Mild'] },
  { file: 'Lollo_Bionda.jpeg',    name: 'Lollo Bionda Green', desc: 'Crunchy, mildly flavoured and refreshing. Offers exceptional texture for vibrant, textured salads.',                                       category: 'Lettuce',  origin: 'Vertical Farm', tags: ['Crunchy', 'Refreshing'] },
  { file: 'Lollo_Rosso.jpeg',     name: 'Lollo Rosso Red',    desc: 'Intense burgundy frilled leaves with a mild flavor and a nutrient-dense architectural form.',                                              category: 'Lettuce',  origin: 'Vertical Farm', tags: ['Burgundy', 'Architectural'] },
  { file: 'Rosemary.jpeg',        name: 'Rosemary',           desc: 'Zesty, fragrant, and bold. A powerful aromatic that brings structural flavor to any culinary creation.',                                   category: 'Herbs',    origin: 'Vertical Farm', tags: ['Bold', 'Fragrant'] },
  { file: 'Thyme.jpeg',           name: 'Thyme',              desc: 'Fragrant, earthy, and classic. The essential savory component for timeless, sophisticated cuisine.',                                        category: 'Herbs',    origin: 'Vertical Farm', tags: ['Earthy', 'Classic'] },
  { file: 'Tomatoes.jpeg',        name: 'Tomatoes',           desc: 'Juicy, vibrant, and full of flavor. The cornerstone of freshness in every premium harvest.',                                               category: 'Fruits',   origin: 'Vertical Farm', tags: ['Juicy', 'Premium'] },
]

const CATEGORIES = ['All', 'Greens', 'Herbs', 'Lettuce', 'Fruits']

/* ─── Magnetic cursor spotlight ─────────────────────────────────────────────*/
function CursorSpotlight() {
  const spotRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (spotRef.current) {
        spotRef.current.style.left = e.clientX + 'px'
        spotRef.current.style.top  = e.clientY + 'px'
      }
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])
  return (
    <div
      ref={spotRef}
      className="pointer-events-none fixed z-[9990] -translate-x-1/2 -translate-y-1/2"
      style={{
        width: 320, height: 320,
        background: 'radial-gradient(circle, rgba(140,159,78,0.07) 0%, transparent 70%)',
        borderRadius: '50%',
        transition: 'left 0.12s ease, top 0.12s ease',
      }}
    />
  )
}

/* ─── 3D tilt card ───────────────────────────────────────────────────────────*/
function TiltCard({
  product, index, isActive, onClick,
}: {
  product: Product; index: number; isActive: boolean; onClick: () => void
}) {
  const cardRef  = useRef<HTMLDivElement>(null)
  const inView   = useInView(cardRef, { once: true, margin: '-60px' })

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotX   = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]),  { stiffness: 200, damping: 20 })
  const rotY   = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]),  { stiffness: 200, damping: 20 })
  const glowX  = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%'])
  const glowY  = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%'])

  const [hovered, setHovered] = useState(false)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top)  / rect.height - 0.5)
  }, [mouseX, mouseY])

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0); mouseY.set(0); setHovered(false)
  }, [mouseX, mouseY])

  const stagger = (index % 4) * 0.07

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, scale: 0.94 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.65, delay: stagger, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 800 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <motion.div
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative overflow-hidden rounded-2xl"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {/* Glass background */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: isActive
              ? 'linear-gradient(145deg, rgba(20,38,14,0.95) 0%, rgba(12,22,10,0.98) 100%)'
              : 'linear-gradient(145deg, rgba(12,18,10,0.85) 0%, rgba(7,11,7,0.9) 100%)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${isActive ? 'rgba(140,159,78,0.45)' : 'rgba(140,159,78,0.1)'}`,
            boxShadow: isActive
              ? '0 0 0 1px rgba(140,159,78,0.15), 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)'
              : '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)',
            transition: 'border-color 0.3s, box-shadow 0.3s',
          }}
        />

        {/* Dynamic glare highlight */}
        {hovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{
              background: `radial-gradient(circle at ${glowX.get()} ${glowY.get()}, rgba(140,159,78,0.12) 0%, transparent 60%)`,
              opacity: 0.8,
            }}
          />
        )}

        {/* Image area */}
        <div
          className="relative flex items-center justify-center overflow-hidden"
          style={{ height: 160, background: 'rgba(255,255,255,0.015)' }}
        >
          {/* Ghost name behind image */}
          <span
            className="absolute inset-0 flex items-center justify-center font-serif font-black select-none pointer-events-none"
            style={{
              fontSize: 'clamp(28px, 4vw, 42px)',
              color: 'rgba(140,159,78,0.06)',
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              transition: 'opacity 0.3s',
              opacity: hovered ? 1 : 0.4,
            }}
          >
            {product.name}
          </span>

          <motion.img
            src={`/products/${product.file}`}
            alt={product.name}
            className="relative z-10 object-contain drop-shadow-2xl"
            style={{ width: '72%', height: '72%', objectFit: 'contain' }}
            animate={{ scale: hovered ? 1.1 : 1, y: hovered ? -4 : 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            draggable={false}
          />

          {/* Active glow dot */}
          {isActive && (
            <motion.div
              className="absolute top-3 right-3 w-2 h-2 rounded-full z-20"
              style={{ background: '#8C9F4E', boxShadow: '0 0 10px #8C9F4E, 0 0 20px rgba(140,159,78,0.4)' }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}

          {/* Category badge */}
          <div
            className="absolute top-3 left-3 z-20 px-2 py-0.5 rounded-full text-[8px] font-semibold tracking-widest uppercase"
            style={{
              background: 'rgba(5,8,5,0.7)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(140,159,78,0.15)',
              color: 'rgba(140,159,78,0.7)',
            }}
          >
            {product.category}
          </div>
        </div>

        {/* Bottom info */}
        <div
          className="relative px-4 py-3.5"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
        >
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <p
              className="text-[13px] font-semibold leading-tight"
              style={{ color: isActive ? '#a8c46e' : 'rgba(255,255,255,0.82)' }}
            >
              {product.name}
            </p>
            <span
              className="text-[9px] font-mono flex-shrink-0 mt-0.5"
              style={{ color: 'rgba(140,159,78,0.35)' }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          {/* Desc — fades in on hover */}
          <motion.p
            className="text-[10px] leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.38)' }}
            animate={{ opacity: hovered ? 1 : 0, height: hovered ? 'auto' : 0 }}
            transition={{ duration: 0.25 }}
          >
            {product.desc.split(' ').slice(0, 10).join(' ')}…
          </motion.p>

          {/* Tags */}
          <div className="flex gap-1 mt-2">
            {product.tags.map(t => (
              <span
                key={t}
                className="px-1.5 py-0.5 rounded text-[8px] font-medium"
                style={{ background: 'rgba(140,159,78,0.08)', color: 'rgba(140,159,78,0.55)', border: '1px solid rgba(140,159,78,0.1)' }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom shimmer line */}
        <motion.div
          className="absolute bottom-0 inset-x-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #8C9F4E, transparent)' }}
          animate={{ opacity: hovered || isActive ? 0.6 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  )
}

/* ─── Full-screen product modal ──────────────────────────────────────────────*/
function ProductModal({ product, index, total, onClose, onPrev, onNext }: {
  product: Product; index: number; total: number
  onClose: () => void; onPrev: () => void; onNext: () => void
}) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const imgX   = useSpring(useTransform(mouseX, [0, 1], [-12, 12]), { stiffness: 80, damping: 20 })
  const imgY   = useSpring(useTransform(mouseY, [0, 1], [-8, 8]),   { stiffness: 80, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX / window.innerWidth)
    mouseY.set(e.clientY / window.innerHeight)
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, onPrev, onNext])

  return (
    <motion.div
      className="fixed inset-0 z-[9000] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onMouseMove={handleMouseMove}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 cursor-pointer"
        style={{ background: 'rgba(3,5,3,0.92)', backdropFilter: 'blur(24px)' }}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Modal content */}
      <motion.div
        className="relative z-10 w-full max-w-5xl mx-6 grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden"
        style={{ borderRadius: 28, border: '1px solid rgba(140,159,78,0.2)', boxShadow: '0 40px 120px rgba(0,0,0,0.7)' }}
        initial={{ scale: 0.88, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 20, opacity: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Left — image */}
        <div
          className="relative flex items-center justify-center overflow-hidden"
          style={{ background: 'linear-gradient(145deg, #0c1a0e, #070d08)', minHeight: 380 }}
        >
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(140,159,78,0.08) 0%, transparent 70%)' }} />

          {/* Ghost name */}
          <span
            className="absolute inset-0 flex items-center justify-center font-serif font-black select-none pointer-events-none text-center px-4"
            style={{ fontSize: 'clamp(36px, 6vw, 72px)', color: 'rgba(140,159,78,0.05)', letterSpacing: '-0.03em', lineHeight: 1 }}
          >
            {product.name}
          </span>

          <AnimatePresence mode="wait">
            <motion.div
              key={product.file}
              style={{ x: imgX, y: imgY, width: '75%', height: '75%' } as any}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 flex items-center justify-center"
            >
              <img
                src={`/products/${product.file}`}
                alt={product.name}
                className="w-full h-full object-contain drop-shadow-2xl"
                draggable={false}
                style={{ filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.6))' }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Index */}
          <div
            className="absolute bottom-5 left-5 font-mono text-[10px]"
            style={{ color: 'rgba(140,159,78,0.4)' }}
          >
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>
        </div>

        {/* Right — details */}
        <div
          className="relative flex flex-col justify-between p-8 md:p-10"
          style={{ background: 'linear-gradient(145deg, #080f09, #050805)' }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>

          <div>
            {/* Category + tags */}
            <div className="flex items-center gap-2 mb-5">
              <span
                className="px-3 py-1 rounded-full text-[9px] font-semibold tracking-widest uppercase"
                style={{ background: 'rgba(140,159,78,0.12)', color: '#8C9F4E', border: '1px solid rgba(140,159,78,0.22)' }}
              >
                {product.category}
              </span>
              {product.tags.map(t => (
                <span key={t} className="px-2 py-0.5 rounded text-[9px]"
                  style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {t}
                </span>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
              >
                <h2
                  className="font-serif font-bold leading-tight mb-4"
                  style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: 'rgba(255,255,255,0.95)' }}
                >
                  {product.name}
                </h2>
                <p
                  className="text-sm md:text-base leading-relaxed mb-6"
                  style={{ color: 'rgba(255,255,255,0.52)', maxWidth: 380 }}
                >
                  {product.desc}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Spec rows */}
            <div className="flex flex-col gap-2.5 mb-8">
              {[
                { label: 'Origin',     value: product.origin },
                { label: 'Method',     value: 'NFT Hydroponics' },
                { label: 'Pesticides', value: 'Zero' },
                { label: 'Harvest',    value: 'Year-round' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2.5"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</span>
                  <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.72)' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div className="flex items-center gap-3">
            <button
              onClick={onPrev}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all hover:scale-105"
              style={{ background: 'rgba(140,159,78,0.1)', border: '1px solid rgba(140,159,78,0.2)', color: '#8C9F4E' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Prev
            </button>
            <button
              onClick={onNext}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all hover:scale-105"
              style={{ background: 'rgba(140,159,78,0.1)', border: '1px solid rgba(140,159,78,0.2)', color: '#8C9F4E' }}
            >
              Next
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Dot progress */}
            <div className="flex items-center gap-1 ml-auto">
              {Array.from({ length: total }).map((_, i) => (
                <span key={i} className="block rounded-full transition-all duration-300"
                  style={{ width: i === index ? 16 : 4, height: 4, background: i === index ? '#8C9F4E' : 'rgba(255,255,255,0.12)' }} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Main export ────────────────────────────────────────────────────────────*/
export default function ProductShowcase() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [modalIndex, setModalIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })

  const filtered = activeCategory === 'All'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory)

  const openModal  = (i: number) => setModalIndex(i)
  const closeModal = () => setModalIndex(null)
  const prevModal  = () => setModalIndex(i => i !== null ? (i - 1 + filtered.length) % filtered.length : 0)
  const nextModal  = () => setModalIndex(i => i !== null ? (i + 1) % filtered.length : 0)

  return (
    <section ref={sectionRef} className="relative w-full" style={{ background: '#050805', minHeight: '100vh' }}>
      <CursorSpotlight />

      {/* Top accent */}
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(140,159,78,0.3), transparent)' }} />

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(140,159,78,0.04) 0%, transparent 60%)' }} />

      <div className="max-w-[1400px] mx-auto px-5 md:px-10 lg:px-16 py-20 md:py-28">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-[0.28em] uppercase mb-6"
            style={{ background: 'rgba(140,159,78,0.1)', color: '#8C9F4E', border: '1px solid rgba(140,159,78,0.2)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#8C9F4E' }} />
            Our Produce
          </span>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1
                className="font-serif font-bold leading-[0.95] mb-3"
                style={{ fontSize: 'clamp(36px, 6vw, 80px)', color: 'rgba(255,255,255,0.95)' }}
              >
                Farm-Fresh.<br />
                <span style={{ color: '#8C9F4E', fontStyle: 'italic' }}>Every Leaf.</span>
              </h1>
              <p className="text-sm md:text-base max-w-[400px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)' }}>
                {PRODUCTS.length} precision-grown products. Click any to explore in detail.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 md:gap-8">
              {[
                { val: '14', label: 'Products' },
                { val: '0%', label: 'Pesticides' },
                { val: '365', label: 'Days/year' },
              ].map(({ val, label }) => (
                <div key={label} className="text-center">
                  <p className="font-serif text-2xl md:text-3xl font-black" style={{ color: '#8C9F4E' }}>{val}</p>
                  <p className="text-[10px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.28)' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Category filter ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex items-center gap-2 mb-10 flex-wrap"
        >
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="relative px-5 py-2 rounded-full text-[12px] font-medium tracking-wide transition-all duration-300"
              style={{
                background:   cat === activeCategory ? 'rgba(140,159,78,0.18)' : 'rgba(255,255,255,0.04)',
                border:       `1px solid ${cat === activeCategory ? 'rgba(140,159,78,0.5)' : 'rgba(255,255,255,0.08)'}`,
                color:        cat === activeCategory ? '#a8c46e' : 'rgba(255,255,255,0.4)',
                boxShadow:    cat === activeCategory ? '0 0 20px rgba(140,159,78,0.12)' : 'none',
              }}
            >
              {cat}
              {cat !== 'All' && (
                <span className="ml-1.5 text-[9px]" style={{ color: 'rgba(140,159,78,0.5)' }}>
                  {PRODUCTS.filter(p => p.category === cat).length}
                </span>
              )}
            </button>
          ))}

          {/* Count */}
          <span className="ml-auto text-[11px] font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>
            {filtered.length} items
          </span>
        </motion.div>

        {/* ── Product grid ── */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div
                key={p.file}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <TiltCard
                  product={p}
                  index={PRODUCTS.indexOf(p)}
                  isActive={modalIndex === i}
                  onClick={() => openModal(i)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* ── Bottom hint ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-12 text-[11px] tracking-widest uppercase"
          style={{ color: 'rgba(255,255,255,0.15)' }}
        >
          Click any product to explore · Use ← → keys to navigate
        </motion.p>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(140,159,78,0.15), transparent)' }} />

      {/* ── Modal ── */}
      <AnimatePresence>
        {modalIndex !== null && (
          <ProductModal
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
