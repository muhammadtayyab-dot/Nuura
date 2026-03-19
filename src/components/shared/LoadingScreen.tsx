'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export function LoadingScreen() {
  const [visible, setVisible] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const alreadyLoaded = sessionStorage.getItem('nuura-loaded')
    if (alreadyLoaded) {
      setVisible(false)
      setHasLoaded(true)
      return
    }
    const timer = setTimeout(() => {
      setVisible(false)
      sessionStorage.setItem('nuura-loaded', 'true')
    }, 2200)
    return () => clearTimeout(timer)
  }, [])

  if (hasLoaded) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.1 } }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: '#FAF8F4',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
          }}
        >
          {/* Logo reveal */}
          <div style={{ overflow: 'hidden' }}>
            <motion.div
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
              style={{
                fontFamily: 'var(--font-accent)',
                fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                letterSpacing: '0.5em',
                color: '#1A1714',
                textTransform: 'uppercase',
                paddingRight: '0.5em',
              }}
            >
              NUURA
            </motion.div>
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(14px, 2vw, 18px)',
              color: '#8C8078',
              fontStyle: 'italic',
              letterSpacing: '0.05em',
            }}
          >
            Glow in your own light
          </motion.p>

          {/* Progress line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: '2px',
              width: '100%',
              background: '#C4614A',
              transformOrigin: 'left',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}