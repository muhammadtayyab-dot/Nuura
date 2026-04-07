'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/cartStore'

const C = {
  forest: '#1B2E1F', cream: '#F5F0E6', gold: '#D4A853',
  white: '#FAFAF8', ink: '#0F1A11', muted: '#6B7B6E',
}

const LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'New Arrivals', href: '/shop?filter=new' },
  { label: 'Self-Care', href: '/shop?category=self-care' },
  { label: 'Accessories', href: '/shop?category=accessories' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const items = useCartStore(s => s.items)
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  const isHeroPage = pathname === '/'
  const transparent = isHeroPage && !scrolled && !mobileOpen

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: transparent ? 'transparent' : scrolled ? 'rgba(250,250,248,0.97)' : C.white,
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: transparent ? 'none' : `1px solid rgba(221,216,207,0.6)`,
        transition: 'all 350ms ease',
        padding: '0 clamp(1.25rem, 4vw, 4rem)',
        height: '68px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <span style={{
            fontFamily: 'var(--font-accent)',
            fontSize: 'clamp(22px, 3vw, 30px)',
            letterSpacing: '0.45em',
            color: transparent ? C.cream : C.forest,
            textTransform: 'uppercase' as const,
            transition: 'color 350ms',
            lineHeight: 1,
          }}>
            NUURA
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{
          display: 'flex', alignItems: 'center', gap: 'clamp(1.5rem, 3vw, 3rem)',
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
        }} className="hidden md:flex">
          {LINKS.map(link => {
            const active = pathname === link.href
            return (
              <Link key={link.href} href={link.href} style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '12px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase' as const,
                color: transparent
                  ? (active ? C.gold : 'rgba(245,240,230,0.75)')
                  : (active ? C.forest : C.muted),
                textDecoration: 'none',
                borderBottom: active ? `1px solid ${C.gold}` : '1px solid transparent',
                paddingBottom: '2px',
                transition: 'all 250ms',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = C.gold; e.currentTarget.style.borderBottomColor = C.gold }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = transparent ? (active ? C.gold : 'rgba(245,240,230,0.75)') : (active ? C.forest : C.muted)
                  e.currentTarget.style.borderBottomColor = active ? C.gold : 'transparent'
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
          <Link href="/cart" style={{ position: 'relative', textDecoration: 'none' }}>
            <ShoppingBag
              size={22} strokeWidth={1.5}
              color={transparent ? C.cream : C.forest}
              style={{ display: 'block', transition: 'color 350ms' }}
            />
            {totalItems > 0 && (
              <span style={{
                position: 'absolute', top: '-6px', right: '-6px',
                width: '18px', height: '18px', borderRadius: '50%',
                background: C.gold, color: C.forest,
                fontFamily: 'var(--font-sans)', fontSize: '10px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {totalItems}
              </span>
            )}
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: '4px', display: 'flex', alignItems: 'center',
              color: transparent ? C.cream : C.forest,
            }}
            className="flex md:hidden"
          >
            {mobileOpen
              ? <X size={22} strokeWidth={1.5} />
              : <Menu size={22} strokeWidth={1.5} />
            }
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed', top: '68px', left: 0, right: 0, zIndex: 99,
              background: C.forest,
              padding: '2rem clamp(1.25rem, 4vw, 4rem)',
              display: 'flex', flexDirection: 'column', gap: '0',
            }}
          >
            {LINKS.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link href={link.href} style={{
                  display: 'block',
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.8rem, 6vw, 2.5rem)',
                  fontWeight: 300,
                  letterSpacing: '-0.02em',
                  color: pathname === link.href ? C.gold : C.cream,
                  textDecoration: 'none',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid rgba(245,240,230,0.08)',
                }}>
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              <Link href="/shop" style={{
                display: 'inline-block', padding: '14px 40px',
                background: C.gold, color: C.forest,
                fontFamily: 'var(--font-sans)', fontSize: '11px',
                letterSpacing: '0.28em', textTransform: 'uppercase' as const,
                textDecoration: 'none', fontWeight: 600,
              }}>
                Shop Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

