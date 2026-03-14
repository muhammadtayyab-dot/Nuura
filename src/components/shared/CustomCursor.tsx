'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'
import { useMousePosition } from '@/hooks/useMousePosition'

export function CustomCursor() {
  const { x, y } = useMousePosition()
  const [mounted, setMounted] = useState(false)
  const [cursorVariant, setCursorVariant] = useState<'default' | 'hover' | 'hidden'>('default')

  const dotX = useSpring(0, { stiffness: 600, damping: 35 })
  const dotY = useSpring(0, { stiffness: 600, damping: 35 })
  const ringX = useSpring(0, { stiffness: 120, damping: 18 })
  const ringY = useSpring(0, { stiffness: 120, damping: 18 })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    dotX.set(x)
    dotY.set(y)
    ringX.set(x)
    ringY.set(y)
  }, [x, y, dotX, dotY, ringX, ringY])

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('[data-cursor="hidden"]')) {
        setCursorVariant('hidden')
      } else if (target.closest('[data-cursor="hover"]')) {
        setCursorVariant('hover')
      } else {
        setCursorVariant('default')
      }
    }

    window.addEventListener('mouseover', handleMouseOver)
    return () => window.removeEventListener('mouseover', handleMouseOver)
  }, [])

  if (!mounted) return null

  if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
    return null
  }

  const hidden = cursorVariant === 'hidden'

  return (
    <>
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: dotX,
          y: dotY,
          width: '5px',
          height: '5px',
          borderRadius: '9999px',
          backgroundColor: '#1A1714',
          pointerEvents: 'none',
          zIndex: 9999,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: hidden ? 0 : 1,
          scale: hidden ? 0 : 1,
        }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      />

      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: ringX,
          y: ringY,
          width: '32px',
          height: '32px',
          borderRadius: '9999px',
          border: '1px solid #C4614A',
          pointerEvents: 'none',
          zIndex: 9999,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: hidden ? 0 : cursorVariant === 'hover' ? 1.6 : 1,
          backgroundColor: cursorVariant === 'hover' ? 'rgba(196,97,74,0.08)' : 'rgba(196,97,74,0)',
          opacity: hidden ? 0 : 1,
        }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      />
    </>
  )
}
