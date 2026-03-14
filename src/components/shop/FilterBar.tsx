'use client'

interface FilterBarProps {
  activeCategory: string
  activeSort: string
  onCategoryChange: (v: string) => void
  onSortChange: (v: string) => void
}

const CATEGORIES = [
  { label: 'All', value: '' },
  { label: 'Self-Care', value: 'self-care' },
  { label: 'Accessories', value: 'accessories' },
]

export default function FilterBar({ activeCategory, activeSort, onCategoryChange, onSortChange }: FilterBarProps) {
  return (
    <div
      style={{
        position: 'sticky',
        top: '72px',
        zIndex: 40,
        backgroundColor: 'rgba(250,248,244,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E8E0D8',
      }}
    >
      <div
        style={{
          padding: '1rem clamp(1.5rem, 6vw, 5rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                padding: '0.5rem 1.25rem',
                borderRadius: 0,
                cursor: 'pointer',
                transition: 'all 200ms ease',
                border: activeCategory === cat.value ? '1px solid #1A1714' : '1px solid #E8E0D8',
                backgroundColor: activeCategory === cat.value ? '#1A1714' : 'transparent',
                color: activeCategory === cat.value ? '#FAF8F4' : '#8C8078',
              }}
              onMouseEnter={(e) => {
                if (activeCategory !== cat.value) {
                  e.currentTarget.style.borderColor = '#1A1714'
                  e.currentTarget.style.color = '#1A1714'
                }
              }}
              onMouseLeave={(e) => {
                if (activeCategory !== cat.value) {
                  e.currentTarget.style.borderColor = '#E8E0D8'
                  e.currentTarget.style.color = '#8C8078'
                }
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <select
          value={activeSort}
          onChange={(e) => onSortChange(e.target.value)}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #E8E0D8',
            color: '#8C8078',
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            padding: '0.5rem 0.75rem',
            borderRadius: 0,
            outline: 'none',
          }}
        >
          <option value='featured'>Featured</option>
          <option value='price-asc'>Price: Low to High</option>
          <option value='price-desc'>Price: High to Low</option>
          <option value='newest'>Newest</option>
        </select>
      </div>
    </div>
  )
}
