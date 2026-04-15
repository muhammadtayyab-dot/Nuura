'use client'

import { useEffect } from 'react'

function clampToLeft() {
  try {
    const docEl = document.documentElement
    const body = document.body

    if (docEl && docEl.scrollLeft !== 0) docEl.scrollLeft = 0
    if (body && body.scrollLeft !== 0) body.scrollLeft = 0

    if (typeof window !== 'undefined' && window.scrollX !== 0) {
      window.scrollTo({ left: 0, top: window.scrollY })
    }
  } catch {
    // ignore
  }
}

export function NoHorizontalScroll() {
  useEffect(() => {
    // Run a few times after mount to catch:
    // - hydration/layout shifts
    // - font loading reflows
    // - late-loading content that briefly creates horizontal overflow
    clampToLeft()

    const timeouts = [
      window.setTimeout(clampToLeft, 50),
      window.setTimeout(clampToLeft, 250),
      window.setTimeout(clampToLeft, 1000),
      window.setTimeout(clampToLeft, 3000),
    ]

    // Also after fonts are ready (if supported).
    const fontsReady = (document as any).fonts?.ready
    if (fontsReady && typeof fontsReady.then === 'function') {
      fontsReady.then(clampToLeft).catch(() => {})
    }

    const onResize = () => clampToLeft()
    window.addEventListener('resize', onResize, { passive: true })

    // If the browser ever horizontally scrolls the root, snap back.
    const onScroll = () => {
      const docEl = document.documentElement
      const body = document.body
      if ((docEl && docEl.scrollLeft !== 0) || (body && body.scrollLeft !== 0)) {
        clampToLeft()
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      for (const t of timeouts) window.clearTimeout(t)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return null
}
