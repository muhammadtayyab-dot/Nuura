'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { AnimatedText } from '@/components/shared/AnimatedText'

gsap.registerPlugin(ScrollTrigger)

export default function BrandStory() {
  const sectionRef = useRef<HTMLElement>(null)
  const backCardRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!sectionRef.current || !backCardRef.current) return
      gsap.fromTo(
        backCardRef.current,
        { rotation: -6 },
        {
          rotation: -2,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'center center',
            scrub: 1.5,
          },
        }
      )
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className='bg-[#141210] py-32 px-8 md:px-16 lg:px-24'>
      <div className='grid grid-cols-1 md:grid-cols-[40%_60%] gap-16 items-center'>
        <div className='relative aspect-[4/5]'>
          <div
            ref={backCardRef}
            className='absolute top-8 left-8 right-0 bottom-0 bg-[#C9A84C]/10 border border-[#C9A84C]/20'
            style={{ transform: 'rotate(-4deg)' }}
          />

          <div className='relative z-10 h-full bg-[#1C1916] border border-[#2A2520] flex flex-col items-center justify-center gap-4'>
            <p className='font-accent text-7xl text-[#C9A84C]/30'>نور</p>
            <p className='font-sans text-xs tracking-[0.4em] uppercase text-[#8B7340]'>
              Light
            </p>
          </div>
        </div>

        <div>
          <div className='flex items-center gap-3 mb-6'>
            <span className='gold-line' />
            <p className='font-sans text-[10px] tracking-[0.4em] uppercase text-[#C9A84C]'>
              Our Philosophy
            </p>
          </div>

          <div
            className='font-display font-light leading-[1.1] text-[#F2EDE4]'
            style={{ fontSize: 'clamp(1.8rem,3.5vw,3rem)' }}
          >
            <AnimatedText text='We do not sell products. We curate rituals.' tag='h2' />
          </div>

          <div className='mt-8 flex flex-col gap-4 max-w-xl'>
            <p className='font-sans text-sm leading-relaxed text-[#B8B0A4]'>
              Nuura is an editorial curation of tactile objects, elevated essentials, and self-care tools that feel intentional from shelf to skin.
            </p>
            <p className='font-sans text-sm leading-relaxed text-[#B8B0A4]'>
              We choose less, but better. Every piece is selected for utility, beauty, and how it fits your daily ritual.
            </p>
          </div>

          <Link
            href='/shop'
            data-cursor='hover'
            className='inline-block mt-10 font-sans text-xs tracking-[0.2em] uppercase text-[#C9A84C] border-b border-[#C9A84C]/40 hover:text-[#E8C97A] transition-colors'
          >
            Explore the Edit {'->'}
          </Link>
        </div>
      </div>
    </section>
  )
}
