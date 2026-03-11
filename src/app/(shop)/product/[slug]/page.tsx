import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MOCK_PRODUCTS } from '@/lib/mockData'
import ProductImages from '@/components/product/ProductImages'
import ProductInfo from '@/components/product/ProductInfo'
import { Product } from '@/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug)
  if (!product) return { title: 'Product - Nuura' }
  return {
    title: `${product.name} - Nuura`,
    description: product.tagline,
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params

  let product: Product | undefined

  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
    const res = await fetch(`${base}/api/products/${slug}`, { next: { revalidate: 60 } })
    if (res.ok) {
      const data = await res.json()
      const p = data.product ?? data
      if (p && p.slug) product = p as Product
    }
  } catch {}

  if (!product) {
    product = MOCK_PRODUCTS.find((p) => p.slug === slug) as Product | undefined
  }

  if (!product) notFound()

  return (
    <main className="min-h-screen bg-[--color-nuura-warm-white] pt-24 pb-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-[55%_45%] gap-12 md:gap-16 items-start">
          <ProductImages images={product.images} name={product.name} />
          <div className="md:sticky md:top-28">
            <ProductInfo product={product} />
          </div>
        </div>
      </div>
    </main>
  )
}
