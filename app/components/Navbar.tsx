'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = ['Home', 'About Us', 'Technology', 'Our Philosophy', 'Products', 'Contact']

const NAV_HREF: Record<string, string> = {
  'Home':           '/',
  'About Us':       '/about',
  'Technology':     '/technology',
  'Our Philosophy': '/philosophy',
  'Products':       '/products',
  'Contact':        '/contact',
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
        background: scrolled ? 'rgba(17,26,18,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : 'none',
      }}
    >
      <nav className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 h-[72px] md:h-[88px] flex items-center justify-between gap-4 md:gap-10">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="Trufud Trading SPC"
            className="h-11 w-auto"
            style={{ filter: 'brightness(0) invert(1)', opacity: 0.95 }}
          />
          <span
            className="hidden sm:block text-[10px] tracking-[0.24em] uppercase font-semibold"
            style={{ color: 'rgba(255,255,255,0.38)', marginTop: '2px' }}
          >
            Trading SPC
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((l) => {
            const isActive = l === activePage
            return (
              <li key={l}>
                <Link
                  href={NAV_HREF[l]}
                  prefetch={true}
                  className="relative text-[13px] font-medium tracking-wide transition-colors duration-200 pb-1"
                  style={{ color: isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.52)' }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full"
                      style={{ background: '#8C9F4E' }}
                    />
                  )}
                  {l}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* CTA */}
        <Link
          href="/contact"
          className="hidden lg:inline-flex items-center gap-2 text-[13px] font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:bg-white/10"
          style={{ color: 'rgba(255,255,255,0.88)', border: '1px solid rgba(255,255,255,0.3)' }}
        >
          Get In Touch
        </Link>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex flex-col justify-center items-end gap-1.5 w-9 h-9"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {[1, 0.6, 0.8].map((w, i) => (
            <span
              key={i}
              className="block h-0.5 rounded-full transition-all duration-300"
              style={{ width: `${w * 22}px`, background: 'rgba(255,255,255,0.75)' }}
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
            style={{ background: 'rgba(15,22,15,0.98)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="px-5 sm:px-10 py-6 flex flex-col gap-5">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l}
                  href={NAV_HREF[l]}
                  onClick={() => setMobileOpen(false)}
                  className="text-[15px] font-medium"
                  style={{ color: l === activePage ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.55)' }}
                >
                  {l}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="text-[14px] font-semibold px-6 py-3 rounded-full text-center mt-1"
                style={{ border: '1px solid rgba(255,255,255,0.28)', color: 'rgba(255,255,255,0.88)' }}
              >
                Get In Touch
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
