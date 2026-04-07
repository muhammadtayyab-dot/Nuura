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
        backgroundColor: 'rgba(27,46,31,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(245,240,230,0.1)',
      }}
    >
      <div style={{ padding: '1rem clamp(1.5rem, 6vw, 5rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
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
                border: activeCategory === cat.value ? '1px solid #D4A853' : '1px solid rgba(245,240,230,0.15)',
                backgroundColor: activeCategory === cat.value ? '#D4A853' : 'transparent',
                color: activeCategory === cat.value ? '#1B2E1F' : 'rgba(245,240,230,0.6)',
              }}
              onMouseEnter={(e) => {
                if (activeCategory !== cat.value) {
                  e.currentTarget.style.borderColor = '#D4A853'
                  e.currentTarget.style.color = '#F5F0E6'
                }
              }}
              onMouseLeave={(e) => {
                if (activeCategory !== cat.value) {
                  e.currentTarget.style.borderColor = 'rgba(245,240,230,0.15)'
                  e.currentTarget.style.color = 'rgba(245,240,230,0.6)'
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
            backgroundColor: '#0F1A11',
            border: '1px solid rgba(245,240,230,0.15)',
            color: '#F5F0E6',
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
