'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const SITEMAP = [
  { label: 'Home',           href: '/' },
  { label: 'About Us',       href: '/about' },
  { label: 'Our Products',   href: '/products' },
  { label: 'Our Philosophy', href: '/philosophy' },
  { label: 'Our Technology', href: '/technology' },
  { label: 'Contact Us',     href: '/contact' },
]

const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/trufudoman?igsh=cTBoZ3I1MXBmeDRr',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'X / Twitter',
    href: 'https://x.com/trufudoman',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/trufud-oman/',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/aWy4LzVVWCxqKSvj/',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <>
      {/* ── Main footer ── */}
      <footer
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(17,26,18,0) 0%, #111a12 6%)',
          borderTop: '1px solid rgba(140,159,78,0.18)',
        }}
      >
        {/* Glassmorphism backdrop layer */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'rgba(17,26,18,0.88)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
          }}
        />

        {/* Top green glow line */}
        <div
          className="absolute top-0 inset-x-0 h-px pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(140,159,78,0.55) 35%, rgba(168,196,110,0.7) 50%, rgba(140,159,78,0.55) 65%, transparent 100%)' }}
        />

        {/* Background ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(140,159,78,0.07) 0%, transparent 65%)' }}
        />

        <div className="relative z-10 max-w-[1320px] mx-auto px-5 sm:px-8 pt-12 md:pt-16 pb-8 md:pb-10">

          {/* ── Top grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 md:gap-12 mb-10 md:mb-14">

            {/* Brand block */}
            <motion.div
              className="sm:col-span-2 md:col-span-4"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href="/" className="inline-flex items-center gap-3 mb-5 group">
                <img
                  src="/logo.png"
                  alt="TruFud Trading SPC"
                  className="h-10 w-auto transition-opacity duration-300 group-hover:opacity-100"
                  style={{ filter: 'brightness(0) invert(1)', opacity: 0.88 }}
                />
                <span
                  className="text-[10px] tracking-[0.24em] uppercase font-semibold"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                >
                  Trading SPC
                </span>
              </Link>

              <p
                className="text-sm leading-relaxed mb-7 max-w-[280px]"
                style={{ color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}
              >
                Growing future vegetables one leaf at a time.
              </p>

              {/* Social icons */}
              <div className="flex items-center gap-3">
                {SOCIALS.map((s) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300"
                    style={{
                      background: 'rgba(140,159,78,0.08)',
                      border: '1px solid rgba(140,159,78,0.22)',
                      color: 'rgba(255,255,255,0.45)',
                    }}
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: 'rgba(140,159,78,0.22)',
                      borderColor: 'rgba(140,159,78,0.6)',
                      color: '#a8c46e',
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {s.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Sitemap */}
            <motion.div
              className="md:col-span-3"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <p
                className="text-[10px] font-bold tracking-[0.3em] uppercase mb-5"
                style={{ color: '#8C9F4E' }}
              >
                Sitemap
              </p>
              <ul className="flex flex-col gap-3">
                {SITEMAP.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex items-center gap-2.5 text-sm transition-all duration-200"
                      style={{ color: 'rgba(255,255,255,0.45)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.88)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                    >
                      <span
                        className="w-1 h-1 rounded-full flex-shrink-0 transition-all duration-200"
                        style={{ background: 'rgba(140,159,78,0.4)' }}
                      />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Head Office */}
            <motion.div
              className="md:col-span-5"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <p
                className="text-[10px] font-bold tracking-[0.3em] uppercase mb-5"
                style={{ color: '#8C9F4E' }}
              >
                Head Office
              </p>

              <div
                className="rounded-2xl p-5"
                style={{
                  background: 'rgba(140,159,78,0.05)',
                  border: '1px solid rgba(140,159,78,0.14)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <p className="text-sm font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  Trufud Trading SPC
                </p>

                <div className="flex flex-col gap-2.5">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <span style={{ color: '#8C9F4E', marginTop: '2px', flexShrink: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                    </span>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.52)' }}>
                      Post Box 2576, PC 130<br />
                      Muscat, Sultanate of Oman
                    </p>
                  </div>

                  {/* Phone 1 */}
                  <div className="flex items-center gap-3">
                    <span style={{ color: '#8C9F4E', flexShrink: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.4 2 2 0 0 1 3.58 2.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </span>
                    <a href="tel:+96822001300" className="text-xs transition-colors duration-200" style={{ color: 'rgba(255,255,255,0.52)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#a8c46e')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.52)')}>
                      +968 2200 1300
                    </a>
                  </div>

                  {/* Phone 2 */}
                  <div className="flex items-center gap-3">
                    <span style={{ color: 'rgba(140,159,78,0.4)', flexShrink: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.4 2 2 0 0 1 3.58 2.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </span>
                    <a href="tel:+96822001301" className="text-xs transition-colors duration-200" style={{ color: 'rgba(255,255,255,0.52)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#a8c46e')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.52)')}>
                      +968 2200 1301
                    </a>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <span style={{ color: '#8C9F4E', flexShrink: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </span>
                    <a href="mailto:info@trufudoman.com" className="text-xs transition-colors duration-200" style={{ color: 'rgba(255,255,255,0.52)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#a8c46e')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.52)')}>
                      info@trufudoman.com
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Divider ── */}
          <div
            className="h-px w-full mb-8"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(140,159,78,0.3), rgba(140,159,78,0.3), transparent)' }}
          />

          {/* ── Bottom bar ── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.28)' }}>
              © 2026 Trufud Trading SPC. All rights reserved.
            </p>
            <div className="flex items-center gap-2.5">
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: '#8C9F4E', boxShadow: '0 0 8px rgba(140,159,78,0.8)' }}
              />
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.28)' }}>
                Sustainable farming since 2024 · Muscat, Oman
              </span>
            </div>
          </div>

        </div>
      </footer>

      {/* ── Floating WhatsApp button ── */}
      <motion.a
        href="https://wa.me/96896586964"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-7 right-7 z-[9990] flex items-center justify-center w-14 h-14 rounded-full shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #25D366, #128C7E)',
          boxShadow: '0 4px 24px rgba(37,211,102,0.45)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.12, boxShadow: '0 6px 32px rgba(37,211,102,0.6)' }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Pulse ring */}
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ background: 'rgba(37,211,102,0.35)' }}
          animate={{ scale: [1, 1.5, 1.5], opacity: [0.7, 0, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
        />
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </motion.a>
    </>
  )
}
