'use client'

import Link from 'next/link'
import { Truck, Check, RefreshCw } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { Product } from '@/types'

interface ProductInfoProps {
  product: Product
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  const discount =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
      : null

  function handleAddToCart() {
    addItem(product)
    openCart()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', color: '#1A1714' }}>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8C8078' }}>
        <Link href='/shop' style={{ color: '#8C8078', textDecoration: 'none' }}>Shop</Link>
        {' / '}
        <Link href={`/shop?category=${product.category}`} style={{ color: '#8C8078', textDecoration: 'none' }}>
          {product.category}
        </Link>
        {' / '}
        <span style={{ color: '#8C8078' }}>{product.name}</span>
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
        {product.isNewDrop && (
          <span
            style={{
              backgroundColor: '#C4614A',
              color: '#FFFFFF',
              fontFamily: 'var(--font-sans)',
              fontSize: '9px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              padding: '0.375rem 0.75rem',
              borderRadius: 0,
            }}
          >
            New Drop
          </span>
        )}
        {product.isBestSeller && (
          <span
            style={{
              border: '1px solid #C4614A',
              color: '#C4614A',
              backgroundColor: 'transparent',
              fontFamily: 'var(--font-sans)',
              fontSize: '9px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              padding: '0.375rem 0.75rem',
              borderRadius: 0,
            }}
          >
            Best Seller
          </span>
        )}
      </div>

      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 300, color: '#1A1714', lineHeight: 1.05, marginTop: '1rem' }}>
        {product.name}
      </h1>

      <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '16px', color: '#8C8078', marginTop: '0.5rem' }}>{product.tagline}</p>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: '#C4614A' }}>PKR {product.price.toLocaleString()}</span>
        {product.comparePrice && (
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: '#8C8078', textDecoration: 'line-through' }}>PKR {product.comparePrice.toLocaleString()}</span>
        )}
        {discount && <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: '#8C8078' }}>-{discount}%</span>}
      </div>

      <div style={{ borderTop: '1px solid #E8E0D8', margin: '1.5rem 0' }} />

      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: '#8C8078', lineHeight: 1.75 }}>{product.description}</p>

      {product.tags.length > 0 && (
        <div style={{ marginTop: '0.75rem' }}>
          {product.tags.map((tag) => (
            <span
              key={tag}
              style={{
                display: 'inline-block',
                border: '1px solid #E8E0D8',
                color: '#8C8078',
                fontFamily: 'var(--font-sans)',
                fontSize: '9px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                padding: '0.375rem 0.75rem',
                marginRight: '0.5rem',
                marginTop: '0.5rem',
                borderRadius: 0,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div style={{ borderTop: '1px solid #E8E0D8', margin: '1.5rem 0' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {product.inStock ? (
          product.stockCount > 10 ? (
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6B9E7A' }}>In Stock</span>
          ) : (
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C4614A' }}>Only {product.stockCount} left</span>
          )
        ) : (
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8C8078' }}>Out of stock</span>
        )}
      </div>

      <button
        onClick={handleAddToCart}
        disabled={!product.inStock}
        style={{
          marginTop: '1.5rem',
          width: '100%',
          padding: '1.25rem',
          fontFamily: 'var(--font-sans)',
          fontSize: '11px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          borderRadius: 0,
          border: 0,
          transition: 'background-color 300ms ease',
          cursor: product.inStock ? 'pointer' : 'not-allowed',
          backgroundColor: product.inStock ? '#1A1714' : '#E8E0D8',
          color: product.inStock ? '#FAF8F4' : '#8C8078',
        }}
        onMouseEnter={(e) => {
          if (product.inStock) e.currentTarget.style.backgroundColor = '#C4614A'
        }}
        onMouseLeave={(e) => {
          if (product.inStock) e.currentTarget.style.backgroundColor = '#1A1714'
        }}
      >
        {product.inStock ? 'Add to Cart' : 'Sold Out'}
      </button>

      <button
        type='button'
        style={{
          marginTop: '0.75rem',
          background: 'transparent',
          border: 0,
          fontFamily: 'var(--font-sans)',
          fontSize: '11px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#8C8078',
          textAlign: 'center',
          textDecoration: 'underline',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#1A1714'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#8C8078'
        }}
      >
        Add to Wishlist
      </button>

      <div style={{ backgroundColor: '#F2EDE4', padding: '1.25rem', marginTop: '2rem', borderLeft: '3px solid #C4614A', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {[
          { icon: Truck, text: 'Free shipping on orders over PKR 5,000' },
          { icon: Check, text: 'Cash on Delivery available nationwide' },
          { icon: RefreshCw, text: 'Easy 7-day returns' },
        ].map((line) => (
          <div key={line.text} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <line.icon size={14} strokeWidth={1.5} style={{ color: '#8C8078', flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#8C8078' }}>{line.text}</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        a:hover {
          color: #c4614a !important;
        }
      `}</style>
    </div>
  )
}
