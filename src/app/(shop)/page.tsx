'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'

const C = {
  forest: '#1B2E1F', cream: '#F5F0E6', gold: '#D4A853',
  goldLight: '#E8C97A', white: '#FAFAF8', offwhite: '#F0EBE3',
  ink: '#0F1A11', muted: '#6B7B6E', border: '#DDD8CF',
}

const PRODUCTS = [
  { id: '1', name: 'Rose Quartz Gua Sha', tagline: 'Sculpt. Depuff. Glow.', price: 'PKR 2,800', comparePrice: 'PKR 3,500', slug: 'rose-quartz-gua-sha', isNew: true, bg: '#F5EFEC', img: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=85' },
  { id: '2', name: 'LED Glow Mirror', tagline: 'Studio lighting, anywhere.', price: 'PKR 4,500', comparePrice: 'PKR 5,500', slug: 'led-glow-mirror', isNew: false, bg: '#ECF0F5', img: 'https://images.unsplash.com/photo-1583241800698-e8ab01830a22?w=800&q=85' },
  { id: '3', name: 'Mini Chain Crossbody', tagline: 'Small bag. Big statement.', price: 'PKR 3,200', comparePrice: null, slug: 'mini-chain-crossbody', isNew: true, bg: '#F0EBE4', img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=85' },
  { id: '4', name: 'Jade Face Roller', tagline: 'Roll away the stress.', price: 'PKR 1,800', comparePrice: 'PKR 2,200', slug: 'jade-face-roller', isNew: false, bg: '#ECF5EE', img: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=85' },
  { id: '5', name: 'Acrylic Box Clutch', tagline: 'Art you carry.', price: 'PKR 2,500', comparePrice: null, slug: 'acrylic-clutch', isNew: true, bg: '#F0ECF5', img: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=85' },
  { id: '6', name: 'USB Facial Steamer', tagline: 'Open up. Breathe in. Glow.', price: 'PKR 3,800', comparePrice: 'PKR 4,500', slug: 'facial-steamer', isNew: false, bg: '#ECF5F5', img: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=85' },
]

const REVIEWS = [
  { name: 'Aisha K.', city: 'Lahore', rating: 5, text: 'The gua sha changed my entire morning routine. My skin looks lifted and I get compliments every day. Worth every rupee and more.', product: 'Rose Quartz Gua Sha', initials: 'AK' },
  { name: 'Fatima R.', city: 'Karachi', rating: 5, text: 'Finally a Pakistani brand that feels premium. The packaging is gorgeous, delivery was fast, and the LED mirror is absolutely stunning.', product: 'LED Glow Mirror', initials: 'FR' },
  { name: 'Zara M.', city: 'Islamabad', rating: 5, text: 'I ordered the chain crossbody for Eid and literally everyone asked where I got it. Nuura is my go-to now.', product: 'Mini Chain Crossbody', initials: 'ZM' },
  { name: 'Nadia S.', city: 'Lahore', rating: 5, text: 'The facial steamer has transformed my skin. I use it twice a week and my moisturizer absorbs so much better. Game changer.', product: 'USB Facial Steamer', initials: 'NS' },
  { name: 'Hira T.', city: 'Faisalabad', rating: 5, text: 'COD made it so easy to order without any hesitation. The jade roller arrived beautifully packaged. Love this brand.', product: 'Jade Face Roller', initials: 'HT' },
  { name: 'Sara A.', city: 'Rawalpindi', rating: 5, text: 'The acrylic clutch is exactly what my collection was missing. Got so many messages on Instagram asking about it!', product: 'Acrylic Box Clutch', initials: 'SA' },
]

const STATS = [
  { value: '10K+', label: 'Happy Customers' },
  { value: '4.9?', label: 'Average Rating' },
  { value: '48h', label: 'Avg. Delivery' },
  { value: '100%', label: 'Authentic Products' },
]

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

function useIsMobile() {
  const [v, setV] = useState(false)
  useEffect(() => {
    const c = () => setV(window.innerWidth < 768)
    c()
    window.addEventListener('resize', c)
    return () => window.removeEventListener('resize', c)
  }, [])
  return v
}

// -- HERO ----------------------------------------------------------
function Hero() {
  return (
    <section style={{
      position: 'relative',
      height: '100svh',
      minHeight: '640px',
      background: C.forest,
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'flex-end',
    }}>
      {/* Full-bleed background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Image
          src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1600&q=90"
          alt="Nuura Hero"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
          priority
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(11,26,15,0.97) 0%, rgba(11,26,15,0.7) 35%, rgba(11,26,15,0.25) 65%, rgba(11,26,15,0.05) 100%)',
        }} />
      </div>

      {/* Content — anchored to bottom, two-column on desktop */}
      <div style={{
        position: 'relative', zIndex: 1, width: '100%',
        padding: '0 clamp(1.5rem, 5vw, 5rem) clamp(3rem, 6vw, 5rem)',
        paddingTop: '88px', // clear navbar
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr)',
        gap: '0',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.75rem' }}
        >
          <motion.span
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: 'block', width: '32px', height: '1px', background: C.gold, transformOrigin: 'left' }}
          />
          <span style={{
            fontFamily: 'var(--font-sans)', fontSize: '10px',
            letterSpacing: '0.4em', textTransform: 'uppercase' as const,
            color: 'rgba(245,240,230,0.6)',
          }}>
            New Collection — 2025
          </span>
        </motion.div>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 300,
          lineHeight: 0.88, letterSpacing: '-0.03em',
          fontSize: 'clamp(4rem, 11vw, 11rem)',
          margin: '0 0 clamp(2rem, 3vw, 3rem)', color: C.cream,
        }}>
          {[
            { t: 'Your', i: false, g: false },
            { t: 'glow,', i: true, g: false },
            { t: 'your', i: false, g: false },
            { t: 'ritual.', i: true, g: true },
          ].map((w, i) => (
            <div key={i} style={{ overflow: 'hidden', display: 'block' }}>
              <motion.span
                initial={{ y: '110%', skewY: 3 }}
                animate={{ y: '0%', skewY: 0 }}
                transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.25 + i * 0.1 }}
                style={{ display: 'block', fontStyle: w.i ? 'italic' : 'normal', color: w.g ? C.gold : C.cream }}
              >
                {w.t}
              </motion.span>
            </div>
          ))}
        </h1>

        {/* Bottom row: subtitle + CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85 }}
          style={{
            display: 'flex', flexWrap: 'wrap' as const,
            alignItems: 'center', justifyContent: 'space-between',
            gap: '1.5rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(245,240,230,0.12)',
          }}
        >
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: 'clamp(13px, 1.4vw, 16px)',
            lineHeight: 1.7, color: 'rgba(245,240,230,0.65)',
            maxWidth: '360px', margin: 0,
          }}>
            Curated self-care and aesthetic accessories for the woman who moves with intention.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' as const }}>
            <Link href="/shop"
              style={{
                display: 'inline-block', padding: '15px 44px',
                background: C.gold, color: C.forest,
                fontFamily: 'var(--font-sans)', fontSize: '11px',
                letterSpacing: '0.28em', textTransform: 'uppercase' as const,
                textDecoration: 'none', fontWeight: 600, transition: 'all 300ms',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = C.goldLight; e.currentTarget.style.transform = 'scale(1.03)' }}
              onMouseLeave={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.transform = 'scale(1)' }}
            >
              Shop Now
            </Link>
            <Link href="/shop?filter=new"
              style={{
                display: 'inline-block', padding: '15px 44px',
                border: '1px solid rgba(245,240,230,0.25)', color: C.cream,
                fontFamily: 'var(--font-sans)', fontSize: '11px',
                letterSpacing: '0.28em', textTransform: 'uppercase' as const,
                textDecoration: 'none', transition: 'all 300ms',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(245,240,230,0.25)'; e.currentTarget.style.color = C.cream }}
            >
              New Drops
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: '2.5rem',
        right: 'clamp(1.5rem, 6vw, 5rem)',
        display: 'flex', flexDirection: 'column' as const,
        alignItems: 'center', gap: '8px', zIndex: 2,
      }}>
        <motion.div
          animate={{ scaleY: [1, 1.8, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: '1px', height: '48px', background: C.gold, transformOrigin: 'top' }}
        />
        <span style={{
          fontFamily: 'var(--font-sans)', fontSize: '9px',
          letterSpacing: '0.4em', textTransform: 'uppercase' as const,
          color: 'rgba(245,240,230,0.35)', writingMode: 'vertical-rl' as const,
        }}>Scroll</span>
      </div>
    </section>
  )
}

// -- MARQUEE -------------------------------------------------------
function Marquee({ bg = C.forest, color = C.cream, duration = 55, reverse = false }: {
  bg?: string; color?: string; duration?: number; reverse?: boolean
}) {
  const text = 'Self-Care  ?  Glow Up  ?  Curated Drops  ?  Aesthetic  ?  New Arrivals  ?  Limited Edition  ?  Nuura  ?  ???  ?  '
  return (
    <div style={{ background: bg, overflow: 'hidden', padding: '14px 0' }}>
      <motion.div
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'flex', whiteSpace: 'nowrap' as const }}
      >
        <span style={{
          fontFamily: 'var(--font-sans)', fontSize: '11px',
          letterSpacing: '0.28em', textTransform: 'uppercase' as const, color,
        }}>{text.repeat(8)}</span>
      </motion.div>
    </div>
  )
}

// -- STATS BAR -----------------------------------------------------
function StatsBar() {
  const { ref, inView } = useInView(0.2)
  return (
    <section style={{ background: C.offwhite, padding: 'clamp(2.5rem,5vw,4rem) clamp(1.5rem,6vw,5rem)' }}>
      <div ref={ref} style={{
        maxWidth: '1400px', margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'repeat(2,1fr)',
        gap: '0',
      }} className="md:grid-cols-4">
        {STATS.map((s, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            style={{
              textAlign: 'center' as const, padding: 'clamp(1.5rem,3vw,2.5rem) 1rem',
              borderLeft: i % 2 !== 0 ? `1px solid ${C.border}` : 'none',
              borderTop: i >= 2 ? `1px solid ${C.border}` : 'none',
            }}
          >
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem,4vw,3.2rem)',
              fontWeight: 300, color: C.forest, lineHeight: 1,
            }}>{s.value}</div>
            <div style={{
              fontFamily: 'var(--font-sans)', fontSize: '11px',
              letterSpacing: '0.2em', textTransform: 'uppercase' as const,
              color: C.muted, marginTop: '8px',
            }}>{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// -- PRODUCT CARD --------------------------------------------------
function PCard({ p, i }: { p: typeof PRODUCTS[0]; i: number }) {
  const [hov, setHov] = useState(false)
  return (
    <Link href={`/product/${p.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <motion.div
        onHoverStart={() => setHov(true)}
        onHoverEnd={() => setHov(false)}
        animate={{ y: hov ? -8 : 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div style={{
          position: 'relative', aspectRatio: '3/4',
          background: p.bg, overflow: 'hidden', marginBottom: '1.25rem',
        }}>
          <Image
            src={p.img} alt={p.name} fill
            sizes="(max-width:768px) 72vw, 300px"
            style={{ objectFit: 'cover', transition: 'transform 800ms ease', transform: hov ? 'scale(1.07)' : 'scale(1)' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: hov ? 'rgba(11,26,15,0.15)' : 'transparent',
            transition: 'background 400ms',
          }} />
          {p.isNew && (
            <span style={{
              position: 'absolute', top: '14px', left: '14px',
              background: C.forest, color: C.cream,
              fontFamily: 'var(--font-sans)', fontSize: '9px',
              letterSpacing: '0.2em', textTransform: 'uppercase' as const,
              padding: '5px 12px',
            }}>New</span>
          )}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'rgba(27,46,31,0.9)', backdropFilter: 'blur(4px)',
            padding: '14px', textAlign: 'center' as const,
            transform: hov ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 350ms ease',
            fontFamily: 'var(--font-sans)', fontSize: '10px',
            letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: C.gold,
          }}>
            Quick Add +
          </div>
        </div>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: C.ink, margin: '0 0 4px', letterSpacing: '-0.01em' }}>{p.name}</p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: C.muted, margin: '0 0 10px' }}>{p.tagline}</p>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: C.forest, fontWeight: 500 }}>{p.price}</span>
          {p.comparePrice && (
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: C.muted, textDecoration: 'line-through' }}>{p.comparePrice}</span>
          )}
        </div>
      </motion.div>
    </Link>
  )
}

// -- PRODUCTS SECTION (unified — handles both mobile and desktop) --
function Products() {
  const [active, setActive] = useState(0)
  const isMobile = useIsMobile()
  const startX = useRef(0)
  const VISIBLE = isMobile ? 1 : 3
  const CARD_WIDTH = isMobile ? 78 : 32 // vw units per card
  const GAP = isMobile ? 4 : 2 // vw units gap

  const prev = () => setActive(p => Math.max(p - 1, 0))
  const next = () => setActive(p => Math.min(p + 1, PRODUCTS.length - VISIBLE))
  const canPrev = active > 0
  const canNext = active < PRODUCTS.length - VISIBLE

  const translateX = active * (CARD_WIDTH + GAP)

  return (
    <section style={{ background: C.white, padding: 'clamp(4rem,8vw,7rem) 0', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '0 clamp(1.5rem,5vw,5rem)',
        marginBottom: 'clamp(2.5rem,4vw,4rem)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        flexWrap: 'wrap' as const, gap: '1.5rem',
        maxWidth: '1400px', margin: '0 auto clamp(2.5rem,4vw,4rem)',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <span style={{ display: 'block', width: '24px', height: '1px', background: C.gold }} />
            <span style={{
              fontFamily: 'var(--font-sans)', fontSize: '10px',
              letterSpacing: '0.35em', textTransform: 'uppercase' as const, color: C.muted,
            }}>Featured Drop</span>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3.5rem)',
            fontWeight: 300, color: C.ink, margin: 0, letterSpacing: '-0.025em',
          }}>This season&apos;s obsessions.</h2>
        </div>

        {/* Arrow buttons + View All */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={prev}
              disabled={!canPrev}
              style={{
                width: '48px', height: '48px',
                border: `1px solid ${canPrev ? C.forest : C.border}`,
                background: 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: canPrev ? 'pointer' : 'not-allowed',
                opacity: canPrev ? 1 : 0.35,
                transition: 'all 200ms',
              }}
              onMouseEnter={e => { if (canPrev) { (e.currentTarget as HTMLButtonElement).style.background = C.forest } }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
            >
              <ChevronLeft size={20} color={canPrev ? C.forest : C.muted} strokeWidth={1.5} />
            </button>
            <button
              onClick={next}
              disabled={!canNext}
              style={{
                width: '48px', height: '48px',
                border: `1px solid ${canNext ? C.forest : C.border}`,
                background: canNext ? C.forest : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: canNext ? 'pointer' : 'not-allowed',
                opacity: canNext ? 1 : 0.35,
                transition: 'all 200ms',
              }}
              onMouseEnter={e => { if (canNext) { (e.currentTarget as HTMLButtonElement).style.background = C.gold; (e.currentTarget as HTMLButtonElement).style.borderColor = C.gold } }}
              onMouseLeave={e => { if (canNext) { (e.currentTarget as HTMLButtonElement).style.background = C.forest; (e.currentTarget as HTMLButtonElement).style.borderColor = C.forest } }}
            >
              <ChevronRight size={20} color={canNext ? C.cream : C.muted} strokeWidth={1.5} />
            </button>
          </div>
          <Link href="/shop" style={{
            fontFamily: 'var(--font-sans)', fontSize: '11px',
            letterSpacing: '0.22em', textTransform: 'uppercase' as const,
            color: C.gold, textDecoration: 'none',
            borderBottom: `1px solid ${C.gold}`, paddingBottom: '2px',
            display: isMobile ? 'none' : 'inline-block',
          }}>View All ?</Link>
        </div>
      </div>

      {/* Carousel track */}
      <div
        style={{ overflow: 'hidden', paddingLeft: 'clamp(1.5rem,5vw,5rem)' }}
        onTouchStart={e => { startX.current = e.touches[0].clientX }}
        onTouchEnd={e => {
          const d = startX.current - e.changedTouches[0].clientX
          if (Math.abs(d) > 40) { if (d > 0) next(); else prev() }
        }}
      >
        <motion.div
          animate={{ x: `-${translateX}vw` }}
          transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ display: 'flex', gap: `${GAP}vw` }}
        >
          {PRODUCTS.map((p, i) => (
            <div key={p.id} style={{ width: `${CARD_WIDTH}vw`, flexShrink: 0 }}>
              <PCard p={p} i={i} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '2.5rem' }}>
        {Array.from({ length: PRODUCTS.length - VISIBLE + 1 }).map((_, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            width: i === active ? '28px' : '6px', height: '6px',
            borderRadius: '3px',
            background: i === active ? C.gold : C.border,
            border: 'none', padding: 0, cursor: 'pointer', transition: 'all 300ms',
          }} />
        ))}
      </div>

      {/* Mobile View All */}
      {isMobile && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
          <Link href="/shop" style={{
            fontFamily: 'var(--font-sans)', fontSize: '11px',
            letterSpacing: '0.22em', textTransform: 'uppercase' as const,
            color: C.gold, textDecoration: 'none',
            borderBottom: `1px solid ${C.gold}`, paddingBottom: '2px',
          }}>View All Products ?</Link>
        </div>
      )}
    </section>
  )
}

// -- BRAND STORY ---------------------------------------------------
function BrandStory() {
  const { ref, inView } = useInView(0.15)
  return (
    <section style={{ background: C.offwhite, padding: 'clamp(5rem,10vw,9rem) clamp(1.5rem,5vw,5rem)' }}>
      <div ref={ref} style={{
        maxWidth: '1400px', margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(1,1fr)',
        gap: 'clamp(3rem,5vw,5rem)',
        alignItems: 'center',
      }} className="md:grid-cols-2">
        {/* Left */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}
          >
            <motion.span
              initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{ display: 'block', width: '24px', height: '1px', background: C.gold, transformOrigin: 'left' }}
            />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase' as const, color: C.muted }}>Our Philosophy</span>
          </motion.div>
          {['We don\'t sell', 'products.', 'We curate rituals.'].map((line, i) => (
            <div key={i} style={{ overflow: 'hidden' }}>
              <motion.div
                initial={{ y: '105%' }} animate={inView ? { y: '0%' } : {}}
                transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.1 + i * 0.12 }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.2rem,4.5vw,4rem)',
                  fontWeight: 300, lineHeight: 1.05,
                  letterSpacing: '-0.025em',
                  color: i === 2 ? C.gold : C.ink,
                  fontStyle: i === 2 ? 'italic' : 'normal',
                }}
              >
                {line}
              </motion.div>
            </div>
          ))}
        </div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(14px,1.5vw,16px)', lineHeight: 1.85, color: C.muted, marginBottom: '1.5rem' }}>
            Nuura was born from a simple truth — Pakistani women deserve beauty that reflects their sophistication. Not fast fashion. Not cluttered marketplaces.
          </p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(14px,1.5vw,16px)', lineHeight: 1.85, color: C.muted, marginBottom: '2.5rem' }}>
            Every product we carry is tested, curated, and chosen because it earns its place in your ritual.
          </p>
          <div style={{ fontFamily: 'var(--font-accent)', fontSize: 'clamp(4rem,7vw,6rem)', color: C.gold, lineHeight: 1, marginBottom: '2.5rem', opacity: 0.5 }}>???</div>
          <Link href="/shop"
            style={{
              fontFamily: 'var(--font-sans)', fontSize: '11px',
              letterSpacing: '0.25em', textTransform: 'uppercase' as const,
              color: C.forest, textDecoration: 'none',
              borderBottom: `2px solid ${C.gold}`, paddingBottom: '4px',
              display: 'inline-block', transition: 'all 300ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = C.gold; e.currentTarget.style.letterSpacing = '0.32em' }}
            onMouseLeave={e => { e.currentTarget.style.color = C.forest; e.currentTarget.style.letterSpacing = '0.25em' }}
          >
            Explore the Edit ?
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// -- REVIEWS -------------------------------------------------------
function Reviews() {
  const { ref, inView } = useInView(0.1)
  const [active, setActive] = useState(0)
  const isMobile = useIsMobile()
  const visibleCount = isMobile ? 1 : 3

  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % (REVIEWS.length - visibleCount + 1)), 4500)
    return () => clearInterval(t)
  }, [visibleCount])

  const visible = Array.from({ length: visibleCount }, (_, i) => REVIEWS[(active + i) % REVIEWS.length])

  return (
    <section style={{ background: C.forest, padding: 'clamp(5rem,10vw,8rem) clamp(1.5rem,5vw,5rem)', overflow: 'hidden' }}>
      <div ref={ref} style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'clamp(2.5rem,5vw,4rem)', flexWrap: 'wrap' as const, gap: '1rem' }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <span style={{ display: 'block', width: '24px', height: '1px', background: C.gold }} />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase' as const, color: 'rgba(245,240,230,0.4)' }}>Customer Love</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 300, color: C.cream, margin: 0, letterSpacing: '-0.025em' }}>
              Real women. Real results.
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActive(p => Math.max(p - 1, 0))}
              style={{ width: '44px', height: '44px', border: '1px solid rgba(245,240,230,0.2)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 200ms' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.gold }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(245,240,230,0.2)' }}
            >
              <ChevronLeft size={18} color={C.cream} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setActive(p => Math.min(p + 1, REVIEWS.length - visibleCount))}
              style={{ width: '44px', height: '44px', border: '1px solid rgba(245,240,230,0.2)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 200ms' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.gold }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(245,240,230,0.2)' }}
            >
              <ChevronRight size={18} color={C.cream} strokeWidth={1.5} />
            </button>
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${visibleCount},1fr)`, gap: '1.5rem' }}>
          <AnimatePresence mode="wait">
            {visible.map((r, i) => (
              <motion.div key={`${active}-${i}`}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                style={{ background: 'rgba(245,240,230,0.06)', border: '1px solid rgba(245,240,230,0.08)', padding: 'clamp(1.5rem,3vw,2.5rem)' }}
              >
                <Quote size={24} color={C.gold} strokeWidth={1} style={{ marginBottom: '1.25rem', opacity: 0.6 }} />
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', lineHeight: 1.75, color: 'rgba(245,240,230,0.75)', marginBottom: '1.5rem' }}>
                  &ldquo;{r.text}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(212,168,83,0.15)', border: `1px solid ${C.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: C.gold }}>{r.initials}</span>
                    </div>
                    <div>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: C.cream, margin: 0, fontWeight: 500 }}>{r.name}</p>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'rgba(245,240,230,0.4)', margin: 0 }}>{r.city}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {[...Array(r.rating)].map((_, si) => <Star key={si} size={12} fill={C.gold} color={C.gold} />)}
                  </div>
                </div>
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(245,240,230,0.06)' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'rgba(245,240,230,0.3)' }}>Reviewed: {r.product}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '2rem' }}>
          {Array.from({ length: REVIEWS.length - visibleCount + 1 }).map((_, i) => (
            <button key={i} onClick={() => setActive(i)} style={{
              width: i === active ? '24px' : '6px', height: '6px', borderRadius: '3px',
              background: i === active ? C.gold : 'rgba(245,240,230,0.2)',
              border: 'none', padding: 0, cursor: 'pointer', transition: 'all 300ms',
            }} />
          ))}
        </div>
      </div>
    </section>
  )
}

// -- PROMISE STRIP -------------------------------------------------
function PromiseStrip() {
  const { ref, inView } = useInView(0.2)
  const items = [
    { n: '01', title: 'Curated, not cluttered', desc: '12–18 SKUs per drop. Every product earns its place.' },
    { n: '02', title: 'Cash on Delivery', desc: 'Nationwide COD. No trust issues, no upfront risk.' },
    { n: '03', title: 'Limited drops', desc: "When it's gone, it's gone. New drops every season." },
  ]
  return (
    <section style={{ background: C.white, padding: 'clamp(5rem,10vw,8rem) clamp(1.5rem,5vw,5rem)', borderTop: `1px solid ${C.border}` }}>
      <div ref={ref} style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(1,1fr)', gap: '0' }} className="md:grid-cols-3">
        {items.map((item, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: i * 0.15 }}
            style={{
              padding: 'clamp(2rem,3vw,3rem)',
              borderLeft: i > 0 ? `1px solid ${C.border}` : 'none',
              borderTop: `3px solid ${i === 0 ? C.gold : 'transparent'}`,
            }}
          >
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', color: 'rgba(212,168,83,0.15)', lineHeight: 1, marginBottom: '1.5rem', fontWeight: 300 }}>{item.n}</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem,2.5vw,2rem)', fontWeight: 300, color: C.ink, margin: '0 0 1rem', letterSpacing: '-0.01em' }}>{item.title}</h3>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', lineHeight: 1.75, color: C.muted, margin: 0 }}>{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// -- FINAL CTA -----------------------------------------------------
function FinalCTA() {
  const { ref, inView } = useInView(0.3)
  return (
    <section ref={ref} style={{ background: C.forest, padding: 'clamp(5rem,10vw,9rem) clamp(1.5rem,5vw,5rem)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' as const }}>
        <motion.div
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '2rem' }}
        >
          <span style={{ display: 'block', width: '24px', height: '1px', background: C.gold }} />
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase' as const, color: 'rgba(245,240,230,0.4)' }}>New Season</span>
          <span style={{ display: 'block', width: '24px', height: '1px', background: C.gold }} />
        </motion.div>
        {['Ready', 'to glow?'].map((line, i) => (
          <div key={i} style={{ overflow: 'hidden' }}>
            <motion.div
              initial={{ y: '105%' }} animate={inView ? { y: '0%' } : {}}
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.1 + i * 0.1 }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(4rem,10vw,9rem)',
                fontWeight: 300, lineHeight: 0.9,
                color: i === 1 ? C.gold : C.cream,
                letterSpacing: '-0.03em',
                fontStyle: i === 1 ? 'italic' : 'normal',
              }}
            >
              {line}
            </motion.div>
          </div>
        ))}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(14px,1.5vw,16px)', lineHeight: 1.75, color: 'rgba(245,240,230,0.55)', margin: '2.5rem auto', maxWidth: '400px' }}>
            New drops every season. Limited quantities. Nationwide COD.
          </p>
          <Link href="/shop"
            style={{
              display: 'inline-block', padding: '18px 64px',
              background: C.gold, color: C.forest,
              fontFamily: 'var(--font-sans)', fontSize: '11px',
              letterSpacing: '0.3em', textTransform: 'uppercase' as const,
              textDecoration: 'none', fontWeight: 600, transition: 'all 300ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.goldLight; e.currentTarget.style.transform = 'scale(1.03)' }}
            onMouseLeave={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.transform = 'scale(1)' }}
          >
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
      <Marquee bg={C.forest} color="rgba(245,240,230,0.35)" duration={55} />
      <StatsBar />
      <Products />
      <Marquee bg={C.gold} color={C.forest} duration={35} reverse />
      <BrandStory />
      <Reviews />
      <PromiseStrip />
      <FinalCTA />
    </main>
  )
}

