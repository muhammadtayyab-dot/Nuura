'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Product } from '@/types'
import FilterBar from '@/components/shop/FilterBar'
import ProductCard from '@/components/shop/ProductCard'

interface ShopClientProps {
  initialProducts: Product[]
}

export default function ShopClient({ initialProducts }: ShopClientProps) {
  const [activeCategory, setActiveCategory] = useState('')
  const [activeSort, setActiveSort] = useState('featured')

  const filtered = useMemo(() => {
    let list = activeCategory
      ? initialProducts.filter((p) => p.category === activeCategory)
      : [...initialProducts]

    if (activeSort === 'price-asc') list.sort((a, b) => a.price - b.price)
    else if (activeSort === 'price-desc') list.sort((a, b) => b.price - a.price)
    else if (activeSort === 'newest') list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    else list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))

    return list
  }, [initialProducts, activeCategory, activeSort])

  return (
    <>
      <FilterBar
        activeCategory={activeCategory}
        activeSort={activeSort}
        onCategoryChange={setActiveCategory}
        onSortChange={setActiveSort}
      />

      <section className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 py-16">
        {filtered.length === 0 ? (
          <p className="font-sans text-sm text-[--color-nuura-muted] text-center py-24">No products found.</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-14"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } }, hidden: {} }}
          >
            {filtered.map((product, i) => (
              <motion.div
                key={product.slug}
                variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } } }}
              >
                <ProductCard product={product} index={i} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </>
  )
}
