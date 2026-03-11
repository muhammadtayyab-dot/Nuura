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
    const res = await fetch(`${base}/api/products`, { next: { revalidate: 60 } })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) products = data
    }
  } catch {}

  return (
    <main className="min-h-screen bg-[--color-nuura-warm-white]">
      <header className="pt-36 pb-16 bg-[--color-nuura-cream] text-center">
        <p className="font-sans text-[9px] tracking-[0.25em] uppercase text-[--color-nuura-muted] mb-4">The Edit</p>
        <h1 className="font-display font-light text-[--color-nuura-charcoal] leading-none" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}>
          All Products
        </h1>
        <div className="w-12 h-px bg-[--color-nuura-muted]/40 mx-auto mt-6" />
        <p className="font-sans text-sm text-[--color-nuura-muted] mt-4">{products.length} pieces</p>
      </header>
      <ShopClient initialProducts={products as any} />
    </main>
  )
}
