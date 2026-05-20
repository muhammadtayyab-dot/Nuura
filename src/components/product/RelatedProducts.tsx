'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'

export default function RelatedProducts({ products }: { products: Product[] }) {
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300, color: '#1B2E1F', margin: 0 }}>You May Also Like</h2>
        <Link href="/shop" style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1B2E1F', textDecoration: 'none', borderBottom: '1px solid #D4A853', paddingBottom: '2px' }}>
          View All →
        </Link>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
        {products.map((product) => (
          <RelatedCard key={product._id} product={product} onAddToCart={() => { addItem(product); openCart() }} />
        ))}
      </div>
    </div>
  )
}

function RelatedCard({ product, onAddToCart }: { product: Product; onAddToCart: () => void }) {
  const [hov, setHov] = useState(false)
  const discount = product.comparePrice && product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ transition: 'transform 400ms ease', transform: hov ? 'translateY(-6px)' : 'translateY(0)' }}
    >
      <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{ position: 'relative', aspectRatio: '3/4', backgroundColor: '#0F1A11', overflow: 'hidden', marginBottom: '0.875rem' }}>
          {product.images[0] && (
            <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 768px) 50vw, 25vw"
              style={{ objectFit: 'cover', transform: hov ? 'scale(1.06)' : 'scale(1)', transition: 'transform 600ms ease' }} />
          )}
          {discount && (
            <span style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#D4A853', color: '#1B2E1F', fontFamily: 'var(--font-sans)', fontSize: '9px', fontWeight: 700, padding: '3px 8px' }}>-{discount}%</span>
          )}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAddToCart() }}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(27,46,31,0.92)', backdropFilter: 'blur(4px)', padding: '12px', fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#D4A853', border: 0, cursor: 'pointer', transform: hov ? 'translateY(0)' : 'translateY(100%)', transition: 'transform 300ms ease' }}
          >
            Quick Add +
          </button>
        </div>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: '#1B2E1F', margin: '0 0 3px' }}>{product.name}</p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: '#8A8A8A', margin: '0 0 0.5rem' }}>{product.tagline}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: '#D4A853', fontWeight: 500 }}>PKR {product.price.toLocaleString()}</span>
          {product.comparePrice && (
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#A0A0A0', textDecoration: 'line-through' }}>PKR {product.comparePrice.toLocaleString()}</span>
          )}
        </div>
      </Link>
    </div>
  )
}
