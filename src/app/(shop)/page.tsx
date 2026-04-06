'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

const C = {
  forest: '#1B2E1F', cream: '#F5F0E6', gold: '#D4A853',
  goldLight: '#E8C97A', white: '#FAFAF8', offwhite: '#F0EBE3',
  ink: '#0F1A11', muted: '#6B7B6E', border: '#DDD8CF', card: '#FFFFFF',
}

const PRODUCTS = [
  { id: '1', name: 'Rose Quartz Gua Sha', tagline: 'Sculpt. Depuff. Glow.', price: 'PKR 2,800', comparePrice: 'PKR 3,500', category: 'Self-Care', slug: 'rose-quartz-gua-sha', isNew: true, bg: '#F5F0EC', img: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=800&q=85' },
  { id: '2', name: 'LED Glow Mirror', tagline: 'Studio lighting, anywhere.', price: 'PKR 4,500', comparePrice: 'PKR 5,500', category: 'Self-Care', slug: 'led-glow-mirror', isNew: false, bg: '#EDF0F0', img: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=85' },
  { id: '3', name: 'Mini Chain Crossbody', tagline: 'Small bag. Big statement.', price: 'PKR 3,200', comparePrice: null, category: 'Accessories', slug: 'mini-chain-crossbody', isNew: true, bg: '#F0EDE8', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=85' },
  { id: '4', name: 'Jade Face Roller', tagline: 'Roll away the stress.', price: 'PKR 1,800', comparePrice: 'PKR 2,200', category: 'Self-Care', slug: 'jade-face-roller', isNew: false, bg: '#EDF0ED', img: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=85' },
  { id: '5', name: 'Acrylic Box Clutch', tagline: 'Art you carry.', price: 'PKR 2,500', comparePrice: null, category: 'Accessories', slug: 'acrylic-clutch', isNew: true, bg: '#F0EDF5', img: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=85' },
  { id: '6', name: 'USB Facial Steamer', tagline: 'Open up. Breathe in. Glow.', price: 'PKR 3,800', comparePrice: 'PKR 4,500', category: 'Self-Care', slug: 'facial-steamer', isNew: false, bg: '#F0F5F5', img: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=800&q=85' },
]

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    obs.observe(el); return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

function useIsMobile() {
  const [v, setV] = useState(false)
  useEffect(() => { const c = () => setV(window.innerWidth < 768); c(); window.addEventListener('resize', c); return () => window.removeEventListener('resize', c) }, [])
  return v
}

function Hero() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  useMotionValueEvent(scrollY, 'change', v => setScrolled(v > 80))

  return (
    <section style={{ position: 'relative', minHeight: '100svh', background: C.forest, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Image
          src="https://images.unsplash.com/photo-1617897903246-719242758050?w=1600&q=90"
          alt="Nuura"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,26,15,0.97) 0%, rgba(11,26,15,0.6) 50%, rgba(11,26,15,0.2) 100%)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,6vw,5rem)', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
          <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: 'block', width: '32px', height: '1px', background: C.gold, transformOrigin: 'left' }} />
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase' as const, color: 'rgba(245,240,230,0.6)' }}>
            New Collection - 2025
          </span>
        </motion.div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, lineHeight: 0.88, letterSpacing: '-0.03em', fontSize: 'clamp(4.5rem,13vw,14rem)', margin: '0 0 clamp(2rem,3vw,3rem)', color: C.cream }}>
          {['Your', 'glow,', 'your', 'ritual.'].map((word, i) => (
            <div key={i} style={{ overflow: 'hidden', display: 'block' }}>
              <motion.span
                initial={{ y: '110%', skewY: 3 }}
                animate={{ y: '0%', skewY: 0 }}
                transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.3 + i * 0.1 }}
                style={{ display: 'block', fontStyle: i === 1 || i === 3 ? 'italic' : 'normal', color: i === 3 ? C.gold : C.cream }}
              >
                {word}
              </motion.span>
            </div>
          ))}
        </h1>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.9 }}
          style={{ display: 'flex', flexWrap: 'wrap' as const, alignItems: 'center', justifyContent: 'space-between', gap: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(245,240,230,0.15)' }}>

          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(13px,1.5vw,16px)', lineHeight: 1.7, color: 'rgba(245,240,230,0.65)', maxWidth: '380px', margin: 0 }}>
            Curated self-care and aesthetic accessories for the woman who moves with intention.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' as const }}>
            <Link href="/shop" data-cursor="hover"
              style={{ display: 'inline-block', padding: '14px 40px', background: C.gold, color: C.forest, fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase' as const, textDecoration: 'none', fontWeight: 600, transition: 'all 300ms' }}
              onMouseEnter={e => { e.currentTarget.style.background = C.goldLight; e.currentTarget.style.transform = 'scale(1.03)' }}
              onMouseLeave={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.transform = 'scale(1)' }}>
              Shop Now
            </Link>
            <Link href="/shop?filter=new" data-cursor="hover"
              style={{ display: 'inline-block', padding: '14px 40px', border: '1px solid rgba(245,240,230,0.3)', color: C.cream, fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase' as const, textDecoration: 'none', transition: 'all 300ms' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(245,240,230,0.3)'; e.currentTarget.style.color = C.cream }}>
              New Drops
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.div animate={{ opacity: scrolled ? 0 : 1 }}
        style={{ position: 'absolute', bottom: '2rem', right: 'clamp(1.5rem,6vw,5rem)', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '8px', pointerEvents: 'none', zIndex: 2 }}>
        <motion.div animate={{ scaleY: [1, 1.8, 1] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: '1px', height: '48px', background: C.gold, transformOrigin: 'top' }} />
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '9px', letterSpacing: '0.4em', textTransform: 'uppercase' as const, color: 'rgba(245,240,230,0.4)', writingMode: 'vertical-rl' as const }}>Scroll</span>
      </motion.div>
    </section>
  )
}

function Marquee({ bg = C.forest, color = C.cream, duration = 50, reverse = false }: { bg?: string; color?: string; duration?: number; reverse?: boolean }) {
  const text = 'Self-Care  *  Glow Up  *  Curated Drops  *  Aesthetic  *  New Arrivals  *  Limited Edition  *  Nuura  *  نور  *  '
  return (
    <div style={{ background: bg, overflow: 'hidden', padding: '16px 0', borderTop: `1px solid ${bg === C.white || bg === C.offwhite ? C.border : 'rgba(255,255,255,0.06)'}` }}>
      <motion.div animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }} transition={{ duration, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'flex', whiteSpace: 'nowrap' as const }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase' as const, color }}>{text.repeat(8)}</span>
      </motion.div>
    </div>
  )
}

function ProductCard({ p, i }: { p: typeof PRODUCTS[0]; i: number }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link href={`/product/${p.slug}`} data-cursor="hover" style={{ textDecoration: 'none', display: 'block' }}>
      <motion.div onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)} animate={{ y: hovered ? -10 : 0 }} transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}>
        <div style={{ position: 'relative', aspectRatio: '3/4', background: p.bg, overflow: 'hidden', marginBottom: '1.25rem' }}>
          <Image src={p.img} alt={p.name} fill sizes="(max-width: 768px) 72vw, 25vw" style={{ objectFit: 'cover', transition: 'transform 800ms ease', transform: hovered ? 'scale(1.07)' : 'scale(1)' }} />
          <div style={{ position: 'absolute', inset: 0, background: hovered ? 'rgba(11,26,15,0.15)' : 'transparent', transition: 'background 400ms' }} />
          <div style={{ position: 'absolute', top: '14px', left: '14px', display: 'flex', gap: '6px', flexWrap: 'wrap' as const }}>
            {p.isNew && <span style={{ background: C.forest, color: C.cream, fontFamily: 'var(--font-sans)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase' as const, padding: '5px 12px' }}>New</span>}
          </div>
          <div style={{ position: 'absolute', bottom: '14px', right: '14px', fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'rgba(255,255,255,0.2)', lineHeight: 1 }}>0{i + 1}</div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(27,46,31,0.92)', backdropFilter: 'blur(4px)', padding: '14px', textAlign: 'center', transform: hovered ? 'translateY(0)' : 'translateY(100%)', transition: 'transform 350ms ease', fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: C.gold }}>
            Quick Add +
          </div>
        </div>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: C.ink, margin: '0 0 4px', letterSpacing: '-0.01em' }}>{p.name}</p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: C.muted, margin: '0 0 10px' }}>{p.tagline}</p>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: C.forest, fontWeight: 500 }}>{p.price}</span>
          {p.comparePrice && <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: C.muted, textDecoration: 'line-through' }}>{p.comparePrice}</span>}
        </div>
      </motion.div>
    </Link>
  )
}

function DesktopProducts() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], ['2%', '-62%'])
  return (
    <div ref={containerRef} style={{ height: '550vh', position: 'relative', background: C.white }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: C.white }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2, padding: 'clamp(1.5rem,3vw,2.5rem) clamp(1.5rem,6vw,5rem)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
              <span style={{ display: 'block', width: '24px', height: '1px', background: C.gold }} />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase' as const, color: C.muted }}>Featured Drop</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 300, color: C.ink, margin: 0, letterSpacing: '-0.025em' }}>This season&apos;s obsessions.</h2>
          </div>
          <Link href="/shop" data-cursor="hover" style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: C.gold, textDecoration: 'none', borderBottom: `1px solid ${C.gold}`, paddingBottom: '2px' }}>View All -&gt;</Link>
        </div>
        <motion.div style={{ x, display: 'flex', gap: '2rem', height: '100%', alignItems: 'center', paddingLeft: 'clamp(1.5rem,6vw,5rem)', paddingRight: '25vw', paddingTop: '8rem' }}>
          {PRODUCTS.map((p, i) => (
            <div key={p.id} style={{ width: 'clamp(240px,22vw,300px)', flexShrink: 0 }}>
              <ProductCard p={p} i={i} />
            </div>
          ))}
        </motion.div>
        <div style={{ position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: C.muted }}>Drag to explore</span>
          <div style={{ width: '100px', height: '1px', background: C.border, position: 'relative', overflow: 'hidden' }}>
            <motion.div style={{ position: 'absolute', inset: 0, background: C.gold, scaleX: scrollYProgress, transformOrigin: 'left' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

function MobileProducts() {
  const [active, setActive] = useState(0)
  const startX = useRef(0)
  return (
    <div style={{ background: C.white, paddingTop: '3rem', paddingBottom: '2.5rem' }}>
      <div style={{ padding: '0 1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
            <span style={{ display: 'block', width: '20px', height: '1px', background: C.gold }} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase' as const, color: C.muted }}>Featured</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 300, color: C.ink, margin: 0, letterSpacing: '-0.02em' }}>This season&apos;s<br />obsessions.</h2>
        </div>
        <Link href="/shop" style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: C.gold, textDecoration: 'none', borderBottom: `1px solid ${C.gold}`, paddingBottom: '2px' }}>All -&gt;</Link>
      </div>
      <div style={{ overflow: 'hidden', paddingLeft: '1.5rem' }}
        onTouchStart={e => { startX.current = e.touches[0].clientX }}
        onTouchEnd={e => {
          const diff = startX.current - e.changedTouches[0].clientX
          if (Math.abs(diff) > 40) {
            if (diff > 0) setActive(p => Math.min(p + 1, PRODUCTS.length - 1))
            else setActive(p => Math.max(p - 1, 0))
          }
        }}
      >
        <motion.div animate={{ x: `calc(-${active * 80}vw)` }} transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }} style={{ display: 'flex', gap: '1rem' }}>
          {PRODUCTS.map((p, i) => (
            <div key={p.id} style={{ width: '74vw', flexShrink: 0 }}><ProductCard p={p} i={i} /></div>
          ))}
        </motion.div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '1.5rem' }}>
        {PRODUCTS.map((_, i) => (
          <button key={i} onClick={() => setActive(i)} style={{ width: i === active ? '28px' : '6px', height: '6px', borderRadius: '3px', background: i === active ? C.gold : C.border, border: 'none', padding: 0, cursor: 'pointer', transition: 'all 300ms' }} />
        ))}
      </div>
    </div>
  )
}

function Products() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileProducts /> : <DesktopProducts />
}

function BrandStory() {
  const { ref, inView } = useInView(0.2)
  return (
    <section style={{ background: C.offwhite, padding: 'clamp(5rem,10vw,9rem) clamp(1.5rem,6vw,5rem)' }}>
      <div ref={ref} style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(1,1fr)', gap: '4rem' }} className="md:grid-cols-2 md:gap-24 items-center">
        <div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
            <motion.span initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 0.5, delay: 0.1 }}
              style={{ display: 'block', width: '24px', height: '1px', background: C.gold, transformOrigin: 'left' }} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase' as const, color: C.muted }}>Our Philosophy</span>
          </motion.div>
          {['We don\'t sell', 'products.', 'We curate rituals.'].map((line, i) => (
            <div key={i} style={{ overflow: 'hidden' }}>
              <motion.div initial={{ y: '105%' }} animate={inView ? { y: '0%' } : {}} transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.1 + i * 0.12 }}
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem,4.5vw,4rem)', fontWeight: 300, lineHeight: 1.05, letterSpacing: '-0.025em', color: i === 2 ? C.gold : C.ink, fontStyle: i === 2 ? 'italic' : 'normal' }}>
                {line}
              </motion.div>
            </div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.4 }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(14px,1.5vw,16px)', lineHeight: 1.85, color: C.muted, marginBottom: '1.5rem' }}>
            Nuura was born from a simple truth - Pakistani women deserve beauty that reflects their sophistication. Not fast fashion. Not cluttered marketplaces.
          </p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(14px,1.5vw,16px)', lineHeight: 1.85, color: C.muted, marginBottom: '3rem' }}>
            Every product we carry is tested, curated, and chosen because it earns its place in your ritual.
          </p>
          <div style={{ fontFamily: 'var(--font-accent)', fontSize: 'clamp(4rem,7vw,6.5rem)', color: C.gold, lineHeight: 1, marginBottom: '2.5rem', opacity: 0.6 }}>نور</div>
          <Link href="/shop" data-cursor="hover"
            style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: C.forest, textDecoration: 'none', borderBottom: `2px solid ${C.gold}`, paddingBottom: '4px', display: 'inline-block', transition: 'letter-spacing 300ms, color 300ms' }}
            onMouseEnter={e => { e.currentTarget.style.color = C.gold; e.currentTarget.style.letterSpacing = '0.32em' }}
            onMouseLeave={e => { e.currentTarget.style.color = C.forest; e.currentTarget.style.letterSpacing = '0.25em' }}>
            Explore the Edit -&gt;
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function PromiseStrip() {
  const { ref, inView } = useInView(0.2)
  const items = [
    { title: 'Curated, not cluttered', desc: '12-18 SKUs per drop. Every product earns its place.' },
    { title: 'Cash on Delivery', desc: 'Nationwide COD. No trust issues, no upfront risk.' },
    { title: 'Limited drops', desc: 'When it\'s gone, it\'s gone. New drops every season.' },
  ]
  return (
    <section style={{ background: C.forest, padding: 'clamp(5rem,10vw,8rem) clamp(1.5rem,6vw,5rem)' }}>
      <div ref={ref} style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(1,1fr)', gap: '0' }} className="md:grid-cols-3">
        {items.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: i * 0.15 }}
            style={{ padding: 'clamp(2rem,3vw,3rem)', borderLeft: i > 0 ? '1px solid rgba(245,240,230,0.08)' : 'none', borderTop: '1px solid rgba(245,240,230,0.08)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'rgba(212,168,83,0.2)', lineHeight: 1, marginBottom: '1.5rem' }}>0{i + 1}</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem,2.5vw,2rem)', fontWeight: 300, color: C.cream, margin: '0 0 1rem', letterSpacing: '-0.01em' }}>{item.title}</h3>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', lineHeight: 1.75, color: 'rgba(245,240,230,0.45)', margin: 0 }}>{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function FinalCTA() {
  const { ref, inView } = useInView(0.3)
  return (
    <section ref={ref} style={{ background: C.white, padding: 'clamp(5rem,10vw,9rem) clamp(1.5rem,6vw,5rem)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' as const }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '2rem' }}>
            <span style={{ display: 'block', width: '24px', height: '1px', background: C.gold }} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase' as const, color: C.muted }}>New Season</span>
            <span style={{ display: 'block', width: '24px', height: '1px', background: C.gold }} />
          </div>
        </motion.div>
        {['Ready', 'to glow?'].map((line, i) => (
          <div key={i} style={{ overflow: 'hidden' }}>
            <motion.div initial={{ y: '105%' }} animate={inView ? { y: '0%' } : {}} transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.1 + i * 0.1 }}
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(4rem,10vw,9rem)', fontWeight: 300, lineHeight: 0.9, color: i === 1 ? C.gold : C.ink, letterSpacing: '-0.03em', fontStyle: i === 1 ? 'italic' : 'normal' }}>
              {line}
            </motion.div>
          </div>
        ))}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.4 }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(14px,1.5vw,16px)', lineHeight: 1.75, color: C.muted, margin: '2.5rem auto', maxWidth: '400px' }}>
            New drops every season. Limited quantities. Nationwide COD.
          </p>
          <Link href="/shop" data-cursor="hover"
            style={{ display: 'inline-block', padding: '18px 60px', background: C.forest, color: C.cream, fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase' as const, textDecoration: 'none', transition: 'all 300ms' }}
            onMouseEnter={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.color = C.forest }}
            onMouseLeave={e => { e.currentTarget.style.background = C.forest; e.currentTarget.style.color = C.cream }}>
            Shop the Collection
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <main style={{ background: C.white, overflowX: 'hidden' }}>
      <Hero />
      <Marquee bg={C.forest} color="rgba(245,240,230,0.4)" duration={55} />
      <Products />
      <Marquee bg={C.gold} color={C.forest} duration={35} reverse />
      <BrandStory />
      <PromiseStrip />
      <FinalCTA />
    </main>
  )
}
