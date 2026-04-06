import { Suspense } from 'react'
import ShopClient from '@/components/shop/ShopClient'
import { MOCK_PRODUCTS } from '@/lib/mockData'

export const metadata = {
  title: 'Shop — Nuura',
  description: 'Browse all Nuura self-care gadgets and aesthetic accessories.',
}

export default function ShopPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF8F4' }}>
      {/* Animated page header */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#FAF8F4',
        paddingTop: 'clamp(6rem,12vw,9rem)',
        paddingBottom: 'clamp(2rem,4vw,3rem)',
        paddingLeft: 'clamp(1.5rem,6vw,5rem)',
        paddingRight: 'clamp(1.5rem,6vw,5rem)',
        borderBottom: '1px solid #E8E0D8',
      }}>
        {/* Ghost S */}
        <div style={{
          position: 'absolute', right: '-0.04em', top: '50%',
          transform: 'translateY(-50%)',
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(200px,28vw,420px)',
          fontWeight: 300, lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: '1px #E8E0D8',
          userSelect: 'none', pointerEvents: 'none', zIndex: 0,
        }}>S</div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1400px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <span style={{ display: 'block', width: '24px', height: '1px', background: '#C4614A' }} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#8C8078' }}>
              The Edit
            </span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 300,
            fontSize: 'clamp(3rem,8vw,7rem)', color: '#1A1714',
            margin: '0', letterSpacing: '-0.03em', lineHeight: 0.9,
          }}>
            All Products
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#8C8078', marginTop: '1rem' }}>
            (6 pieces)
          </p>
        </div>
      </div>

      {/* Client component for filters + grid */}
      <Suspense fallback={
        <div style={{ padding: 'clamp(1.5rem,6vw,5rem)', fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#8C8078' }}>
          Loading products...
        </div>
      }>
        <ShopClient initialProducts={MOCK_PRODUCTS as any} />
      </Suspense>
    </div>
  )
}
