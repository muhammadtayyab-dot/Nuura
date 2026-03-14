'use client'

interface MarqueeProps {
  variant?: 'dark' | 'gold'
  reverse?: boolean
}

const ITEMS = 'Self-Care  ✦  Glow Up  ✦  Curated Drops  ✦  Aesthetic  ✦  New Arrivals  ✦  Limited Edition  ✦  Nuura  ✦  نور  ✦  '

export default function Marquee({ variant = 'dark', reverse = false }: MarqueeProps) {
  const text = ITEMS.repeat(8)
  const animationClass = variant === 'gold' ? 'animate-marquee' : 'animate-marquee-slow'

  return (
    <div
      className={[
        'w-full overflow-hidden',
        variant === 'gold'
          ? 'bg-[#C9A84C] py-4'
          : 'bg-[#0D0B09] border-y border-[#2A2520] py-5',
      ].join(' ')}
    >
      <div
        className={[
          'flex whitespace-nowrap w-max',
          animationClass,
          reverse ? '[animation-direction:reverse]' : '',
        ].join(' ')}
      >
        <span
          className={[
            'font-sans text-xs tracking-[0.3em] uppercase pr-0',
            variant === 'gold' ? 'text-[#0D0B09]' : 'text-[#B8B0A4]/40',
          ].join(' ')}
        >
          {text}
        </span>
        <span
          className={[
            'font-sans text-xs tracking-[0.3em] uppercase',
            variant === 'gold' ? 'text-[#0D0B09]' : 'text-[#B8B0A4]/40',
          ].join(' ')}
          aria-hidden="true"
        >
          {text}
        </span>
      </div>
    </div>
  )
}
