'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, useInView, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

/* ─── Floating 3-D orbs (CSS only) ─────────────────────────────────────── */
function OrbField() {
  const orbs = [
    { w: 480, h: 480, top: '-8%',  left: '-6%',  dur: '22s', delay: '0s',    opacity: 0.055, green: true  },
    { w: 320, h: 320, top: '55%',  left: '-4%',  dur: '28s', delay: '-8s',   opacity: 0.04,  green: false },
    { w: 560, h: 560, top: '-12%', left: '60%',  dur: '26s', delay: '-14s',  opacity: 0.048, green: true  },
    { w: 260, h: 260, top: '70%',  left: '75%',  dur: '20s', delay: '-5s',   opacity: 0.035, green: false },
    { w: 200, h: 200, top: '35%',  left: '48%',  dur: '32s', delay: '-20s',  opacity: 0.03,  green: true  },
  ]
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {orbs.map((o, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: o.w, height: o.h,
            top: o.top, left: o.left,
            borderRadius: '50%',
            background: o.green
              ? `radial-gradient(circle, rgba(140,159,78,${o.opacity * 2}) 0%, transparent 70%)`
              : `radial-gradient(circle, rgba(80,110,60,${o.opacity}) 0%, transparent 70%)`,
            animation: `orb-drift ${o.dur} ${o.delay} infinite ease-in-out alternate`,
            filter: 'blur(1px)',
          }}
        />
      ))}

      {/* SVG grid */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(140,159,78,1)" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Diagonal accent lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="30%" x2="100%" y2="70%" stroke="rgba(140,159,78,1)" strokeWidth="1" />
        <line x1="0" y1="70%" x2="100%" y2="30%" stroke="rgba(140,159,78,1)" strokeWidth="0.5" />
      </svg>
    </div>
  )
}

/* ─── Floating particles ────────────────────────────────────────────────── */
function Particles() {
  const pts = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    left: `${7 + (i * 5.8) % 86}%`,
    top:  `${12 + (i * 7.3) % 76}%`,
    size: 1.2 + (i % 3) * 0.7,
    dur:  `${10 + (i % 5) * 2.5}s`,
    del:  `${-(i * 1.4) % 10}s`,
    op:   0.04 + (i % 4) * 0.02,
    green: i % 3 !== 0,
    dx: `${(i % 2 === 0 ? 1 : -1) * (6 + (i % 4) * 4)}px`,
    dy: `-${18 + (i % 5) * 10}px`,
  }))
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {pts.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left, top: p.top,
            width: p.size, height: p.size,
            background: p.green ? 'rgba(140,159,78,0.9)' : 'rgba(255,255,255,0.7)',
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

/* ─── Floating 3-D ring (decorative) ────────────────────────────────────── */
function Ring3D() {
  return (
    <div
      className="absolute pointer-events-none"
      style={{ right: '-80px', top: '50%', transform: 'translateY(-50%)', width: 500, height: 500 }}
    >
      <motion.div
        animate={{ rotateY: [0, 360] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        style={{ width: '100%', height: '100%', perspective: 800, transformStyle: 'preserve-3d' }}
      >
        {/* Outer ring */}
        <div style={{
          position: 'absolute', inset: 0,
          border: '1px solid rgba(140,159,78,0.12)',
          borderRadius: '50%',
          boxShadow: '0 0 40px rgba(140,159,78,0.06)',
        }} />
        {/* Mid ring */}
        <div style={{
          position: 'absolute', inset: 60,
          border: '1px solid rgba(140,159,78,0.18)',
          borderRadius: '50%',
          boxShadow: '0 0 30px rgba(140,159,78,0.08)',
        }} />
        {/* Inner ring */}
        <div style={{
          position: 'absolute', inset: 130,
          border: '1px solid rgba(140,159,78,0.28)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(140,159,78,0.04) 0%, transparent 70%)',
        }} />
        {/* Center dot */}
        <div style={{
          position: 'absolute', inset: '50%',
          transform: 'translate(-50%,-50%)',
          width: 8, height: 8,
          borderRadius: '50%',
          background: '#8C9F4E',
          boxShadow: '0 0 20px rgba(140,159,78,0.6), 0 0 60px rgba(140,159,78,0.2)',
        }} />
        {/* Spokes */}
        {[0, 45, 90, 135].map((deg, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: '100%', height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(140,159,78,0.15), transparent)',
              transform: `rotate(${deg}deg)`,
            }} />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

/* ─── Animated input field ──────────────────────────────────────────────── */
function Field({
  label, type = 'text', required, value, onChange, error, rows,
}: {
  label: string; type?: string; required?: boolean
  value: string; onChange: (v: string) => void
  error?: string; rows?: number
}) {
  const [focused, setFocused] = useState(false)
  const floatLabel = focused || value.length > 0

  const Tag = rows ? 'textarea' : 'input'

  return (
    <div className="relative">
      {/* Label */}
      <motion.label
        animate={{
          y:        floatLabel ? -24 : 0,
          scale:    floatLabel ? 0.82 : 1,
          color:    floatLabel ? (error ? '#ef4444' : '#8C9F4E') : 'rgba(255,255,255,0.35)',
        }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-4 top-4 text-sm font-medium pointer-events-none origin-left"
        style={{ zIndex: 2 }}
      >
        {label}{required && ' *'}
      </motion.label>

      {/* Input shell */}
      <div className="relative">
        <Tag
          type={type}
          value={value}
          rows={rows}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-transparent text-sm font-medium outline-none resize-none"
          style={{
            padding: rows ? '20px 16px 14px' : '20px 16px 10px',
            color: 'rgba(255,255,255,0.88)',
            minHeight: rows ? 120 : 'auto',
            caretColor: '#8C9F4E',
          }}
        />

        {/* Animated border */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            border: `1px solid ${
              error   ? 'rgba(239,68,68,0.45)' :
              focused ? 'rgba(140,159,78,0.55)' :
                        'rgba(255,255,255,0.09)'
            }`,
            background: focused
              ? 'linear-gradient(145deg, rgba(20,36,14,0.9), rgba(12,20,10,0.95))'
              : 'linear-gradient(145deg, rgba(12,18,10,0.7), rgba(7,11,7,0.8))',
            boxShadow: focused
              ? `0 0 0 1px ${error ? 'rgba(239,68,68,0.2)' : 'rgba(140,159,78,0.15)'}, 0 8px 32px rgba(0,0,0,0.35)`
              : '0 4px 20px rgba(0,0,0,0.25)',
            backdropFilter: 'blur(12px)',
            transition: 'border-color 0.3s, box-shadow 0.3s, background 0.3s',
          }}
        />

        {/* Focus sweep */}
        {focused && (
          <motion.div
            className="absolute top-0 inset-x-4 h-px rounded-full pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(140,159,78,0.7), transparent)' }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
          />
        )}
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-[11px] mt-1.5 ml-1"
            style={{ color: '#ef4444' }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Contact info card ─────────────────────────────────────────────────── */
function InfoCard({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const [hov, setHov] = useState(false)
  const content = (
    <motion.div
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      animate={{ y: hov ? -4 : 0 }}
      transition={{ duration: 0.3 }}
      className="relative flex items-center gap-4 p-5 rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: hov
          ? 'linear-gradient(145deg, rgba(22,40,14,0.95), rgba(13,23,11,0.98))'
          : 'linear-gradient(145deg, rgba(12,20,10,0.8), rgba(7,13,7,0.88))',
        border: `1px solid ${hov ? 'rgba(140,159,78,0.5)' : 'rgba(140,159,78,0.12)'}`,
        boxShadow: hov
          ? '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(140,159,78,0.07)'
          : '0 8px 30px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(16px)',
        transition: 'border-color 0.35s, box-shadow 0.35s, background 0.35s',
      }}
    >
      {/* Icon bubble */}
      <div
        className="flex items-center justify-center rounded-xl flex-shrink-0"
        style={{
          width: 44, height: 44,
          background: hov ? 'rgba(140,159,78,0.2)' : 'rgba(140,159,78,0.1)',
          border: `1px solid ${hov ? 'rgba(140,159,78,0.4)' : 'rgba(140,159,78,0.2)'}`,
          boxShadow: hov ? '0 0 20px rgba(140,159,78,0.15)' : 'none',
          transition: 'all 0.35s',
          color: '#8C9F4E',
        }}
      >
        {icon}
      </div>

      <div>
        <p className="text-[10px] tracking-[0.18em] uppercase mb-0.5" style={{ color: 'rgba(255,255,255,0.28)' }}>{label}</p>
        <p className="text-sm font-semibold" style={{ color: hov ? '#c8da8e' : 'rgba(255,255,255,0.82)' }}>{value}</p>
      </div>

      {/* Shimmer on hover */}
      {hov && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.04) 50%, transparent 70%)',
          }}
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        />
      )}

      {/* Bottom shimmer */}
      <motion.div
        className="absolute bottom-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(140,159,78,0.6), transparent)' }}
        animate={{ opacity: hov ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )

  return href ? <a href={href}>{content}</a> : content
}

/* ─── Success overlay ───────────────────────────────────────────────────── */
function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center text-center py-16 px-8"
    >
      {/* Animated checkmark */}
      <div className="relative mb-8">
        <motion.div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(140,159,78,0.12)',
            border: '1px solid rgba(140,159,78,0.4)',
            boxShadow: '0 0 60px rgba(140,159,78,0.18)',
          }}
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.svg
            width="36" height="36" viewBox="0 0 24 24" fill="none"
            stroke="#8C9F4E" strokeWidth="2" strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.path d="M20 6L9 17l-5-5"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }} />
          </motion.svg>
        </motion.div>

        {/* Pulsing ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: '1px solid rgba(140,159,78,0.3)' }}
          animate={{ scale: [1, 1.5, 1.5], opacity: [1, 0, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
        />
      </div>

      <motion.h3
        className="font-serif font-bold mb-3"
        style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', color: 'rgba(255,255,255,0.95)' }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
      >
        Message Sent
      </motion.h3>
      <motion.p
        className="text-sm leading-relaxed mb-8 max-w-xs"
        style={{ color: 'rgba(255,255,255,0.45)' }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
      >
        Thank you for reaching out. Our team will get back to you within 24 hours.
      </motion.p>
      <motion.button
        onClick={onReset}
        className="px-6 py-2.5 rounded-full text-xs font-semibold tracking-wide"
        style={{
          background: 'rgba(140,159,78,0.12)',
          border: '1px solid rgba(140,159,78,0.3)',
          color: '#a8c46e',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
      >
        Send Another Message
      </motion.button>
    </motion.div>
  )
}

/* ─── Main page ─────────────────────────────────────────────────────────── */
export default function ContactPage() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView     = useInView(sectionRef, { once: true, margin: '-80px' })

  /* tilt card on mouse move */
  const cardRef  = useRef<HTMLDivElement>(null)
  const mx       = useMotionValue(0)
  const my       = useMotionValue(0)
  const rotX     = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]),  { stiffness: 120, damping: 22 })
  const rotY     = useSpring(useTransform(mx, [-0.5, 0.5], [-4, 4]),  { stiffness: 120, damping: 22 })
  const glowX    = useTransform(mx, [-0.5, 0.5], ['15%', '85%'])
  const glowY    = useTransform(my, [-0.5, 0.5], ['15%', '85%'])

  const onCardMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = cardRef.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - r.left) / r.width  - 0.5)
    my.set((e.clientY - r.top)  / r.height - 0.5)
  }, [mx, my])
  const onCardLeave = useCallback(() => { mx.set(0); my.set(0) }, [mx, my])

  /* form state */
  const [form, setForm] = useState({ name: '', phone: '', email: '', note: '' })
  const [errors, setErrors] = useState<Partial<typeof form>>({})
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const set = (k: keyof typeof form) => (v: string) => {
    setForm(f => ({ ...f, [k]: v }))
    if (errors[k]) setErrors(e => ({ ...e, [k]: '' }))
  }

  const validate = () => {
    const e: Partial<typeof form> = {}
    if (!form.name.trim())                        e.name  = 'Please enter your name'
    if (!/^\+?[\d\s\-()]{7,}$/.test(form.phone)) e.phone = 'Enter a valid phone number'
    if (!/\S+@\S+\.\S+/.test(form.email))         e.email = 'Enter a valid email address'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1800)) // simulate API
    setLoading(false)
    setSent(true)
  }

  const reset = () => {
    setSent(false)
    setForm({ name: '', phone: '', email: '', note: '' })
    setErrors({})
  }

  /* Inject keyframe for orbs into head */
  useEffect(() => {
    const id = 'contact-orb-kf'
    if (document.getElementById(id)) return
    const style = document.createElement('style')
    style.id = id
    style.textContent = `
      @keyframes orb-drift {
        0%   { transform: translate(0, 0) scale(1); }
        100% { transform: translate(30px, 40px) scale(1.08); }
      }
    `
    document.head.appendChild(style)
    return () => { document.getElementById(id)?.remove() }
  }, [])

  const staggerItem = (i: number) => ({
    initial: { opacity: 0, y: 28 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.7, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
  })

  return (
    <main style={{ background: '#050805', minHeight: '100vh' }}>
      <Navbar activePage="Contact" />

      <section ref={sectionRef} className="relative w-full overflow-hidden" style={{ minHeight: '100vh' }}>
        <OrbField />
        <Particles />

        {/* Top border */}
        <div className="absolute top-0 inset-x-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(140,159,78,0.3), transparent)' }} />

        <div className="max-w-[1380px] mx-auto px-6 md:px-12 lg:px-16 pt-36 pb-24">

          {/* ── Page header ── */}
          <motion.div {...staggerItem(0)} className="mb-16 max-w-xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8" style={{ background: 'rgba(140,159,78,0.65)' }} />
              <span className="text-[10px] font-bold tracking-[0.26em] uppercase"
                style={{ color: 'rgba(140,159,78,0.72)' }}>
                Get In Touch
              </span>
            </div>
            <h1
              className="font-serif font-bold leading-[0.92] mb-5"
              style={{
                fontSize: 'clamp(48px, 7vw, 96px)',
                background: 'linear-gradient(138deg, rgba(255,255,255,0.96) 0%, rgba(200,218,142,0.84) 50%, rgba(140,159,78,0.65) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.035em',
              }}
            >
              Let&apos;s<br />Talk.
            </h1>
            <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)' }}>
              Ready to grow with us? Reach out and our team will respond within 24 hours.
            </p>
          </motion.div>

          {/* ── Two-column layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 xl:gap-16 items-start">

            {/* ═══════════════ LEFT — Form card ═══════════════ */}
            <motion.div {...staggerItem(1)}>
              <motion.div
                ref={cardRef}
                onMouseMove={onCardMove}
                onMouseLeave={onCardLeave}
                style={{
                  rotateX: rotX,
                  rotateY: rotY,
                  perspective: 1000,
                  transformStyle: 'preserve-3d',
                }}
                className="relative rounded-[28px] overflow-hidden"
              >
                {/* Card glass bg */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(148deg, rgba(14,26,12,0.92) 0%, rgba(8,14,8,0.96) 100%)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(140,159,78,0.16)',
                    boxShadow: '0 40px 120px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
                  }}
                />

                {/* Dynamic glare */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at ${glowX} ${glowY}, rgba(140,159,78,0.08) 0%, transparent 55%)`,
                    borderRadius: 28,
                  }}
                />

                {/* Top border shine */}
                <div className="absolute top-0 inset-x-8 h-px"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(140,159,78,0.6), transparent)' }} />

                <div className="relative p-8 md:p-10">
                  {/* Form header */}
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(140,159,78,0.15)', border: '1px solid rgba(140,159,78,0.3)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8C9F4E" strokeWidth="2">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.82)' }}>Send a Message</p>
                      <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.28)' }}>We reply within 24 hours</p>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {sent ? (
                      <SuccessState key="success" onReset={reset} />
                    ) : (
                      <motion.form
                        key="form"
                        onSubmit={submit}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col gap-5"
                      >
                        {/* Name */}
                        <Field
                          label="Full Name"
                          required
                          value={form.name}
                          onChange={set('name')}
                          error={errors.name}
                        />

                        {/* Phone + Email side by side on md+ */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <Field
                            label="Mobile Number"
                            type="tel"
                            required
                            value={form.phone}
                            onChange={set('phone')}
                            error={errors.phone}
                          />
                          <Field
                            label="Email Address"
                            type="email"
                            required
                            value={form.email}
                            onChange={set('email')}
                            error={errors.email}
                          />
                        </div>

                        {/* Note */}
                        <Field
                          label="Your Message"
                          value={form.note}
                          onChange={set('note')}
                          rows={4}
                        />

                        {/* Submit */}
                        <motion.button
                          type="submit"
                          disabled={loading}
                          className="relative w-full py-4 rounded-2xl text-sm font-bold tracking-[0.12em] uppercase overflow-hidden"
                          style={{
                            background: loading
                              ? 'rgba(140,159,78,0.15)'
                              : 'linear-gradient(135deg, #8C9F4E 0%, #5c6b2e 100%)',
                            color: loading ? '#8C9F4E' : '#fff',
                            border: `1px solid ${loading ? 'rgba(140,159,78,0.3)' : 'transparent'}`,
                            boxShadow: loading ? 'none' : '0 0 40px rgba(140,159,78,0.25), 0 8px 32px rgba(0,0,0,0.4)',
                            cursor: loading ? 'not-allowed' : 'pointer',
                          }}
                          whileHover={!loading ? { scale: 1.02, boxShadow: '0 0 60px rgba(140,159,78,0.4), 0 12px 40px rgba(0,0,0,0.5)' } : {}}
                          whileTap={!loading ? { scale: 0.98 } : {}}
                          transition={{ duration: 0.2 }}
                        >
                          {/* Button shimmer */}
                          {!loading && (
                            <motion.div
                              className="absolute inset-0 pointer-events-none"
                              style={{
                                background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)',
                              }}
                              initial={{ x: '-100%' }}
                              animate={{ x: '200%' }}
                              transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
                            />
                          )}

                          <span className="relative flex items-center justify-center gap-3">
                            {loading ? (
                              <>
                                <motion.div
                                  className="w-4 h-4 rounded-full border-2 border-current border-t-transparent"
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                                />
                                Sending…
                              </>
                            ) : (
                              <>
                                Send Message
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </>
                            )}
                          </span>
                        </motion.button>

                        {/* Privacy note */}
                        <p className="text-center text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
                          Your information is kept private and never shared.
                        </p>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>

            {/* ═══════════════ RIGHT — Info + decoration ═══════════════ */}
            <div className="relative flex flex-col gap-6">
              {/* Decorative ring (hidden on mobile) */}
              <div className="absolute -right-20 top-0 hidden xl:block opacity-40 pointer-events-none" style={{ zIndex: 0 }}>
                <Ring3D />
              </div>

              <motion.div {...staggerItem(2)} className="relative z-10 flex flex-col gap-4">
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-2"
                  style={{ color: 'rgba(255,255,255,0.25)' }}>
                  Contact Details
                </p>

                <InfoCard
                  href="mailto:sales@trufudoman.com"
                  icon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  }
                  label="Email"
                  value="sales@trufudoman.com"
                />

                <InfoCard
                  href="tel:+96896586964"
                  icon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.72 6.72l1.28-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                  label="Phone"
                  value="+968 9658 6964"
                />

                <InfoCard
                  icon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  }
                  label="Location"
                  value="Muscat, Sultanate of Oman"
                />
              </motion.div>

              {/* Response time badge */}
              <motion.div {...staggerItem(3)} className="relative z-10">
                <div
                  className="flex items-center gap-4 p-5 rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(140,159,78,0.08) 0%, rgba(5,8,5,0) 100%)',
                    border: '1px solid rgba(140,159,78,0.14)',
                  }}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(140,159,78,0.12)', border: '1px solid rgba(140,159,78,0.25)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8C9F4E" strokeWidth="1.8">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12,6 12,12 16,14" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-0.5" style={{ color: 'rgba(255,255,255,0.82)' }}>Fast Response</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Our team typically replies within 24 hours on business days.</p>
                  </div>
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div {...staggerItem(4)} className="relative z-10 grid grid-cols-3 gap-3">
                {[
                  { n: '2021', l: 'Founded' },
                  { n: '14+',  l: 'Varieties' },
                  { n: '0',    l: 'Pesticides' },
                ].map(({ n, l }) => (
                  <div
                    key={l}
                    className="flex flex-col items-center py-5 rounded-2xl"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(140,159,78,0.1)',
                    }}
                  >
                    <span className="font-serif font-black mb-1"
                      style={{ fontSize: 'clamp(20px,2.2vw,28px)', color: 'rgba(168,196,110,0.88)' }}>
                      {n}
                    </span>
                    <span className="text-[9px] tracking-[0.14em] uppercase"
                      style={{ color: 'rgba(255,255,255,0.22)' }}>
                      {l}
                    </span>
                  </div>
                ))}
              </motion.div>

              {/* Quote */}
              <motion.div {...staggerItem(5)} className="relative z-10">
                <div
                  className="relative overflow-hidden p-7 rounded-2xl"
                  style={{
                    background: 'linear-gradient(145deg, rgba(14,22,12,0.8), rgba(8,13,8,0.9))',
                    border: '1px solid rgba(140,159,78,0.1)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <div className="absolute top-4 left-5 font-serif text-6xl leading-none pointer-events-none select-none"
                    style={{ color: 'rgba(140,159,78,0.1)' }}>
                    "
                  </div>
                  <p className="relative text-sm leading-relaxed mt-4"
                    style={{ color: 'rgba(255,255,255,0.48)', fontStyle: 'italic' }}>
                    Precision-grown in climate-controlled vertical farms. Delivered with zero compromise to every table in Oman.
                  </p>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="h-px w-5" style={{ background: 'rgba(140,159,78,0.4)' }} />
                    <span className="text-[10px] tracking-[0.16em] uppercase" style={{ color: 'rgba(140,159,78,0.6)' }}>
                      TruFud Trading SPC
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>

        {/* Bottom border */}
        <div className="absolute bottom-0 inset-x-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(140,159,78,0.14), transparent)' }} />
      </section>
      <Footer />
    </main>
  )
}
