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
    <div className="sticky top-[72px] z-40 bg-[--color-nuura-warm-white]/90 backdrop-blur-sm border-b border-[--color-nuura-nude]/40">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className={[
                'font-sans text-[9px] tracking-widest uppercase px-4 py-2 border transition-colors duration-200',
                activeCategory === cat.value
                  ? 'bg-[--color-nuura-charcoal] text-white border-[--color-nuura-charcoal]'
                  : 'text-[--color-nuura-muted] border-[--color-nuura-nude] hover:border-[--color-nuura-charcoal] hover:text-[--color-nuura-charcoal]',
              ].join(' ')}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <select
          value={activeSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="font-sans text-[9px] tracking-wider uppercase bg-transparent border border-[--color-nuura-nude] text-[--color-nuura-muted] px-3 py-2 focus:outline-none focus:border-[--color-nuura-charcoal] cursor-pointer"
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>
    </div>
  )
}

