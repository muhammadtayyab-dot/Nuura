'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useMotionValueEvent, useSpring, useMotionValue } from 'framer-motion'
import Link from 'next/link'

const C = {
  bg: '#FAF8F4', ink: '#1A1714', rose: '#C4614A',
  muted: '#8C8078', border: '#E8E0D8',
}

function useTextScramble(finalText: string, trigger: boolean) {
  const [display, setDisplay] = useState(finalText)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  useEffect(() => {
    if (!trigger) return
    let iteration = 0
    const total = finalText.length * 3
    const interval = setInterval(() => {
      setDisplay(
        finalText
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' '
            if (i < iteration / 3) return finalText[i]
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join('')
      )
      if (iteration >= total) {
        clearInterval(interval)
        setDisplay(finalText)
      }
      iteration++
    }, 30)
    return () => clearInterval(interval)
  }, [trigger, finalText])
  return display
}

export default function Hero() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [triggered, setTriggered] = useState(false)
  const containerRef = useRef<HTMLElement>(null)

  useMotionValueEvent(scrollY, 'change', v => setScrolled(v > 80))

  useEffect(() => {
    const t = setTimeout(() => setTriggered(true), 800)
    return () => clearTimeout(t)
  }, [])

  const scrambled = useTextScramble('Your glow, your ritual.', triggered)

  const words = [
    { text: 'Your', italic: false, rose: false },
    { text: 'glow,', italic: true, rose: false },
    { text: 'your', italic: false, rose: false },
    { text: 'ritual.', italic: true, rose: true },
  ]

  return (
    <section
      ref={containerRef}
      style={{
        position: 'relative',
        minHeight: '100svh',
        background: C.bg,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {/* Animated background gradient that moves */}
      <motion.div
        animate={{
          background: [
            'radial-gradient(ellipse at 20% 50%, rgba(196,97,74,0.06) 0%, transparent 60%)',
            'radial-gradient(ellipse at 80% 20%, rgba(196,97,74,0.08) 0%, transparent 60%)',
            'radial-gradient(ellipse at 50% 80%, rgba(196,97,74,0.05) 0%, transparent 60%)',
            'radial-gradient(ellipse at 20% 50%, rgba(196,97,74,0.06) 0%, transparent 60%)',
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        }}
      />

      {/* Ghost N with parallax */}
      <motion.div
        style={{
          position: 'absolute',
          right: '-0.04em',
          top: '50%',
          translateY: '-50%',
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(280px,38vw,580px)',
          fontWeight: 300,
          lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: `1px ${C.border}`,
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: 0,
        }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        N
      </motion.div>

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 1,
        padding: 'clamp(5rem,10vw,8rem) clamp(1.5rem,6vw,5rem) clamp(4rem,6vw,5rem)',
        maxWidth: '1400px', width: '100%', margin: '0 auto',
      }}>

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}
        >
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ display: 'block', width: '24px', height: '1px', background: C.rose, transformOrigin: 'left' }}
          />
          <span style={{
            fontFamily: 'var(--font-sans)', fontSize: '10px',
            letterSpacing: '0.35em', textTransform: 'uppercase' as const, color: C.muted,
          }}>
            New Collection — 2025
          </span>
        </motion.div>

        {/* Headline with line-by-line reveal */}
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 300,
          lineHeight: 0.9, letterSpacing: '-0.03em',
          fontSize: 'clamp(3.8rem,10.5vw,9.5rem)',
          margin: '0 0 clamp(2rem,4vw,3.5rem)', color: C.ink,
        }}>
          {words.map((word, i) => (
            <div key={i} style={{ overflow: 'hidden', display: 'block' }}>
              <motion.span
                initial={{ y: '110%', skewY: 4 }}
                animate={{ y: '0%', skewY: 0 }}
                transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.3 + i * 0.12 }}
                style={{
                  display: 'block',
                  fontStyle: word.italic ? 'italic' : 'normal',
                  color: word.rose ? C.rose : C.ink,
                }}
              >
                {word.text}
              </motion.span>
            </div>
          ))}
        </h1>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.95 }}
          style={{
            display: 'flex', flexWrap: 'wrap' as const,
            gap: '2.5rem', alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1.5rem' }}>
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(13px,1.5vw,15px)',
              lineHeight: 1.7, color: C.muted,
              maxWidth: '300px', margin: 0,
            }}>
              Curated self-care and aesthetic accessories for the woman who moves with intention.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' as const }}>
              <Link href="/shop" data-cursor="hover" data-cursor-label="Shop"
                style={{
                  display: 'inline-block', padding: '14px 36px',
                  background: C.ink, color: C.bg,
                  fontFamily: 'var(--font-sans)', fontSize: '11px',
                  letterSpacing: '0.22em', textTransform: 'uppercase' as const,
                  textDecoration: 'none', transition: 'background 300ms, transform 300ms',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = C.rose
                  e.currentTarget.style.transform = 'scale(1.03)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = C.ink
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                Shop Now
              </Link>

              <Link href="/shop?filter=new" data-cursor="hover"
                style={{
                  fontFamily: 'var(--font-sans)', fontSize: '11px',
                  letterSpacing: '0.22em', textTransform: 'uppercase' as const,
                  color: C.muted, textDecoration: 'none',
                  borderBottom: `1px solid ${C.border}`, paddingBottom: '2px',
                  transition: 'color 250ms, border-color 250ms',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = C.rose
                  e.currentTarget.style.borderColor = C.rose
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = C.muted
                  e.currentTarget.style.borderColor = C.border
                }}
              >
                New Drops →
              </Link>
            </div>
          </div>

          {/* Stats with count-up feel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            style={{
              display: 'flex', gap: '0',
              borderTop: `1px solid ${C.border}`,
              paddingTop: '1.5rem',
            }}
          >
            {[
              { n: '06', l: 'Curated SKUs' },
              { n: '1,500+', l: 'Starting PKR' },
              { n: 'COD', l: 'Nationwide' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + i * 0.1, duration: 0.5 }}
                style={{
                  paddingRight: i < 2 ? '2rem' : '0',
                  paddingLeft: i > 0 ? '2rem' : '0',
                  borderRight: i < 2 ? `1px solid ${C.border}` : 'none',
                }}
              >
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.3rem,2.2vw,1.8rem)',
                  color: C.ink, lineHeight: 1,
                }}>{s.n}</div>
                <div style={{
                  fontFamily: 'var(--font-sans)', fontSize: '9px',
                  letterSpacing: '0.25em', textTransform: 'uppercase' as const,
                  color: C.muted, marginTop: '6px',
                }}>{s.l}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ opacity: scrolled ? 0 : 1 }}
        style={{
          position: 'absolute', bottom: '2rem', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column' as const,
          alignItems: 'center', gap: '8px',
          pointerEvents: 'none', zIndex: 2,
        }}
      >
        <span style={{
          fontFamily: 'var(--font-sans)', fontSize: '9px',
          letterSpacing: '0.4em', textTransform: 'uppercase' as const, color: C.muted,
        }}>Scroll</span>
        <motion.div
          animate={{ scaleY: [1, 1.8, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: '1px', height: '36px', background: C.rose, transformOrigin: 'top' }}
        />
      </motion.div>
    </section>
  )
}
