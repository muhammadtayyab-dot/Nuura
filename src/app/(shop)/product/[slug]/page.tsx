import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductImages from '@/components/product/ProductImages'
import ProductInfo from '@/components/product/ProductInfo'
import ProductTabs from '@/components/product/ProductTabs'
import ReviewsSection from '@/components/product/ReviewsSection'
import RelatedProducts from '@/components/product/RelatedProducts'
import StickyAddToCart from '@/components/product/StickyAddToCart'
import { Product } from '@/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Inline mock data — guaranteed fallback even if DB and API both fail
const MOCK_PRODUCTS: Product[] = [
  {
    _id: '1', slug: 'rose-quartz-gua-sha',
    name: 'Rose Quartz Gua Sha', tagline: 'Sculpt. Depuff. Glow.',
    description: 'Authentic rose quartz gua sha stone for facial lifting and lymphatic drainage. Cool to the touch, smooth on the skin. Use daily to reduce puffiness and define your jawline.',
    price: 2800, comparePrice: 3500,
    images: ['https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80'],
    category: 'self-care', tags: ['gua-sha', 'rose-quartz', 'facial'],
    inStock: true, stockCount: 45,
    isFeatured: true, isNewDrop: true, isBestSeller: false,
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    _id: '2', slug: 'led-glow-mirror',
    name: 'LED Glow Mirror', tagline: 'Studio lighting, anywhere.',
    description: 'Compact LED vanity mirror with adjustable brightness and 10x magnification. USB rechargeable, perfect for flawless makeup on the go.',
    price: 4500, comparePrice: 5500,
    images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80'],
    category: 'self-care', tags: ['mirror', 'led', 'makeup'],
    inStock: true, stockCount: 23,
    isFeatured: true, isNewDrop: false, isBestSeller: true,
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    _id: '3', slug: 'mini-chain-crossbody',
    name: 'Mini Chain Crossbody', tagline: 'Small bag. Big statement.',
    description: 'Quilted mini crossbody bag with gold chain strap. Fits your phone, cards, and lip gloss. Goes from brunch to dinner without missing a beat.',
    price: 3200,
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80'],
    category: 'accessories', tags: ['bag', 'crossbody', 'chain'],
    inStock: true, stockCount: 18,
    isFeatured: true, isNewDrop: true, isBestSeller: false,
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    _id: '4', slug: 'jade-face-roller',
    name: 'Jade Face Roller', tagline: 'Roll away the stress.',
    description: 'Dual-ended jade roller for facial massage and serum absorption. The larger end works on cheeks and forehead; the smaller end targets under-eyes.',
    price: 1800, comparePrice: 2200,
    images: ['https://images.unsplash.com/photo-1591994843349-f415893b3a6b?w=600&q=80'],
    category: 'self-care', tags: ['jade', 'roller', 'facial'],
    inStock: true, stockCount: 60,
    isFeatured: false, isNewDrop: false, isBestSeller: true,
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    _id: '5', slug: 'acrylic-clutch',
    name: 'Acrylic Box Clutch', tagline: 'Art you carry.',
    description: 'Clear acrylic clutch with gold hardware. A statement piece that turns heads. Spacious enough for your evening essentials.',
    price: 2500,
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80'],
    category: 'accessories', tags: ['clutch', 'acrylic', 'transparent'],
    inStock: true, stockCount: 12,
    isFeatured: false, isNewDrop: true, isBestSeller: false,
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    _id: '6', slug: 'facial-steamer',
    name: 'USB Facial Steamer', tagline: 'Open up. Breathe in. Glow.',
    description: 'Nano ionic facial steamer for deep pore cleansing and intense hydration. Use before your skincare routine to maximise absorption. Portable USB-powered design.',
    price: 3800, comparePrice: 4500,
    images: ['https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80'],
    category: 'self-care', tags: ['steamer', 'facial', 'pores'],
    inStock: true, stockCount: 35,
    isFeatured: false, isNewDrop: false, isBestSeller: false,
    createdAt: new Date(), updatedAt: new Date(),
  },
]

async function getProduct(slug: string): Promise<Product | null> {
  // First try: API route
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'http://localhost:3000'
    const res = await fetch(`${base}/api/products/${slug}`, {
      next: { revalidate: 60 },
    })
    if (res.ok) {
      const data = await res.json()
      const product = data.product ?? data
      if (product && product.slug) return product as Product
    }
  } catch {
    // fall through to mock
  }

  // Second try: inline mock data (always works)
  const mock = MOCK_PRODUCTS.find((p) => p.slug === slug)
  return mock ?? null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: 'Product — Nuura' }

  const seo = product.seo ?? {}
  const title = (seo.title ?? '').trim() || `${product.name} — Nuura`
  const description =
    (seo.description ?? '').trim() || product.tagline || product.description

  const ogTitle = (seo.ogTitle ?? '').trim() || title
  const ogDescription = (seo.ogDescription ?? '').trim() || description
  const ogImage = (seo.ogImage ?? '').trim()
  const images = ogImage
    ? [{ url: ogImage }]
    : product.images[0]
      ? [{ url: product.images[0] }]
      : []

  return {
    title,
    description,
    keywords: seo.keywords,
    alternates: seo.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
    robots:
      seo.noIndex || seo.noFollow
        ? { index: !seo.noIndex, follow: !seo.noFollow }
        : undefined,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      images,
    },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  // fetch related products (same category, exclude self)
  let relatedProducts: Product[] = []
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'http://localhost:3000'
    const res = await fetch(`${base}/api/products?category=${product.category}&limit=8`, { next: { revalidate: 60 } })
    if (res.ok) {
      const data = await res.json()
      relatedProducts = (data.products ?? []).filter((p: Product) => p.slug !== product.slug).slice(0, 4)
    }
  } catch {}

  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'http://localhost:3000'
  const productUrl = `${base}/product/${product.slug}`
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product._id,
    url: productUrl,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PKR',
      price: String(product.price ?? 0),
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: base },
      { '@type': 'ListItem', position: 2, name: product.category || 'Product', item: `${base}/shop` },
      { '@type': 'ListItem', position: 3, name: product.name, item: productUrl },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main style={{ minHeight: '100vh', backgroundColor: '#F5F0E6' }}>

        {/* ── HERO SECTION — images + info ── */}
        <div style={{ background: 'linear-gradient(180deg, #1B2E1F 0%, #233A27 60%, #F5F0E6 100%)', paddingTop: '7rem', paddingBottom: '5rem' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
            {/* Breadcrumb */}
            <nav style={{ marginBottom: '2.5rem' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,240,230,0.5)' }}>
                <a href="/shop" style={{ color: 'rgba(245,240,230,0.5)', textDecoration: 'none' }}>Shop</a>
                {' / '}
                <a href={`/shop?category=${product.category}`} style={{ color: 'rgba(245,240,230,0.5)', textDecoration: 'none' }}>{product.category}</a>
                {' / '}
                {product.name}
              </span>
            </nav>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>
              <ProductImages images={product.images} name={product.name} />
              <div style={{ position: 'sticky', top: '6rem' }}>
                <ProductInfo product={product} />
              </div>
            </div>
          </div>
        </div>

        {/* ── TRUST BAR ── */}
        <div style={{ backgroundColor: '#1B2E1F', padding: '1rem 0' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(1.5rem, 5vw, 4rem)', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center', alignItems: 'center' }}>
            {[
              { icon: '🚚', text: 'Free Shipping over PKR 5,000' },
              { icon: '📦', text: 'Cash on Delivery' },
              { icon: '↩️', text: '7-Day Easy Returns' },
              { icon: '✅', text: '100% Authentic Products' },
              { icon: '🔒', text: 'Secure Checkout' },
            ].map((item) => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '14px' }}>{item.icon}</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'rgba(245,240,230,0.7)', letterSpacing: '0.1em' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── TABS: Details / Ingredients / How to Use / Shipping ── */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '4rem clamp(1.5rem, 5vw, 4rem)' }}>
          <ProductTabs product={product} />
        </div>

        {/* ── REVIEWS ── */}
        <div style={{ backgroundColor: '#F0EBE3', padding: '4rem 0' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
            <ReviewsSection productSlug={product.slug} productName={product.name} />
          </div>
        </div>

        {/* ── RELATED PRODUCTS ── */}
        {relatedProducts.length > 0 && (
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '4rem clamp(1.5rem, 5vw, 4rem)' }}>
            <RelatedProducts products={relatedProducts} />
          </div>
        )}
      </main>

      {/* ── STICKY ADD TO CART (mobile) ── */}
      <StickyAddToCart product={product} />
    </>
  )
}
