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
    const list = activeCategory
      ? initialProducts.filter((p) => p.category === activeCategory)
      : [...initialProducts]

    if (activeSort === 'price-asc') list.sort((a, b) => a.price - b.price)
    else if (activeSort === 'price-desc') list.sort((a, b) => b.price - a.price)
    else if (activeSort === 'newest') list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    else list.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured))

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

      <section style={{ backgroundColor: '#FAF8F4' }}>
        <div style={{ padding: '4rem clamp(1.5rem, 6vw, 5rem)' }}>
          {filtered.length === 0 ? (
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#8C8078', textAlign: 'center', padding: '6rem 0' }}>
              No products found.
            </p>
          ) : (
            <motion.div
              className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
              initial='hidden'
              animate='visible'
              variants={{
                visible: { transition: { staggerChildren: 0.06 } },
                hidden: {},
              }}
            >
              {filtered.map((product) => (
                <motion.div
                  key={product.slug}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </>
  )
}
