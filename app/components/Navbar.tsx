'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = ['Home', 'About Us', 'Technology', 'Our Philosophy', 'Products', 'Contact']

const NAV_HREF: Record<string, string> = {
  'Home': '/',
  'About Us': '/about',
  'Technology': '/technology',
  'Products': '/products',
}

export default function Navbar({ activePage }: { activePage?: string }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <header
      className="fixed top-0 inset-x-0 z-[9995] transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(10,12,10,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(18px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : 'none',
      }}
    >
      <nav className="max-w-[1400px] mx-auto px-8 h-[76px] flex items-center justify-between gap-8">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
          <img
            src="/logo.png"
            alt="Trufud Trading SPC"
            className="h-9 w-auto"
            style={{ filter: 'brightness(0) invert(1)', opacity: 0.95 }}
          />
          <span
            className="hidden sm:block text-[9px] tracking-[0.22em] uppercase font-medium"
            style={{ color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}
          >
            Trading SPC
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((l) => {
            const isActive = l === activePage
            return (
              <li key={l}>
                <Link
                  href={NAV_HREF[l] ?? '#'}
                  className="relative text-sm font-medium transition-colors duration-200 pb-0.5"
                  style={{ color: isActive ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.5)' }}
                >
                  {isActive && (
                    <span
                      className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                      style={{ background: '#7a9a4a' }}
                    />
                  )}
                  {l}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* CTA */}
        <a
          href="#"
          className="hidden lg:inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-200 hover:bg-white/10"
          style={{ color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.35)' }}
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
                <Link
                  key={l}
                  href={NAV_HREF[l] ?? '#'}
                  className="text-sm"
                  style={{ color: l === activePage ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.6)' }}
                >
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
