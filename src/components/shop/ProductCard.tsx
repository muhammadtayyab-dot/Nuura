'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Product } from '@/types'
import { formatPKR } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'

const C = {
  forest: '#1B2E1F', cream: '#F5F0E6', gold: '#D4A853',
  ink: '#0F1A11', muted: '#6B7B6E',
}

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const [hov, setHov] = useState(false)

  const hasDiscount = typeof product.comparePrice === 'number' && product.comparePrice > product.price
  const discount = hasDiscount ? Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100) : null

  return (
    <Link href={`/product/${product.slug}`} data-cursor='hover' style={{ textDecoration: 'none', display: 'block' }}>
      <motion.div 
        onHoverStart={() => setHov(true)}
        onHoverEnd={() => setHov(false)} 
        animate={{ y: hov ? -10 : 0 }} 
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ display: 'block' }}
      >
        <div style={{ position: 'relative', aspectRatio: '3 / 4', backgroundColor: C.ink, overflow: 'hidden', marginBottom: '1.25rem' }}>
          <Image
            src={product.images?.[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            sizes='(max-width: 768px) 72vw, (max-width: 1200px) 33vw, 25vw'
            style={{ objectFit: 'cover', transition: 'transform 800ms ease', transform: hov ? 'scale(1.07)' : 'scale(1)' }}
          />

          <div style={{ position: 'absolute', inset: 0, background: hov ? 'rgba(11,26,15,0.15)' : 'transparent', transition: 'background 400ms' }} />

          <div style={{ position: 'absolute', top: '14px', left: '14px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {product.isNewDrop && (
              <span style={{ backgroundColor: C.forest, color: C.cream, fontFamily: 'var(--font-sans)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '5px 12px' }}>
                New Drop
              </span>
            )}
            {product.isBestSeller && (
              <span style={{ border: '1px solid ' + C.gold, color: C.gold, backgroundColor: 'transparent', fontFamily: 'var(--font-sans)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '5px 12px' }}>
                Best Seller
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              addItem(product)
              openCart()
            }}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'rgba(27,46,31,0.9)', backdropFilter: 'blur(4px)', padding: '14px',
              textAlign: 'center', transform: hov ? 'translateY(0)' : 'translateY(100%)',
              transition: 'transform 350ms ease', fontFamily: 'var(--font-sans)', fontSize: '10px',
              letterSpacing: '0.25em', textTransform: 'uppercase', color: C.gold, border: 0, zIndex: 15, cursor: 'pointer'
            }}
          >
            Quick Add +
          </button>
        </div>

        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: C.cream, margin: '0 0 4px', letterSpacing: '-0.01em' }}>{product.name}</p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'rgba(245,240,230,0.6)', margin: '0 0 10px' }}>{product.tagline}</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: C.gold, fontWeight: 500 }}>{formatPKR(product.price)}</span>
          {hasDiscount && (
            <>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'rgba(245,240,230,0.4)', textDecoration: 'line-through' }}>
                {formatPKR(product.comparePrice!)}
              </span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '9px', color: C.gold, padding: '2px 6px', border: '1px solid ' + C.gold, borderRadius: '4px' }}>-{discount}%</span>
            </>
          )}
        </div>
      </motion.div>
    </Link>
  )
}
