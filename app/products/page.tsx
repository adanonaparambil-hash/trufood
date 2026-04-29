'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import ProductShowcase from '../components/ProductShowcase'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y   = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const op  = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const scl = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ height: '80vh', minHeight: '480px' }}>
      <motion.div className="absolute inset-0" style={{ y, scale: scl }}>
        <img src="/product_hero.jpeg" alt="Trufud products" className="w-full h-full object-cover object-center" draggable={false} />
      </motion.div>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(17,26,18,0.55) 0%, rgba(17,26,18,0.18) 55%, rgba(17,26,18,0.38) 100%)' }} />
      <div className="absolute inset-x-0 bottom-0 h-56" style={{ background: 'linear-gradient(to top, #111a12 0%, transparent 100%)' }} />
      <div className="absolute inset-x-0 top-0 h-36" style={{ background: 'linear-gradient(to bottom, rgba(17,26,18,0.35) 0%, transparent 100%)' }} />
      <motion.div style={{ opacity: op }}
        className="relative z-10 h-full flex flex-col justify-end pb-16 md:pb-24 px-5 sm:px-8 md:px-16 max-w-[1400px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="mb-4 md:mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-[0.28em] uppercase"
            style={{ background: 'rgba(140,159,78,0.12)', color: '#8C9F4E', border: '1px solid rgba(140,159,78,0.25)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#8C9F4E' }} />
            Our Produce
          </span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif font-bold leading-[0.96] mb-4 md:mb-6"
          style={{ fontSize: 'clamp(36px, 8vw, 110px)', color: 'rgba(255,255,255,0.95)' }}>
          Farm-Fresh.<br /><span style={{ color: '#8C9F4E', fontStyle: 'italic' }}>Every Leaf.</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
          className="text-sm md:text-base lg:text-lg max-w-[520px] leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.55)' }}>
          14 precision-grown products. Zero pesticides. Harvested 365 days a year.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="flex items-center gap-3 mt-8 md:mt-10">
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

export default function ProductsPage() {
  return (
    <main style={{ background: '#111a12' }}>
      <Navbar activePage="Products" />
      <HeroSection />
      <ProductShowcase />
      <Footer />
    </main>
  )
}
