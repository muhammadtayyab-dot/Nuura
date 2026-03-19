'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export function CustomCursor() {
  const [mounted, setMounted] = useState(false)
  const [isTouch, setIsTouch] = useState(false)
  const [variant, setVariant] = useState<'default' | 'hover' | 'text' | 'hidden'>('default')
  const [label, setLabel] = useState('')

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const dotX = useSpring(mouseX, { stiffness: 600, damping: 35 })
  const dotY = useSpring(mouseY, { stiffness: 600, damping: 35 })
  const ringX = useSpring(mouseX, { stiffness: 100, damping: 20 })
  const ringY = useSpring(mouseY, { stiffness: 100, damping: 20 })

  useEffect(() => {
    setMounted(true)
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)

    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      const hoverEl = t.closest('[data-cursor]') as HTMLElement | null
      if (!hoverEl) {
        setVariant('default')
        setLabel('')
        return
      }
      const type = hoverEl.dataset.cursor ?? 'hover'
      const lbl = hoverEl.dataset.cursorLabel ?? ''
      setVariant(type as 'default' | 'hover' | 'text' | 'hidden')
      setLabel(lbl)
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [mouseX, mouseY])

  if (!mounted || isTouch) return null

  const ringSize = variant === 'hover' ? 56 : variant === 'text' ? 80 : variant === 'hidden' ? 0 : 34
  const ringOpacity = variant === 'hidden' ? 0 : 1

  return (
    <>
      {/* Dot */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 5, height: 5,
          borderRadius: '50%',
          background: '#1A1714',
          pointerEvents: 'none',
          zIndex: 99998,
          x: dotX, y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{ opacity: variant === 'hidden' ? 0 : 1, scale: variant === 'hover' ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      />

      {/* Ring */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0, left: 0,
          borderRadius: '50%',
          border: '1.5px solid #C4614A',
          pointerEvents: 'none',
          zIndex: 99997,
          x: ringX, y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          opacity: ringOpacity,
          backgroundColor: variant === 'hover'
            ? 'rgba(196,97,74,0.1)'
            : 'transparent',
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {label && (
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '9px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#C4614A',
            whiteSpace: 'nowrap',
          }}>
            {label}
          </span>
        )}
      </motion.div>
    </>
  )
}