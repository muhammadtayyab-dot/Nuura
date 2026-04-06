'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'

const C = {
  bg: '#FAF8F4', bgAlt: '#F2EDE4', ink: '#1A1714',
  rose: '#C4614A', roseLight: '#F0C4BB', muted: '#8C8078', border: '#E8E0D8',
}

function useInView(threshold = 0.15) {
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

export default function BrandStory() {
  const { ref, inView } = useInView(0.2)
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const arabicY = useTransform(scrollYProgress, [0, 1], ['20px', '-40px'])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.05])

  return (
    <section ref={sectionRef} style={{ background: C.bgAlt, padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,6vw,5rem)', overflow: 'hidden', position: 'relative' }}>

      {/* Animated background */}
      <motion.div
        style={{ scale: bgScale, position: 'absolute', inset: 0, background: C.bgAlt, zIndex: 0 }}
      />

      <div ref={ref} style={{
        maxWidth: '1400px', margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(1,1fr)',
        gap: '3rem',
        position: 'relative', zIndex: 1,
      }}
        className="md:grid-cols-2 md:gap-20 items-center"
      >
        {/* Left — quote */}
        <div>
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}
          >
            <motion.span
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{ display: 'block', width: '24px', height: '1px', background: C.rose, transformOrigin: 'left' }}
            />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase' as const, color: C.muted }}>
              Our Philosophy
            </span>
          </motion.div>

          {/* Big quote — line by line */}
          {['We don\'t sell', 'products.', 'We curate rituals.'].map((line, i) => (
            <div key={i} style={{ overflow: 'hidden' }}>
              <motion.div
                initial={{ y: '105%' }}
                animate={inView ? { y: '0%' } : {}}
                transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.1 + i * 0.12 }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem,4.5vw,3.8rem)',
                  fontWeight: 300,
                  lineHeight: 1.1,
                  letterSpacing: '-0.025em',
                  color: i === 2 ? C.rose : C.ink,
                  fontStyle: i === 2 ? 'italic' : 'normal',
                }}
              >
                {line}
              </motion.div>
            </div>
          ))}
        </div>

        {/* Right — copy + Arabic */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(13px,1.5vw,15px)', lineHeight: 1.8, color: C.muted, marginBottom: '1.25rem' }}>
            Nuura was born from a simple truth — Pakistani women deserve beauty that reflects their sophistication. Not fast fashion. Not cluttered marketplaces.
          </p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(13px,1.5vw,15px)', lineHeight: 1.8, color: C.muted, marginBottom: '2.5rem' }}>
            Every product we carry is tested, curated, and chosen because it earns its place in your ritual.
          </p>

          {/* Arabic with parallax */}
          <motion.div
            style={{ y: arabicY, fontFamily: 'var(--font-accent)', fontSize: 'clamp(3.5rem,6vw,5.5rem)', color: C.roseLight, lineHeight: 1, marginBottom: '2rem' }}
          >
            نور
          </motion.div>

          <Link href="/shop" data-cursor="hover"
            style={{
              fontFamily: 'var(--font-sans)', fontSize: '11px',
              letterSpacing: '0.22em', textTransform: 'uppercase' as const,
              color: C.rose, textDecoration: 'none',
              borderBottom: `1px solid ${C.rose}`, paddingBottom: '3px',
              display: 'inline-block', transition: 'opacity 250ms, letter-spacing 300ms',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = '0.7'
              e.currentTarget.style.letterSpacing = '0.3em'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = '1'
              e.currentTarget.style.letterSpacing = '0.22em'
            }}
          >
            Explore the Edit →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
