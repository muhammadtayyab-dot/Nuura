'use client'

import { useState } from 'react'
import { Product } from '@/types'

const TAB_STYLE = {
  fontFamily: 'var(--font-sans)',
  fontSize: '11px',
  letterSpacing: '0.2em',
  textTransform: 'uppercase' as const,
  padding: '0.875rem 1.5rem',
  border: 0,
  cursor: 'pointer',
  transition: 'all 200ms ease',
}

// Hardcoded product-specific content by category — looks real, not generic
const HOW_TO_USE: Record<string, string[]> = {
  'self-care': [
    'Cleanse your face thoroughly before use',
    'Apply your preferred serum or facial oil',
    'Use gentle upward and outward strokes',
    'Focus on areas with puffiness or tension',
    'Use daily for best results — morning or evening',
    'Clean with warm water after each use',
  ],
  'accessories': [
    'Pair with any outfit for an elevated look',
    'Store in the dust bag when not in use',
    'Avoid contact with water and perfume',
    'Clean gently with a soft dry cloth',
  ],
}

const INGREDIENTS: Record<string, { name: string; benefit: string }[]> = {
  'self-care': [
    { name: 'Rose Quartz / Jade Stone', benefit: 'Natural cooling properties to reduce puffiness' },
    { name: 'Hyaluronic Acid (compatible)', benefit: 'Works best with hydrating serums' },
    { name: 'Nano Ionic Steam', benefit: 'Opens pores and boosts product absorption' },
    { name: 'LED Light Therapy', benefit: 'Stimulates collagen production' },
  ],
  'accessories': [
    { name: 'Premium Vegan Leather', benefit: 'Cruelty-free and durable' },
    { name: 'Gold-Tone Hardware', benefit: 'Tarnish-resistant finish' },
    { name: 'Microfibre Lining', benefit: 'Protects contents from scratches' },
  ],
}

export default function ProductTabs({ product }: { product: Product }) {
  const [active, setActive] = useState(0)

  const tabs = ['Description', 'How to Use', 'Details & Care', 'Shipping & Returns']
  const howTo = HOW_TO_USE[product.category] ?? HOW_TO_USE['self-care']
  const ingredients = INGREDIENTS[product.category] ?? INGREDIENTS['self-care']

  return (
    <div>
      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid #DDD8CF', marginBottom: '2.5rem', overflowX: 'auto' }}>
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActive(i)}
            style={{
              ...TAB_STYLE,
              backgroundColor: 'transparent',
              color: active === i ? '#1B2E1F' : '#8A8A8A',
              borderBottom: active === i ? '2px solid #D4A853' : '2px solid transparent',
              marginBottom: '-1px',
              whiteSpace: 'nowrap',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ maxWidth: '720px' }}>

        {/* Description */}
        {active === 0 && (
          <div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: '#3A3A3A', lineHeight: 1.85, marginBottom: '2rem' }}>
              {product.description}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {[
                { emoji: '🌿', title: 'Clean Beauty', desc: 'Made with skin-loving ingredients' },
                { emoji: '🇵🇰', title: 'Pakistan Delivery', desc: 'Ships nationwide in 3–5 days' },
                { emoji: '✨', title: 'Visible Results', desc: 'Backed by thousands of happy customers' },
                { emoji: '♻️', title: 'Sustainable', desc: 'Eco-conscious packaging' },
              ].map((item) => (
                <div key={item.title} style={{ backgroundColor: '#F0EBE3', padding: '1.25rem', borderRadius: '4px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '0.5rem' }}>{item.emoji}</div>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600, color: '#1B2E1F', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.title}</p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#6B6B6B' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How to Use */}
        {active === 1 && (
          <div>
            <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {howTo.map((step, i) => (
                <li key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#1B2E1F', color: '#D4A853', fontFamily: 'var(--font-sans)', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 600 }}>
                    {i + 1}
                  </span>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: '#3A3A3A', lineHeight: 1.7, margin: '4px 0 0' }}>{step}</p>
                </li>
              ))}
            </ol>
            <div style={{ marginTop: '2rem', backgroundColor: '#FFF8E7', border: '1px solid rgba(212,168,83,0.3)', padding: '1rem 1.25rem', borderRadius: '4px', display: 'flex', gap: '0.75rem' }}>
              <span style={{ fontSize: '18px' }}>💡</span>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#5A4A1A', margin: 0, lineHeight: 1.6 }}>
                <strong>Pro tip:</strong> Refrigerate your tool before use for an extra cooling, de-puffing effect.
              </p>
            </div>
          </div>
        )}

        {/* Details & Care */}
        {active === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1B2E1F', marginBottom: '1rem' }}>Key Components</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {ingredients.map((item) => (
                  <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0.875rem 0', borderBottom: '1px solid #EDE8E0' }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: '#1B2E1F' }}>{item.name}</span>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#6B6B6B', maxWidth: '55%', textAlign: 'right' }}>{item.benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1B2E1F', marginBottom: '1rem' }}>Care Instructions</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {['Wipe clean with a soft damp cloth', 'Store away from direct sunlight', 'Do not submerge in water', 'Keep away from extreme heat or cold', 'Handle with care — natural stone can chip if dropped'].map((item) => (
                  <li key={item} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                    <span style={{ color: '#D4A853', flexShrink: 0, fontWeight: 700 }}>·</span>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#4A4A4A' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Shipping & Returns */}
        {active === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {[
              {
                title: 'Delivery',
                items: [
                  'Standard delivery: 3–5 business days (PKR 200)',
                  'Free delivery on orders over PKR 5,000',
                  'Express delivery available in major cities: 1–2 days (PKR 400)',
                  'Cash on Delivery available nationwide',
                  'Same-day delivery in Lahore (order before 12pm)',
                ],
              },
              {
                title: 'Returns & Exchanges',
                items: [
                  'Easy 7-day return policy from date of delivery',
                  'Product must be unused and in original packaging',
                  'Contact us via WhatsApp or email to initiate a return',
                  'Refund processed within 5–7 business days',
                  'Exchange available for size/variant differences',
                ],
              },
            ].map((section) => (
              <div key={section.title}>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1B2E1F', marginBottom: '1rem' }}>{section.title}</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {section.items.map((item) => (
                    <li key={item} style={{ display: 'flex', gap: '0.6rem' }}>
                      <span style={{ color: '#6B9E7A', flexShrink: 0 }}>✓</span>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#4A4A4A' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
