'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const C = { forest: '#1B2E1F', cream: '#F5F0E6', gold: '#D4A853', muted: 'rgba(245,240,230,0.4)', border: 'rgba(245,240,230,0.08)' }

export default function Footer() {
  const [email, setEmail] = useState('')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <footer style={{ background: C.forest, padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,6vw,5rem) 0' }}>
      <div ref={ref} style={{ textAlign: 'center', paddingBottom: 'clamp(3rem,6vw,5rem)', borderBottom: `1px solid ${C.border}`, marginBottom: 'clamp(3rem,6vw,5rem)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, y: 40, letterSpacing: '0' }} 
          animate={isInView ? { opacity: 1, y: 0, letterSpacing: '0.5em' } : {}} 
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ 
            fontFamily: 'var(--font-accent)', 
            fontSize: 'clamp(3.5rem,10vw,9rem)', 
            color: C.cream, 
            textTransform: 'uppercase', 
            textIndent: '0.5em', // This properly centers text that has letter spacing
            lineHeight: 1,
            position: 'relative',
            display: 'inline-block'
          }}
        >
          NUURA
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={isInView ? { opacity: 1, scale: 1 } : {}} 
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(14px,2vw,18px)', color: C.gold, fontStyle: 'italic', marginTop: '1rem' }}
        >
          Glow in your own light
        </motion.div>
        
        <motion.div 
          initial={{ scaleX: 0 }} 
          animate={isInView ? { scaleX: 1 } : {}} 
          transition={{ duration: 1, delay: 0.8, ease: 'easeInOut' }}
          style={{ width: '40px', height: '1px', background: C.gold, margin: '1.5rem auto 0' }} 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '2.5rem', marginBottom: 'clamp(3rem,6vw,5rem)' }} className="md:grid-cols-4">
        {[
          { heading: 'Explore', links: [{ label: 'Shop All', href: '/shop' }, { label: 'Self-Care', href: '/shop?category=self-care' }, { label: 'Accessories', href: '/shop?category=accessories' }, { label: 'New Drops', href: '/shop?filter=new' }] },
          { heading: 'Help', links: [{ label: 'Track Order', href: '#' }, { label: 'Shipping Info', href: '#' }, { label: 'Returns', href: '#' }, { label: 'FAQ', href: '#' }] },
          { heading: 'Social', links: [{ label: 'Instagram', href: 'https://instagram.com' }, { label: 'TikTok', href: 'https://tiktok.com' }] },
          { heading: 'Stay Connected', links: [] },
        ].map((col, i) => (
          <div key={i}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '9px', letterSpacing: '0.4em', textTransform: 'uppercase', color: C.gold, marginBottom: '1.5rem' }}>{col.heading}</p>
            {col.links.map(link => (
              <Link key={link.label} href={link.href} data-cursor="hover"
                style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: '14px', color: C.muted, textDecoration: 'none', marginBottom: '0.75rem', transition: 'color 200ms' }}
                onMouseEnter={e => { e.currentTarget.style.color = C.cream }}
                onMouseLeave={e => { e.currentTarget.style.color = C.muted }}>
                {link.label}
              </Link>
            ))}
            {i === 3 && (
              <div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: C.muted, marginBottom: '1rem', lineHeight: 1.6 }}>New drops, routines, and glow tips.</p>
                <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid rgba(245,240,230,0.2)' }}>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                    style={{ flex: 1, background: 'transparent', border: 'none', color: C.cream, fontFamily: 'var(--font-sans)', fontSize: '13px', padding: '10px 0', outline: 'none' }} />
                  <button style={{ background: 'transparent', border: 'none', color: C.gold, fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer' }}>Join</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ borderTop: `1px solid ${C.border}`, padding: '1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: C.muted }}>© 2025 Nuura. All rights reserved.</p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: C.muted }}>Crafted with intention in Pakistan</p>
      </div>
    </footer>
  )
}
