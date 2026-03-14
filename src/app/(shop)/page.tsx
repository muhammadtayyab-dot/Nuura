'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

// ─── Tokens ────────────────────────────────────────────────────────
const C = {
  bg:       '#FAF8F4',
  bgAlt:    '#F2EDE4',
  ink:      '#1A1714',
  rose:     '#C4614A',
  roseMid:  '#D4796A',
  roseLight:'#F0C4BB',
  muted:    '#8C8078',
  border:   '#E8E0D8',
  white:    '#FFFFFF',
}

// ─── Mock products ──────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: '1', name: 'Rose Quartz Gua Sha', tagline: 'Sculpt. Depuff. Glow.',
    price: 'PKR 2,800', category: 'Self-Care', slug: 'rose-quartz-gua-sha',
    img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80',
    accent: '#F0C4BB',
  },
  {
    id: '2', name: 'LED Glow Mirror', tagline: 'Studio lighting, anywhere.',
    price: 'PKR 4,500', category: 'Self-Care', slug: 'led-glow-mirror',
    img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80',
    accent: '#D4E8E0',
  },
  {
    id: '3', name: 'Mini Chain Crossbody', tagline: 'Small bag. Big statement.',
    price: 'PKR 3,200', category: 'Accessories', slug: 'mini-chain-crossbody',
    img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
    accent: '#E8E0D8',
  },
  {
    id: '4', name: 'Jade Face Roller', tagline: 'Roll away the stress.',
    price: 'PKR 1,800', category: 'Self-Care', slug: 'jade-face-roller',
    img: 'https://images.unsplash.com/photo-1591994843349-f415893b3a6b?w=600&q=80',
    accent: '#D4EAD4',
  },
  {
    id: '5', name: 'Acrylic Box Clutch', tagline: 'Art you carry.',
    price: 'PKR 2,500', category: 'Accessories', slug: 'acrylic-clutch',
    img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80',
    accent: '#E8D8E8',
  },
]

// ─── Helpers ────────────────────────────────────────────────────────
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

// ─── Section label ──────────────────────────────────────────────────
function Label({ children }: { children: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '10px',
      fontFamily: 'var(--font-sans)', fontSize: '10px',
      letterSpacing: '0.35em', textTransform: 'uppercase', color: C.muted,
    }}>
      <span style={{ width: '24px', height: '1px', background: C.rose, display: 'block' }} />
      {children}
    </span>
  )
}

// ═══════════════════════════════════════════════════════════════════
// HERO
// ═══════════════════════════════════════════════════════════════════
function Hero() {
  const { scrollY } = useScroll()
  const [past, setPast] = useState(false)
  useMotionValueEvent(scrollY, 'change', v => setPast(v > 80))

  const words = ['Your', 'glow,', 'your', 'ritual.']

  return (
    <section style={{ background: C.bg, minHeight: '100svh', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

      {/* Decorative large background letter */}
      <div style={{
        position: 'absolute', right: '-0.05em', top: '50%',
        transform: 'translateY(-50%)',
        fontFamily: 'var(--font-display)', fontSize: 'clamp(300px, 40vw, 600px)',
        fontWeight: 300, lineHeight: 1, color: 'transparent',
        WebkitTextStroke: `1px ${C.border}`,
        userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.05em',
        zIndex: 0,
      }}>N</div>

      {/* Main content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: 'clamp(5rem,10vw,8rem) clamp(1.5rem,6vw,5rem) 4rem',
        position: 'relative', zIndex: 1,
        maxWidth: '1400px', width: '100%', margin: '0 auto',
      }}>

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ marginBottom: '2rem' }}
        >
          <Label>New Collection — 2025</Label>
        </motion.div>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 300,
          lineHeight: 0.88, letterSpacing: '-0.03em',
          fontSize: 'clamp(4rem,11vw,10rem)',
          margin: '0 0 3rem', color: C.ink,
        }}>
          {words.map((word, i) => (
            <div key={i} style={{ overflow: 'hidden', display: 'block' }}>
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.2 + i * 0.1 }}
                style={{
                  display: 'block',
                  fontStyle: i === 1 || i === 3 ? 'italic' : 'normal',
                  color: i === 3 ? C.rose : C.ink,
                }}
              >
                {word}
              </motion.span>
            </div>
          ))}
        </h1>

        {/* Bottom row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2rem', justifyContent: 'space-between' }}
        >
          {/* Left: description + CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <p style={{
              fontFamily: 'var(--font-sans)', fontSize: '15px',
              lineHeight: 1.65, color: C.muted, maxWidth: '320px', margin: 0,
            }}>
              Curated self-care and aesthetic accessories for the woman who moves with intention.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <Link href="/shop" style={{
                display: 'inline-block',
                padding: '14px 36px',
                background: C.ink,
                color: C.bg,
                fontFamily: 'var(--font-sans)',
                fontSize: '11px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'background 300ms',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = C.rose)}
                onMouseLeave={e => (e.currentTarget.style.background = C.ink)}
                data-cursor="hover"
              >
                Shop Now
              </Link>
              <Link href="/shop?filter=new" style={{
                fontFamily: 'var(--font-sans)', fontSize: '11px',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: C.muted, textDecoration: 'none',
                borderBottom: `1px solid ${C.border}`, paddingBottom: '2px',
                transition: 'color 300ms, border-color 300ms',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = C.rose
                  e.currentTarget.style.borderColor = C.rose
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = C.muted
                  e.currentTarget.style.borderColor = C.border
                }}
                data-cursor="hover"
              >
                New Drops →
              </Link>
            </div>
          </div>

          {/* Right: stats */}
          <div style={{ display: 'flex', gap: '3rem' }}>
            {[
              { n: '06', l: 'Curated SKUs' },
              { n: 'PKR 1,500+', l: 'Starting from' },
              { n: 'COD', l: 'Nationwide' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'right' }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem,2.5vw,2rem)',
                  color: C.ink, lineHeight: 1,
                }}>{s.n}</div>
                <div style={{
                  fontFamily: 'var(--font-sans)', fontSize: '9px',
                  letterSpacing: '0.25em', textTransform: 'uppercase',
                  color: C.muted, marginTop: '6px',
                }}>{s.l}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ opacity: past ? 0 : 1 }}
        style={{
          position: 'absolute', bottom: '2rem', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
          pointerEvents: 'none', zIndex: 2,
        }}
      >
        <span style={{
          fontFamily: 'var(--font-sans)', fontSize: '9px',
          letterSpacing: '0.4em', textTransform: 'uppercase', color: C.muted,
        }}>Scroll</span>
        <motion.div
          animate={{ scaleY: [1, 1.8, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: '1px', height: '32px', background: C.rose, transformOrigin: 'top' }}
        />
      </motion.div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// MARQUEE
// ═══════════════════════════════════════════════════════════════════
function Marquee({ bg = C.ink, color = C.bg, speed = 40 }: { bg?: string; color?: string; speed?: number }) {
  const text = 'Self-Care  ✦  Glow Up  ✦  Curated Drops  ✦  Aesthetic  ✦  New Arrivals  ✦  Limited Edition  ✦  Nuura  ✦  نور  ✦  '
  const repeated = text.repeat(6)

  return (
    <div style={{ background: bg, overflow: 'hidden', padding: '14px 0', borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'flex', whiteSpace: 'nowrap' }}
      >
        <span style={{
          fontFamily: 'var(--font-sans)', fontSize: '11px',
          letterSpacing: '0.25em', textTransform: 'uppercase', color,
        }}>
          {repeated}
        </span>
      </motion.div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// HORIZONTAL SCROLL PRODUCTS (Moooi-inspired)
// ═══════════════════════════════════════════════════════════════════
function HorizontalProducts() {
  const trackRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-62%'])

  return (
    <div ref={containerRef} style={{ height: '500vh', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: C.bg }}>

        {/* Section header */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
          padding: 'clamp(1.5rem,4vw,3rem) clamp(1.5rem,6vw,5rem)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <Label>Featured Drop</Label>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3.5rem)',
              fontWeight: 300, color: C.ink, margin: '0.5rem 0 0',
              letterSpacing: '-0.02em',
            }}>
              This season&apos;s obsessions.
            </h2>
          </div>
          <Link href="/shop" style={{
            fontFamily: 'var(--font-sans)', fontSize: '11px',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: C.rose, textDecoration: 'none',
            borderBottom: `1px solid ${C.rose}`, paddingBottom: '2px',
          }} data-cursor="hover">
            View All →
          </Link>
        </div>

        {/* Scrolling track */}
        <motion.div
          ref={trackRef}
          style={{
            x,
            display: 'flex',
            gap: '2rem',
            alignItems: 'center',
            height: '100%',
            paddingLeft: 'clamp(1.5rem,6vw,5rem)',
            paddingRight: '20vw',
            paddingTop: '8rem',
          }}
        >
          {PRODUCTS.map((p, i) => (
            <Link key={p.id} href={`/product/${p.slug}`} style={{ textDecoration: 'none', flexShrink: 0 }} data-cursor="hover">
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                style={{
                  width: 'clamp(240px, 22vw, 320px)',
                  cursor: 'none',
                }}
              >
                {/* Image */}
                <div style={{
                  position: 'relative',
                  aspectRatio: '3/4',
                  background: p.accent,
                  overflow: 'hidden',
                  marginBottom: '1.25rem',
                }}>
                  <Image
                    src={p.img}
                    alt={p.name}
                    fill
                    style={{ objectFit: 'cover', transition: 'transform 600ms ease' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1.06)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1)')}
                  />
                  {/* Category pill */}
                  <div style={{
                    position: 'absolute', top: '12px', left: '12px',
                    background: C.white, padding: '4px 10px',
                    fontFamily: 'var(--font-sans)', fontSize: '9px',
                    letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted,
                  }}>
                    {p.category}
                  </div>
                  {/* Index number */}
                  <div style={{
                    position: 'absolute', bottom: '12px', right: '12px',
                    fontFamily: 'var(--font-display)', fontSize: '3rem',
                    color: 'rgba(255,255,255,0.3)', lineHeight: 1,
                    fontWeight: 300,
                  }}>
                    0{i + 1}
                  </div>
                </div>

                {/* Info */}
                <div>
                  <p style={{
                    fontFamily: 'var(--font-display)', fontSize: '1.25rem',
                    fontWeight: 400, color: C.ink, margin: '0 0 4px',
                    letterSpacing: '-0.01em',
                  }}>{p.name}</p>
                  <p style={{
                    fontFamily: 'var(--font-sans)', fontSize: '12px',
                    color: C.muted, margin: '0 0 8px',
                  }}>{p.tagline}</p>
                  <p style={{
                    fontFamily: 'var(--font-sans)', fontSize: '13px',
                    color: C.rose, margin: 0, letterSpacing: '0.05em',
                  }}>{p.price}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Progress indicator */}
        <div style={{
          position: 'absolute', bottom: '2.5rem', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <span style={{
            fontFamily: 'var(--font-sans)', fontSize: '10px',
            letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted,
          }}>Scroll to explore</span>
          <div style={{ width: '80px', height: '1px', background: C.border, position: 'relative', overflow: 'hidden' }}>
            <motion.div
              style={{
                position: 'absolute', inset: 0,
                background: C.rose,
                scaleX: scrollYProgress, transformOrigin: 'left',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// BRAND STORY
// ═══════════════════════════════════════════════════════════════════
function BrandStory() {
  const { ref, inView } = useInView(0.2)

  return (
    <section style={{ background: C.bgAlt, padding: 'clamp(4rem,10vw,8rem) clamp(1.5rem,6vw,5rem)' }}>
      <div ref={ref} style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>

        {/* Left — Big quote */}
        <div>
          <Label>Our Philosophy</Label>
          <div style={{ overflow: 'hidden', marginTop: '1.5rem' }}>
            <motion.h2
              initial={{ y: '100%' }}
              animate={inView ? { y: '0%' } : {}}
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
              style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem,4.5vw,4rem)',
                fontWeight: 300, lineHeight: 1.05, color: C.ink,
                margin: 0, letterSpacing: '-0.025em',
              }}
            >
              We don&apos;t sell<br />
              products.<br />
              <em style={{ color: C.rose }}>We curate rituals.</em>
            </motion.h2>
          </div>
        </div>

        {/* Right — copy + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '15px',
            lineHeight: 1.75, color: C.muted, marginBottom: '1.5rem',
          }}>
            Nuura was born from a simple truth — Pakistani women deserve beauty that reflects their sophistication. Not fast fashion. Not cluttered marketplaces.
          </p>
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '15px',
            lineHeight: 1.75, color: C.muted, marginBottom: '2.5rem',
          }}>
            Every product we carry is tested, curated, and chosen because it earns its place in your ritual.
          </p>

          {/* Big decorative Arabic */}
          <div style={{
            fontFamily: 'var(--font-accent)', fontSize: '5rem',
            color: C.roseLight, lineHeight: 1, marginBottom: '2rem',
          }}>نور</div>

          <Link href="/shop" style={{
            fontFamily: 'var(--font-sans)', fontSize: '11px',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: C.rose, textDecoration: 'none',
            borderBottom: `1px solid ${C.rose}`, paddingBottom: '3px',
            display: 'inline-block',
            transition: 'opacity 300ms',
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.6')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            data-cursor="hover"
          >
            Explore the Edit →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// BOTTOM CTA BAND
// ═══════════════════════════════════════════════════════════════════
function CTABand() {
  const { ref, inView } = useInView(0.3)

  return (
    <section style={{ background: C.rose, padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,6vw,5rem)', textAlign: 'center' }} ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,6vw,5rem)',
          fontWeight: 300, color: C.white, margin: '0 0 1.5rem',
          letterSpacing: '-0.025em', lineHeight: 1.05,
        }}>
          Ready to glow?
        </h2>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: '15px',
          color: 'rgba(255,255,255,0.75)', marginBottom: '2.5rem',
        }}>
          New drops every season. Limited quantities. Don&apos;t miss out.
        </p>
        <Link href="/shop" style={{
          display: 'inline-block',
          padding: '16px 48px',
          background: C.white,
          color: C.rose,
          fontFamily: 'var(--font-sans)',
          fontSize: '11px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          transition: 'background 300ms, color 300ms',
        }}
          onMouseEnter={e => {
            e.currentTarget.style.background = C.ink
            e.currentTarget.style.color = C.white
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = C.white
            e.currentTarget.style.color = C.rose
          }}
          data-cursor="hover"
        >
          Shop the Collection
        </Link>
      </motion.div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// PAGE EXPORT
// ═══════════════════════════════════════════════════════════════════
export default function NuuraHomePage() {
  return (
    <main style={{ background: C.bg }}>
      <Hero />
      <Marquee bg={C.ink} color={C.bg} speed={50} />
      <HorizontalProducts />
      <Marquee bg={C.rose} color={C.white} speed={35} />
      <BrandStory />
      <CTABand />
    </main>
  )
}
