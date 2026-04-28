'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductShowcase from '../components/ProductShowcase'

const NAV_LINKS = ['Home', 'About Us', 'Our Solutions', 'Sustainability', 'Products', 'Contact']

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(5,7,5,0.94)' : 'rgba(5,7,5,0.75)',
        backdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <nav className="max-w-[1400px] mx-auto px-8 h-[72px] flex items-center justify-between gap-8">
        <Link href="/" className="flex-shrink-0 flex items-center gap-2.5">
          <img src="/logo.png" alt="Trufud" className="h-8 w-auto" style={{ filter: 'brightness(0) invert(1)', opacity: 0.9 }} />
          <span className="hidden sm:block text-[9px] tracking-[0.22em] uppercase font-medium" style={{ color: 'rgba(255,255,255,0.38)' }}>
            Trading SPC
          </span>
        </Link>

        <ul className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((l) => (
            <li key={l}>
              <Link
                href={l === 'Home' ? '/' : l === 'About Us' ? '/about' : l === 'Products' ? '/products' : '#'}
                className="relative text-sm font-medium transition-colors duration-200 pb-0.5"
                style={{ color: l === 'Products' ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.45)' }}
              >
                {l === 'Products' && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full" style={{ background: '#8C9F4E' }} />
                )}
                {l}
              </Link>
            </li>
          ))}
        </ul>

        <Link href="#" className="hidden lg:inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full"
          style={{ color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.22)' }}>
          Get In Touch
        </Link>

        <button className="lg:hidden flex flex-col gap-1.5 w-8 h-8 justify-center items-end" onClick={() => setMobileOpen(!mobileOpen)}>
          {[1, 0.65, 0.82].map((w, i) => (
            <span key={i} className="block h-px rounded-full" style={{ width: `${w * 20}px`, background: 'rgba(255,255,255,0.7)' }} />
          ))}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden" style={{ background: 'rgba(5,7,5,0.98)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="px-8 py-6 flex flex-col gap-5">
              {NAV_LINKS.map(l => (
                <Link key={l} href={l === 'Home' ? '/' : l === 'About Us' ? '/about' : l === 'Products' ? '/products' : '#'}
                  className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{l}</Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default function ProductsPage() {
  return (
    <main style={{ background: '#050705' }}>
      <Navbar />
      {/* Spacer for fixed navbar */}
      <div style={{ height: '72px' }} />
      <ProductShowcase />
    </main>
  )
}
