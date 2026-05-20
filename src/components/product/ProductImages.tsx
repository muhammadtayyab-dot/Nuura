'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductImagesProps {
  images: string[]
  name: string
}

export default function ProductImages({ images, name }: ProductImagesProps) {
  const [selected, setSelected] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const imgRef = useRef<HTMLDivElement>(null)
  const hasImages = images.length > 0

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!imgRef.current) return
    const rect = imgRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPos({ x, y })
  }

  function prev() { setSelected((i) => (i === 0 ? images.length - 1 : i - 1)) }
  function next() { setSelected((i) => (i === images.length - 1 ? 0 : i + 1)) }

  return (
    <div>
      {/* Main image */}
      <div
        ref={imgRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        style={{
          position: 'relative',
          aspectRatio: '4/5',
          backgroundColor: '#0F1A11',
          overflow: 'hidden',
          borderRadius: '4px',
          cursor: zoomed ? 'crosshair' : 'default',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ position: 'absolute', inset: 0 }}
          >
            {hasImages && (
              <Image
                src={images[selected]}
                alt={`${name} — view ${selected + 1}`}
                fill
                priority={selected === 0}
                sizes="(max-width: 768px) 100vw, 55vw"
                style={{
                  objectFit: 'cover',
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: zoomed ? 'scale(1.6)' : 'scale(1)',
                  transition: zoomed ? 'transform 0.1s ease' : 'transform 0.4s ease',
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Zoom hint */}
        {!zoomed && hasImages && (
          <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', backgroundColor: 'rgba(11,26,15,0.7)', backdropFilter: 'blur(4px)', padding: '0.4rem 0.7rem', display: 'flex', alignItems: 'center', gap: '0.4rem', borderRadius: '2px' }}>
            <ZoomIn size={11} strokeWidth={1.5} color="rgba(245,240,230,0.7)" />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '9px', letterSpacing: '0.15em', color: 'rgba(245,240,230,0.7)', textTransform: 'uppercase' }}>Hover to zoom</span>
          </div>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: 'rgba(11,26,15,0.6)', padding: '0.3rem 0.6rem', borderRadius: '2px' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: 'rgba(245,240,230,0.8)' }}>{selected + 1} / {images.length}</span>
          </div>
        )}

        {/* Prev/Next arrows */}
        {images.length > 1 && (
          <>
            <button onClick={prev} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(11,26,15,0.6)', border: 0, color: '#F5F0E6', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '2px', backdropFilter: 'blur(4px)' }}>
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button onClick={next} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(11,26,15,0.6)', border: 0, color: '#F5F0E6', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '2px', backdropFilter: 'blur(4px)' }}>
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              style={{
                position: 'relative', width: '68px', height: '68px', flexShrink: 0,
                backgroundColor: '#0F1A11', border: 0, padding: 0, cursor: 'pointer',
                outline: i === selected ? '2px solid #D4A853' : '2px solid transparent',
                outlineOffset: '2px', opacity: i === selected ? 1 : 0.6,
                transition: 'all 200ms ease', borderRadius: '2px', overflow: 'hidden',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = i === selected ? '1' : '0.6' }}
            >
              <Image src={src} alt={`${name} thumbnail ${i + 1}`} fill style={{ objectFit: 'cover' }} sizes="68px" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
