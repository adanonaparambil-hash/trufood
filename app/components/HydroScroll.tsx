'use client'

import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react'
import {
  useScroll,
  useTransform,
  motion,
  MotionValue,
} from 'framer-motion'

/* ─── Frame config ───────────────────────────────────────────────────────── */
const TOTAL_FRAMES = 40

const FRAME_SRCS = Array.from({ length: TOTAL_FRAMES }, (_, i) =>
  `/frames/ezgif-frame-${String(i + 1).padStart(3, '0')}.png`
)

/* ─── Text sections — (enter, peak, start-exit, exit) in scroll 0→1 ─────── */
const TEXT_SECTIONS = [
  {
    heading: 'Growing the\nFuture of Food',
    sub: 'Trufud — where nature meets precision engineering.',
    range: [0, 0.03, 0.21, 0.26] as const,
    badge: null,
  },
  {
    heading: 'Less Land. Less Water.\nMore Yield.',
    sub: 'Up to 95% less water usage. Zero pesticides. Maximum nutrition.',
    range: [0.27, 0.32, 0.50, 0.55] as const,
    badge: '95% less water',
  },
  {
    heading: 'Precision Hydroponics.\nPowered by Innovation.',
    sub: 'AI-driven nutrient delivery optimised for every growth stage.',
    range: [0.57, 0.62, 0.80, 0.85] as const,
    badge: 'AI-powered',
  },
  {
    heading: 'Sustainable Farming\nStarts Here.',
    sub: 'Join the movement redefining the future of food.',
    range: [0.87, 0.91, 0.98, 1.0] as const,
    badge: null,
  },
]

/* ─── Single text overlay ────────────────────────────────────────────────── */
function TextSection({
  section,
  progress,
}: {
  section: (typeof TEXT_SECTIONS)[number]
  progress: MotionValue<number>
}) {
  const [enter, peak, startExit, exit] = section.range

  const opacity = useTransform(
    progress,
    [enter, peak, startExit, exit],
    [0, 1, 1, 0]
  )
  const y = useTransform(progress, [enter, peak, startExit, exit], [32, 0, 0, -20])

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center pointer-events-none z-20"
    >
      {/* Badge */}
      {section.badge && (
        <motion.span
          className="inline-block mb-5 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase"
          style={{
            color: '#00ff88',
            border: '1px solid #00ff8840',
            background: '#00ff8810',
          }}
        >
          {section.badge}
        </motion.span>
      )}

      {/* Heading */}
      <h2
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight whitespace-pre-line mb-5"
        style={{ color: 'rgba(255,255,255,0.92)' }}
      >
        {section.heading}
      </h2>

      {/* Sub */}
      <p
        className="text-sm sm:text-base md:text-lg max-w-lg leading-relaxed"
        style={{ color: 'rgba(255,255,255,0.55)' }}
      >
        {section.sub}
      </p>
    </motion.div>
  )
}

/* ─── Circular progress loader ───────────────────────────────────────────── */
function Loader({ pct }: { pct: number }) {
  const RADIUS = 36
  const CIRC = 2 * Math.PI * RADIUS

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] z-50"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="relative w-24 h-24 mb-6">
        <svg
          className="w-24 h-24 -rotate-90"
          viewBox="0 0 88 88"
        >
          {/* Track */}
          <circle
            cx="44" cy="44" r={RADIUS}
            fill="none"
            stroke="#ffffff08"
            strokeWidth="2"
          />
          {/* Progress arc */}
          <circle
            cx="44" cy="44" r={RADIUS}
            fill="none"
            stroke="#00ff88"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC - (CIRC * pct) / 100}
            style={{ transition: 'stroke-dashoffset 120ms linear' }}
          />
        </svg>

        {/* Percentage */}
        <span
          className="absolute inset-0 flex items-center justify-center text-sm font-mono font-medium"
          style={{ color: '#00ff88' }}
        >
          {pct}%
        </span>
      </div>

      {/* Wordmark */}
      <p className="text-[10px] tracking-[0.35em] uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>
        Loading Trufud
      </p>
    </motion.div>
  )
}

/* ─── Scroll indicator ───────────────────────────────────────────────────── */
function ScrollHint({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.08], [1, 0])
  return (
    <motion.div
      style={{ opacity }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30 pointer-events-none"
    >
      <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>
        Scroll to explore
      </span>
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
        className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
        style={{ border: '1px solid rgba(255,255,255,0.15)' }}
      >
        <div className="w-0.5 h-2 rounded-full" style={{ background: '#00ff88' }} />
      </motion.div>
    </motion.div>
  )
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function HydroScroll() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const frameIdxRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  const [loadPct, setLoadPct] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showLoader, setShowLoader] = useState(true)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  /* ── Draw a specific frame ── */
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const img = imagesRef.current[index]
    if (!img?.complete || !img.naturalWidth) return

    const W = canvas.width
    const H = canvas.height

    ctx.clearRect(0, 0, W, H)

    /* cover-crop: always fill canvas, maintain aspect ratio */
    const iw = img.naturalWidth
    const ih = img.naturalHeight
    const imgAspect = iw / ih
    const cvAspect = W / H

    let sx = 0, sy = 0, sw = iw, sh = ih

    if (imgAspect > cvAspect) {
      sw = ih * cvAspect
      sx = (iw - sw) / 2
    } else {
      sh = iw / cvAspect
      sy = (ih - sh) / 2
    }

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H)
  }, [])

  /* ── Size canvas to physical pixels (retina) ── */
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = canvas.offsetWidth * dpr
    canvas.height = canvas.offsetHeight * dpr
    drawFrame(frameIdxRef.current)
  }, [drawFrame])

  /* ── Preload all frames ── */
  useEffect(() => {
    let done = 0
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES)

    const finish = () => {
      setIsLoaded(true)
      setTimeout(() => setShowLoader(false), 400)
    }

    // Hard timeout: never block the page for more than 4 seconds
    const timeout = setTimeout(finish, 4000)

    FRAME_SRCS.forEach((src, i) => {
      const img = new Image()

      const onDone = () => {
        done++
        setLoadPct(Math.round((done / TOTAL_FRAMES) * 100))
        if (done === TOTAL_FRAMES) {
          clearTimeout(timeout)
          finish()
        }
      }

      img.onload  = onDone
      img.onerror = onDone
      img.src = src
      images[i] = img
    })

    imagesRef.current = images
    return () => clearTimeout(timeout)
  }, [])

  /* ── Setup canvas sizing + resize listener ── */
  useEffect(() => {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [resizeCanvas])

  /* ── Draw frame 0 once images are ready ── */
  useEffect(() => {
    if (isLoaded) drawFrame(0)
  }, [isLoaded, drawFrame])

  /* ── Subscribe to scroll → frame ── */
  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      const clamped = Math.max(0, Math.min(1, v))
      const idx = Math.round(clamped * (TOTAL_FRAMES - 1))

      if (idx === frameIdxRef.current) return
      frameIdxRef.current = idx

      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => drawFrame(idx))
    })

    return () => {
      unsub()
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [scrollYProgress, drawFrame])

  /* ────────────────────────────────────────────────────────────────────── */
  return (
    <div
      ref={containerRef}
      className="relative h-[400vh]"
      style={{ background: '#050505' }}
    >
      {/* ── Sticky viewport ── */}
      <div className="sticky top-0 w-full h-screen overflow-hidden scanline">

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ background: '#050505' }}
        />

        {/* Radial vignette — darkens edges, keeps subject pop */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 35%, #050505 100%)',
          }}
        />

        {/* Bottom gradient fade into next section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(to bottom, transparent, #050505)',
          }}
        />

        {/* Neon bottom line */}
        <div
          className="absolute bottom-0 inset-x-0 h-px z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #00ff88 50%, transparent 100%)',
            opacity: 0.4,
          }}
        />

        {/* Text sections */}
        {TEXT_SECTIONS.map((section, i) => (
          <TextSection key={i} section={section} progress={scrollYProgress} />
        ))}

        {/* Scroll indicator */}
        <ScrollHint progress={scrollYProgress} />

        {/* Loader */}
        {showLoader && <Loader pct={loadPct} />}
      </div>
    </div>
  )
}
