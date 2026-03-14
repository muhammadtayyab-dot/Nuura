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
    <div style={{ backgroundColor: '#FAF8F4' }}>
      <div style={{ position: 'relative', aspectRatio: '3 / 4', overflow: 'hidden', backgroundColor: '#F2EDE4' }}>
        <AnimatePresence mode='wait'>
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={{ position: 'absolute', inset: 0 }}
          >
            {hasImages ? (
              <Image
                src={images[selectedIndex]}
                alt={name}
                fill
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                sizes='(max-width: 768px) 100vw, 55vw'
                priority={selectedIndex === 0}
              />
            ) : (
              <div style={{ position: 'absolute', inset: 0, backgroundColor: '#F2EDE4' }} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {hasImages && images.length > 1 && (
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              style={{
                position: 'relative',
                width: '72px',
                height: '72px',
                overflow: 'hidden',
                flexShrink: 0,
                backgroundColor: '#F2EDE4',
                border: 0,
                outline: i === selectedIndex ? '1px solid #C4614A' : '1px solid transparent',
                outlineOffset: i === selectedIndex ? '2px' : '0px',
                opacity: i === selectedIndex ? 1 : 0.75,
                transition: 'opacity 200ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = i === selectedIndex ? '1' : '0.75'
              }}
            >
              <Image src={src} alt={name} fill style={{ objectFit: 'cover' }} sizes='72px' />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
