'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface ProductImagesProps {
  images: string[]
  name: string
}

export default function ProductImages({ images, name }: ProductImagesProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const hasImages = images.length > 0

  return (
    <div>
      <div className="relative aspect-[3/4] rounded-sm overflow-hidden bg-[--color-nuura-nude]">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
          >
            {hasImages ? (
              <Image
                src={images[selectedIndex]}
                alt={name}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 55vw"
                priority={selectedIndex === 0}
              />
            ) : (
              <div className="absolute inset-0 brand-gradient" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {hasImages && images.length > 1 && (
        <div className="flex gap-3 mt-4">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={[
                'relative w-20 h-20 rounded-sm overflow-hidden flex-shrink-0 transition-all duration-200',
                i === selectedIndex
                  ? 'ring-1 ring-[--color-nuura-charcoal] ring-offset-2'
                  : 'opacity-60 hover:opacity-100',
              ].join(' ')}
            >
              <Image src={src} alt={name} fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
