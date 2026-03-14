'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { MagneticButton } from '@/components/shared/MagneticButton'

const lineEase: [number, number, number, number] = [0.76, 0, 0.24, 1]

const stats = [
  { value: '06', label: 'SKUs' },
  { value: 'PKR 1500+', label: 'Starting Price' },
  { value: '5K+', label: 'Free Shipping' },
]

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const [imageFailed, setImageFailed] = useState(false)
  const heroImage = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=90'

  const { scrollY } = useScroll()
  const imageY = useTransform(scrollY, [0, 600], [0, -80])
  const indicatorOpacity = useTransform(scrollY, [0, 100], [1, 0])

  return (
    <section ref={sectionRef} className='min-h-screen bg-[#0D0B09]'>
      <div className='w-full max-w-[100vw] overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-screen'>
        <div className='flex flex-col justify-between pt-28 pl-8 md:pl-16 pr-8 pb-16 min-h-screen md:min-h-0 bg-[#0D0B09]'>
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className='flex items-center gap-3 mb-8'
            >
              <span className='gold-line' />
              <p className='font-sans text-[10px] tracking-[0.4em] uppercase text-[#C9A84C]'>
                New Collection - 2025
              </p>
            </motion.div>

            <div
              className='font-display font-light leading-[0.92] text-[#F2EDE4]'
              style={{ fontSize: 'clamp(3rem, 7vw, 7.5rem)' }}
            >
              {[
                { text: 'Your', italic: false, gold: false },
                { text: 'glow,', italic: true, gold: false },
                { text: 'your', italic: false, gold: false },
                { text: 'ritual.', italic: true, gold: true },
              ].map((line, i) => (
                <div key={line.text} className='overflow-hidden'>
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: '0%' }}
                    transition={{
                      duration: 0.9,
                      ease: lineEase,
                      delay: 0.3 + i * 0.1,
                    }}
                    className={[
                      line.italic ? 'italic' : '',
                      line.gold ? 'text-[#C9A84C]' : 'text-[#F2EDE4]',
                    ].join(' ')}
                  >
                    {line.text}
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          <div className='mt-auto pt-12'>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className='font-sans text-sm leading-relaxed text-[#B8B0A4] max-w-xs'
            >
              Curated self-care and aesthetic accessories. For the woman who moves with intention.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              className='mt-8 flex items-center gap-8 flex-wrap'
            >
              <MagneticButton href='/shop'>
                <span className='inline-block border border-[#C9A84C] text-[#C9A84C] px-8 py-3.5 font-sans text-xs tracking-[0.2em] uppercase hover:bg-[#C9A84C] hover:text-[#0D0B09] transition-all duration-300'>
                  Shop the Drop
                </span>
              </MagneticButton>
              <Link
                href='/shop'
                data-cursor='hover'
                className='font-sans text-xs tracking-[0.2em] uppercase text-[#B8B0A4] hover:text-[#F2EDE4] transition-colors'
              >
                Explore All {'->'}
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              className='mt-12 pt-8 border-t border-[#2A2520] grid grid-cols-3'
            >
              {stats.map((s, i) => (
                <div key={s.label} className={i < 2 ? 'border-r border-[#2A2520] pr-3 md:pr-6' : 'pl-3 md:pl-6'}>
                  <p className='font-display text-3xl text-[#F2EDE4]'>
                    {s.value}
                  </p>
                  <p className='font-sans text-[9px] tracking-[0.25em] uppercase text-[#8B7340] mt-1'>
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <div
          className='relative overflow-hidden h-screen'
          style={{
            background: 'linear-gradient(135deg, #1C1916 0%, #2A2520 50%, #1C1916 100%)',
          }}
        >
          <div className='absolute inset-0 flex items-center justify-center'>
            <span className='font-accent text-[20vw] leading-none text-[#C9A84C]/10'>نور</span>
          </div>
          {!imageFailed && (
            <motion.div style={{ y: imageY }} className='absolute inset-0'>
              <Image
                src={heroImage}
                alt='Nuura — Glow Kit'
                fill
                className='object-cover object-center'
                priority
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  setImageFailed(true)
                }}
              />
            </motion.div>
          )}
          <div className='absolute inset-0 bg-[#0D0B09]/20' />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.7 }}
            className='absolute bottom-10 left-8 bg-[#0D0B09]/80 backdrop-blur-md border border-[#2A2520] px-6 py-5'
          >
            <p className='font-sans text-[9px] tracking-[0.3em] uppercase text-[#C9A84C] mb-2'>
              New Arrival
            </p>
            <p className='font-display text-2xl text-[#F2EDE4]'>Glow Kit 2025</p>
            <p className='font-sans text-sm text-[#B8B0A4] mt-1'>PKR 2,800</p>
          </motion.div>

          <motion.div
            animate={{ rotate: 405 }}
            transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
            className='absolute top-8 right-8 w-12 h-12 border border-[#C9A84C]/30 opacity-50'
          />
        </div>
      </div>

      <motion.div
        style={{ opacity: indicatorOpacity }}
        className='absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none'
      >
        <p className='font-sans text-[9px] tracking-[0.4em] uppercase text-[#8B7340]'>Scroll</p>
        <motion.span
          animate={{ y: [0, 6, 0], height: [20, 40, 20] }}
          transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity }}
          className='w-px bg-[#C9A84C] h-10'
        />
      </motion.div>
    </section>
  )
}
