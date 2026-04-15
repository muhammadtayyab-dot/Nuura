'use client'

import { ReactLenis } from 'lenis/react'
import { useEffect, useState } from 'react'

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // Default to disabled so mobile never "briefly" mounts Lenis on first paint.
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    try {
      const prefersReduced = Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches)

      // Be strict: only enable on real "desktop" environments.
      // This avoids post-hydration layout shifts on mobile where Lenis applies transforms.
      const canHover = Boolean(window.matchMedia?.('(hover: hover)')?.matches)
      const finePointer = Boolean(window.matchMedia?.('(pointer: fine)')?.matches)
      const wideScreen = typeof window.innerWidth === 'number' ? window.innerWidth >= 1024 : false

      setEnabled(!prefersReduced && canHover && finePointer && wideScreen)
    } catch {
      setEnabled(false)
    }
  }, [])

  if (!enabled) return <>{children}</>

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.4,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  )
}
