'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Truck, Check, RefreshCw, Heart, Share2, Star, ShieldCheck } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { Product } from '@/types'

// Hardcoded average ratings per product slug — add more as needed
const RATINGS: Record<string, { avg: number; count: number }> = {
  'rose-quartz-gua-sha': { avg: 4.8, count: 124 },
  'led-glow-mirror': { avg: 4.6, count: 89 },
  'jade-face-roller': { avg: 4.9, count: 203 },
  'facial-steamer': { avg: 4.5, count: 67 },
  'mini-chain-crossbody': { avg: 4.7, count: 45 },
  'acrylic-clutch': { avg: 4.4, count: 32 },
}
const DEFAULT_RATING = { avg: 4.7, count: 58 }

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          strokeWidth={1}
          style={{
            fill: star <= Math.round(rating) ? '#D4A853' : 'transparent',
            color: star <= Math.round(rating) ? '#D4A853' : 'rgba(245,240,230,0.3)',
          }}
        />
      ))}
    </div>
  )
}

export default function ProductInfo({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const [qty, setQty] = useState(1)
  const [wished, setWished] = useState(false)
  const [added, setAdded] = useState(false)
  const [copied, setCopied] = useState(false)

  const { avg, count } = RATINGS[product.slug] ?? DEFAULT_RATING
  const discount = product.comparePrice && product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null

  function handleAddToCart() {
    for (let i = 0; i < qty; i++) addItem(product)
    openCart()
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  function handleWishlist() {
    setWished((w) => !w)
    try {
      const existing = JSON.parse(localStorage.getItem('nuura-wishlist') ?? '[]') as string[]
      const updated = wished
        ? existing.filter((s) => s !== product.slug)
        : [...existing, product.slug]
      localStorage.setItem('nuura-wishlist', JSON.stringify(updated))
    } catch { /* ignore */ }
  }

  function handleShare() {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({ title: product.name, url })
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  const isLowStock = product.inStock && product.stockCount <= (product.lowStockThreshold ?? 10)

  return (
    <div style={{ color: '#F5F0E6', display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* Badges */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {product.isNewDrop && (
          <span style={{ backgroundColor: '#D4A853', color: '#1B2E1F', fontFamily: 'var(--font-sans)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '4px 12px' }}>New Drop</span>
        )}
        {product.isBestSeller && (
          <span style={{ border: '1px solid #D4A853', color: '#D4A853', fontFamily: 'var(--font-sans)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '4px 12px' }}>Best Seller</span>
        )}
        {product.isFeatured && (
          <span style={{ border: '1px solid rgba(245,240,230,0.3)', color: 'rgba(245,240,230,0.7)', fontFamily: 'var(--font-sans)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '4px 12px' }}>Featured</span>
        )}
      </div>

      {/* Name */}
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, lineHeight: 1.05, color: '#F5F0E6', margin: '0 0 0.5rem' }}>
        {product.name}
      </h1>

      {/* Tagline */}
      <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '15px', color: 'rgba(245,240,230,0.55)', margin: '0 0 1rem' }}>
        {product.tagline}
      </p>

      {/* Stars + review count */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
        <StarRating rating={avg} />
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#D4A853' }}>{avg.toFixed(1)}</span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'rgba(245,240,230,0.4)' }}>({count} reviews)</span>
      </div>

      {/* Price */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: '#D4A853' }}>PKR {product.price.toLocaleString()}</span>
        {product.comparePrice && (
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'rgba(245,240,230,0.35)', textDecoration: 'line-through' }}>PKR {product.comparePrice.toLocaleString()}</span>
        )}
        {discount && (
          <span style={{ backgroundColor: '#D4A853', color: '#1B2E1F', fontFamily: 'var(--font-sans)', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '2px' }}>SAVE {discount}%</span>
        )}
      </div>

      <div style={{ borderTop: '1px solid rgba(245,240,230,0.1)', marginBottom: '1.5rem' }} />

      {/* Short description */}
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'rgba(245,240,230,0.72)', lineHeight: 1.8, marginBottom: '1.25rem' }}>
        {product.description}
      </p>

      {/* Tags */}
      {product.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
          {product.tags.map((tag) => (
            <span key={tag} style={{ border: '1px solid rgba(245,240,230,0.15)', color: 'rgba(245,240,230,0.5)', fontFamily: 'var(--font-sans)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '4px 10px' }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Stock status */}
      <div style={{ marginBottom: '1.25rem' }}>
        {product.inStock ? (
          isLowStock ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#E8A020', display: 'inline-block' }} />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#E8A020' }}>
                Only {product.stockCount} left — order soon
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#6B9E7A', display: 'inline-block' }} />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6B9E7A' }}>In Stock</span>
            </div>
          )
        ) : (
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(245,240,230,0.35)' }}>Out of Stock</span>
        )}
      </div>

      {/* Quantity selector */}
      {product.inStock && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,240,230,0.5)' }}>Quantity</span>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(245,240,230,0.2)' }}>
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ width: '38px', height: '38px', background: 'transparent', border: 0, color: '#F5F0E6', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#F5F0E6', minWidth: '32px', textAlign: 'center' }}>{qty}</span>
            <button onClick={() => setQty((q) => Math.min(product.stockCount, q + 1))} style={{ width: '38px', height: '38px', background: 'transparent', border: 0, color: '#F5F0E6', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
          </div>
        </div>
      )}

      {/* Add to cart + Wishlist row */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          style={{
            flex: 1, padding: '1.1rem', fontFamily: 'var(--font-sans)', fontSize: '11px',
            letterSpacing: '0.25em', textTransform: 'uppercase', border: 0, cursor: product.inStock ? 'pointer' : 'not-allowed',
            backgroundColor: added ? '#6B9E7A' : product.inStock ? '#D4A853' : 'rgba(245,240,230,0.1)',
            color: added ? '#F5F0E6' : product.inStock ? '#1B2E1F' : 'rgba(245,240,230,0.3)',
            transition: 'all 300ms ease',
          }}
        >
          {added ? '✓ Added to Cart' : product.inStock ? `Add to Cart — PKR ${(product.price * qty).toLocaleString()}` : 'Sold Out'}
        </button>
        <button
          onClick={handleWishlist}
          title={wished ? 'Remove from wishlist' : 'Save to wishlist'}
          style={{ width: '52px', border: '1px solid rgba(245,240,230,0.2)', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 200ms' }}
        >
          <Heart size={18} strokeWidth={1.5} style={{ color: wished ? '#D4A853' : 'rgba(245,240,230,0.5)', fill: wished ? '#D4A853' : 'transparent', transition: 'all 200ms' }} />
        </button>
        <button
          onClick={handleShare}
          title="Share this product"
          style={{ width: '52px', border: '1px solid rgba(245,240,230,0.2)', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Share2 size={16} strokeWidth={1.5} style={{ color: copied ? '#D4A853' : 'rgba(245,240,230,0.5)' }} />
        </button>
      </div>
      {copied && <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: '#D4A853', marginBottom: '0.5rem' }}>Link copied to clipboard!</p>}

      {/* Delivery info box */}
      <div style={{ backgroundColor: 'rgba(11,26,15,0.5)', padding: '1.25rem', borderLeft: '3px solid #D4A853', display: 'flex', flexDirection: 'column', gap: '0.7rem', marginBottom: '1.5rem' }}>
        {[
          { Icon: Truck, text: 'Free delivery on orders over PKR 5,000' },
          { Icon: Check, text: 'Cash on Delivery available nationwide' },
          { Icon: RefreshCw, text: '7-day hassle-free returns' },
          { Icon: ShieldCheck, text: '100% authentic, quality guaranteed' },
        ].map(({ Icon, text }) => (
          <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Icon size={13} strokeWidth={1.5} style={{ color: 'rgba(245,240,230,0.5)', flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'rgba(245,240,230,0.6)' }}>{text}</span>
          </div>
        ))}
      </div>

      {/* Estimated delivery */}
      <div style={{ backgroundColor: 'rgba(212,168,83,0.08)', border: '1px solid rgba(212,168,83,0.2)', padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <Truck size={14} strokeWidth={1.5} style={{ color: '#D4A853', flexShrink: 0 }} />
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'rgba(245,240,230,0.7)' }}>
          Order today — estimated delivery in <strong style={{ color: '#D4A853' }}>3–5 business days</strong>
        </span>
      </div>
    </div>
  )
}
