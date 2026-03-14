import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductImages from '@/components/product/ProductImages'
import ProductInfo from '@/components/product/ProductInfo'
import { Product } from '@/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string): Promise<Product | null> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  try {
    const res = await fetch(base + '/api/products/' + slug, { next: { revalidate: 60 } })
    if (!res.ok) return null
    const data = await res.json()
    const product = data.product ?? data
    if (!product || !product.slug) return null
    return product as Product
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: 'Product - Nuura' }

  return {
    title: product.name + ' - Nuura',
    description: product.tagline,
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#FAF8F4', paddingTop: '6rem', paddingBottom: '6rem' }}>
      <div style={{ padding: '0 clamp(1.5rem, 6vw, 5rem)' }}>
        <div className='grid grid-cols-1 md:grid-cols-[55%_45%] gap-12 md:gap-16 items-start'>
          <ProductImages images={product.images} name={product.name} />
          <div style={{ position: 'sticky', top: '7rem' }}>
            <ProductInfo product={product} />
          </div>
        </div>
      </div>
    </main>
  )
}
