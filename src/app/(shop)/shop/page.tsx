import type { Metadata } from 'next'
import { MOCK_PRODUCTS } from '@/lib/mockData'
import ShopClient from '@/components/shop/ShopClient'

export const metadata: Metadata = {
  title: 'Shop - Nuura',
  description: 'Browse our curated collection of premium self-care and accessories.',
}

export default async function ShopPage() {
  let products = MOCK_PRODUCTS

  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
    const res = await fetch(base + '/api/products', { next: { revalidate: 60 } })
    if (res.ok) {
      const data = await res.json()
      const list = data.products ?? data
      if (Array.isArray(list)) products = list
    }
  } catch {
    products = MOCK_PRODUCTS
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#FAF8F4' }}>
      <header
        style={{
          backgroundColor: '#FAF8F4',
          paddingTop: '9rem',
          paddingBottom: '5rem',
          paddingLeft: 'clamp(1.5rem, 6vw, 5rem)',
          paddingRight: 'clamp(1.5rem, 6vw, 5rem)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <span
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(200px,25vw,400px)',
            color: 'transparent',
            WebkitTextStroke: '1px #E8E0D8',
            lineHeight: 0.8,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
          aria-hidden
        >
          S
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', position: 'relative', zIndex: 2 }}>
          <span style={{ width: '24px', height: '1px', backgroundColor: '#C4614A' }} />
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '10px',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: '#8C8078',
            }}
          >
            The Edit
          </p>
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem,8vw,7rem)', fontWeight: 300, color: '#1A1714', lineHeight: 1, position: 'relative', zIndex: 2 }}>
          All Products
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#8C8078', marginTop: '0.5rem', position: 'relative', zIndex: 2 }}>
          ({products.length} pieces)
        </p>
      </header>

      <ShopClient initialProducts={products as any} />
    </main>
  )
}
