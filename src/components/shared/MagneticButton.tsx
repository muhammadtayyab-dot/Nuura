'use client'

import { useRef } from 'react'
import { motion, useSpring } from 'framer-motion'
import Link from 'next/link'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
  href?: string
  strength?: number
}

export function MagneticButton({
  children,
  className = '',
  style,
  onClick,
  href,
  strength = 0.35,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useSpring(0, { stiffness: 300, damping: 28 })
  const y = useSpring(0, { stiffness: 300, damping: 28 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * strength)
    y.set((e.clientY - cy) * strength)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const inner = (
    <motion.div
      ref={ref}
      style={{ x, y, display: 'inline-block', ...style }}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor="hover"
    >
      {children}
    </motion.div>
  )

  if (href) return <Link href={href} style={{ textDecoration: 'none' }}>{inner}</Link>
  return <div onClick={onClick} style={{ display: 'inline-block', cursor: 'none' }}>{inner}</div>
}