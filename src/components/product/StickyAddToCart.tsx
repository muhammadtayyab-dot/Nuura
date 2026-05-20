'use client'

import { useEffect, useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { Product } from '@/types'
import Image from 'next/image'

export default function StickyAddToCart({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const [visible, setVisible] = useState(false)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    function onScroll() { setVisible(window.scrollY > 500) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handle() {
    addItem(product)
    openCart()
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (!product.inStock) return null

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 60,
      backgroundColor: '#FAFAF8', borderTop: '1px solid #DDD8CF',
      padding: '0.875rem 1.5rem',
      transform: visible ? 'translateY(0)' : 'translateY(100%)',
      transition: 'transform 350ms ease',
      display: 'flex', alignItems: 'center', gap: '1rem',
    }}
      className="md:hidden"
    >
      {product.images[0] && (
        <div style={{ width: '44px', height: '44px', position: 'relative', flexShrink: 0, backgroundColor: '#F0EBE3', overflow: 'hidden' }}>
          <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: 'cover' }} sizes="44px" />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600, color: '#1B2E1F', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#D4A853', margin: 0 }}>PKR {product.price.toLocaleString()}</p>
      </div>
      <button
        onClick={handle}
        style={{ backgroundColor: added ? '#6B9E7A' : '#D4A853', color: added ? '#F5F0E6' : '#1B2E1F', border: 0, padding: '0.75rem 1.25rem', fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', flexShrink: 0, transition: 'all 300ms', whiteSpace: 'nowrap' }}
      >
        {added ? '✓ Added' : 'Add to Cart'}
      </button>
    </div>
  )
}
