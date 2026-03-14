import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types'
import { formatPKR } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  const hasDiscount = typeof product.comparePrice === 'number' && product.comparePrice > product.price
  const discount = hasDiscount ? Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100) : null

  return (
    <Link href={`/product/${product.slug}`} data-cursor='hover' style={{ textDecoration: 'none', display: 'block', backgroundColor: '#FAF8F4' }}>
      <article className='group' style={{ backgroundColor: '#FAF8F4' }}>
        <div style={{ position: 'relative', aspectRatio: '3 / 4', overflow: 'hidden', backgroundColor: '#F2EDE4' }}>
          <Image
            src={product.images?.[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            style={{ objectFit: 'cover', transition: 'transform 600ms ease' }}
            className='group-hover:scale-[1.06]'
            sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'
          />

          <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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

          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              addItem(product)
              openCart()
            }}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              transform: 'translateY(100%)',
              opacity: 0,
              transition: 'all 350ms ease',
              backgroundColor: 'rgba(250,248,244,0.95)',
              backdropFilter: 'blur(8px)',
              borderTop: '1px solid #E8E0D8',
              borderLeft: 0,
              borderRight: 0,
              borderBottom: 0,
              fontFamily: 'var(--font-sans)',
              fontSize: '10px',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#1A1714',
              padding: '0.75rem',
              textAlign: 'center',
              width: '100%',
              borderRadius: 0,
              zIndex: 15,
            }}
            className='group-hover:translate-y-0 group-hover:opacity-100'
          >
            Quick Add
          </button>
        </div>

        <div style={{ paddingTop: '1rem', paddingBottom: '0.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: '#1A1714', lineHeight: 1.15 }}>{product.name}</h3>
          {product.tagline && (
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#8C8078', marginTop: '0.25rem' }}>
              {product.tagline}
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.75rem' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#C4614A' }}>{formatPKR(product.price)}</span>
            {hasDiscount && (
              <>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#8C8078', textDecoration: 'line-through' }}>
                  {formatPKR(product.comparePrice!)}
                </span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '9px', color: '#8C8078' }}>-{discount}%</span>
              </>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
