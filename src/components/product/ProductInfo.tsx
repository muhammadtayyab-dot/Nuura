'use client'

import Link from 'next/link'
import { Truck } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { Product } from '@/types'
import { MagneticButton } from '@/components/shared/MagneticButton'
import { AnimatedSection } from '@/components/shared/AnimatedSection'

interface ProductInfoProps {
  product: Product
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  const discount = product.comparePrice && product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null

  const handleAddToCart = () => { addItem(product); openCart() }

  return (
    <div className="flex flex-col">
      <AnimatedSection>
        <p className="font-sans text-[10px] tracking-wider text-[--color-nuura-muted]">
          <Link href="/shop" className="hover:text-[--color-nuura-charcoal] transition-colors">Shop</Link>
          {' / '}
          <Link href={`/shop?category=${product.category}`} className="hover:text-[--color-nuura-charcoal] transition-colors capitalize">{product.category}</Link>
          {' / '}
          <span className="text-[--color-nuura-charcoal]">{product.name}</span>
        </p>
      </AnimatedSection>

      <div className="flex gap-2 mt-4">
        {product.isNewDrop && <span className="bg-[--color-nuura-charcoal] text-white font-sans text-[9px] tracking-widest uppercase px-3 py-1.5">New Drop</span>}
        {product.isBestSeller && <span className="bg-[--color-nuura-blush] text-[--color-nuura-charcoal] font-sans text-[9px] tracking-widest uppercase px-3 py-1.5">Best Seller</span>}
      </div>

      <h1 className="font-display font-light text-[--color-nuura-charcoal] leading-tight mt-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
        {product.name}
      </h1>

      <p className="font-sans text-sm text-[--color-nuura-muted] italic mt-2">{product.tagline}</p>

      <div className="flex items-baseline gap-3 mt-6">
        <span className="font-display text-3xl text-[--color-nuura-charcoal]">PKR {product.price.toLocaleString()}</span>
        {product.comparePrice && <span className="font-sans text-sm text-[--color-nuura-muted] line-through">PKR {product.comparePrice.toLocaleString()}</span>}
        {discount && <span className="font-sans text-xs text-[--color-nuura-sage]">-{discount}%</span>}
      </div>

      <div className="border-t border-[--color-nuura-nude]/40 my-6" />

      <AnimatedSection delay={0.1}>
        <p className="font-sans text-sm text-[--color-nuura-muted] leading-relaxed">{product.description}</p>
      </AnimatedSection>

      {product.tags.length > 0 && (
        <AnimatedSection delay={0.15}>
          <div className="flex flex-wrap gap-2 mt-4">
            {product.tags.map((tag) => (
              <span key={tag} className="border border-[--color-nuura-nude] text-[--color-nuura-muted] font-sans text-[9px] tracking-wider uppercase px-3 py-1">{tag}</span>
            ))}
          </div>
        </AnimatedSection>
      )}

      <div className="border-t border-[--color-nuura-nude]/40 my-6" />

      <AnimatedSection delay={0.2}>
        <div className="flex items-center gap-2">
          {product.inStock ? (
            product.stockCount > 10 ? (
              <><span className="w-1.5 h-1.5 rounded-full bg-[--color-nuura-sage]" /><span className="font-sans text-xs tracking-wider uppercase text-[--color-nuura-sage]">In Stock</span></>
            ) : (
              <><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /><span className="font-sans text-xs tracking-wider uppercase text-amber-600">Only {product.stockCount} left</span></>
            )
          ) : (
            <span className="font-sans text-xs tracking-wider uppercase text-[--color-nuura-muted]">Sold Out</span>
          )}
        </div>
      </AnimatedSection>

      <div className="mt-6">
        <MagneticButton onClick={handleAddToCart}>
          <button
            disabled={!product.inStock}
            className={product.inStock ? 'w-full py-5 font-sans text-xs tracking-widest uppercase bg-[--color-nuura-charcoal] text-[--color-nuura-warm-white] hover:bg-[--color-nuura-muted] transition-colors duration-300' : 'w-full py-5 font-sans text-xs tracking-widest uppercase bg-[--color-nuura-nude] text-[--color-nuura-muted] cursor-not-allowed'}
          >
            {product.inStock ? 'Add to Cart' : 'Sold Out'}
          </button>
        </MagneticButton>
      </div>

      <div className="mt-3 text-center">
        <button className="font-sans text-xs text-[--color-nuura-muted] tracking-wider uppercase hover:text-[--color-nuura-charcoal] transition-colors duration-200">Add to Wishlist</button>
      </div>

      <AnimatedSection delay={0.3}>
        <div className="mt-8 bg-[--color-nuura-cream] p-5 flex flex-col gap-3">
          {['Free shipping on orders over PKR 5,000','Cash on Delivery available nationwide','Easy 7-day returns'].map((line) => (
            <div key={line} className="flex items-center gap-3">
              <Truck size={13} strokeWidth={1.5} className="text-[--color-nuura-muted] flex-shrink-0" />
              <span className="font-sans text-xs text-[--color-nuura-muted]">{line}</span>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </div>
  )
}
