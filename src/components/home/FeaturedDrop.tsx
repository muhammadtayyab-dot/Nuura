'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ProductCard from '@/components/shop/ProductCard'
import { MOCK_PRODUCTS } from '@/lib/mockData'

gsap.registerPlugin(ScrollTrigger)

export default function FeaturedDrop() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (!sectionRef.current) return
      const cards = sectionRef.current.querySelectorAll('.featured-card')
      gsap.fromTo(
        cards,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.16,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        }
      )
    },
    { scope: sectionRef }
  )

  const featured = MOCK_PRODUCTS.slice(0, 3)

  return (
    <section ref={sectionRef} className='bg-[#0D0B09] py-32 px-8 md:px-16 lg:px-24'>
      <div className='flex justify-between items-end mb-20 gap-8'>
        <div>
          <div className='flex items-center gap-3 mb-6'>
            <span className='gold-line' />
            <p className='font-sans text-[10px] tracking-[0.4em] uppercase text-[#C9A84C]'>
              Featured Drop
            </p>
          </div>
          <h2
            className='font-display font-light text-[#F2EDE4]'
            style={{ fontSize: 'clamp(2.5rem,5vw,4rem)' }}
          >
            This season&apos;s obsessions.
          </h2>
        </div>

        <Link
          href='/shop'
          data-cursor='hover'
          className='inline-flex items-center gap-2 font-sans text-xs tracking-[0.2em] uppercase text-[#C9A84C] hover:text-[#E8C97A] transition-colors'
        >
          View All
          <ArrowRight size={14} strokeWidth={1.5} />
        </Link>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {featured.map((product) => (
          <div key={product.slug} className='featured-card'>
            <ProductCard product={product as any} />
          </div>
        ))}
      </div>
    </section>
  )
}
