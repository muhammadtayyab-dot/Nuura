'use client'

import { useState } from 'react'
import { Star, ThumbsUp, Camera } from 'lucide-react'

interface Review {
  id: number
  name: string
  city: string
  rating: number
  date: string
  title: string
  body: string
  verified: boolean
  helpful: number
  hasPhoto?: boolean
}

// Hardcoded reviews pool — realistic Pakistani customer reviews
const REVIEW_POOL: Review[] = [
  { id: 1, name: 'Ayesha M.', city: 'Lahore', rating: 5, date: '2 weeks ago', title: 'Absolutely love it!', body: 'I was skeptical at first but this product exceeded all my expectations. The quality is amazing and it actually works. Been using it for 2 weeks and already see a difference in my skin. Will definitely order again!', verified: true, helpful: 24 },
  { id: 2, name: 'Sana R.', city: 'Karachi', rating: 5, date: '1 month ago', title: 'Best purchase of the year', body: 'Ordered this after seeing it on Instagram and I\'m so glad I did. Fast delivery, beautiful packaging, and the product itself is top notch. Nuura never disappoints!', verified: true, helpful: 18, hasPhoto: true },
  { id: 3, name: 'Fatima K.', city: 'Islamabad', rating: 4, date: '3 weeks ago', title: 'Great quality, worth the price', body: 'Really happy with this purchase. It\'s exactly as described and the packaging is gorgeous. Would give 5 stars but delivery took a bit longer than expected. Product itself is perfect though!', verified: true, helpful: 11 },
  { id: 4, name: 'Zara H.', city: 'Lahore', rating: 5, date: '5 days ago', title: 'My skin is glowing!', body: 'Started using this in my morning routine and oh my goodness the results are incredible. My puffiness is gone and my skincare products absorb so much better now. 10/10 recommend!', verified: true, helpful: 32 },
  { id: 5, name: 'Noor A.', city: 'Faisalabad', rating: 4, date: '2 months ago', title: 'Lovely product', body: 'Really nice quality. I bought this as a gift for my sister and she absolutely loved it. The presentation box is beautiful and it looks very luxurious. Will order more as gifts!', verified: true, helpful: 9 },
  { id: 6, name: 'Hira B.', city: 'Karachi', rating: 5, date: '1 week ago', title: 'Game changer!', body: 'This has completely changed my skincare routine. I use it every morning and my face feels so much more sculpted and lifted. The quality is amazing for this price point. Highly recommend to everyone!', verified: true, helpful: 41, hasPhoto: true },
  { id: 7, name: 'Maria S.', city: 'Rawalpindi', rating: 3, date: '6 weeks ago', title: 'Good but takes time', body: 'Product is good quality. I was expecting faster results but my friend told me to be more consistent. Been using it for 3 weeks and starting to see some improvement. Packaging is beautiful.', verified: true, helpful: 5 },
  { id: 8, name: 'Amna T.', city: 'Multan', rating: 5, date: '3 days ago', title: 'Exceeded expectations!', body: 'I\'ve been eyeing this for months and finally ordered it. Worth every rupee! The quality is premium and it genuinely makes a difference. Customer service was also very helpful when I had questions.', verified: true, helpful: 15 },
]

const RATING_DIST: Record<number, number> = { 5: 68, 4: 18, 3: 8, 2: 3, 1: 3 }

function StarRating({ rating, interactive = false, onRate }: { rating: number; interactive?: boolean; onRate?: (r: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={interactive ? 20 : 13}
          strokeWidth={1}
          onMouseEnter={() => interactive && setHover(s)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onRate?.(s)}
          style={{
            cursor: interactive ? 'pointer' : 'default',
            fill: s <= (hover || rating) ? '#D4A853' : 'transparent',
            color: s <= (hover || rating) ? '#D4A853' : '#C0BAB0',
            transition: 'all 150ms',
          }}
        />
      ))}
    </div>
  )
}

export default function ReviewsSection({ productSlug, productName }: { productSlug: string; productName: string }) {
  const [showForm, setShowForm] = useState(false)
  const [newRating, setNewRating] = useState(0)
  const [filter, setFilter] = useState<number | null>(null)
  const [helpfulIds, setHelpfulIds] = useState<number[]>([])
  const [visibleCount, setVisibleCount] = useState(4)

  // Deterministic "random" reviews per slug so same product always shows same reviews
  const seed = productSlug.length % REVIEW_POOL.length
  const reviews = [...REVIEW_POOL.slice(seed), ...REVIEW_POOL.slice(0, seed)]
  const filtered = filter ? reviews.filter((r) => r.rating === filter) : reviews
  const visible = filtered.slice(0, visibleCount)

  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)

  function toggleHelpful(id: number) {
    setHelpfulIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300, color: '#1B2E1F', marginBottom: '2.5rem' }}>
        Customer Reviews
      </h2>

      {/* Rating summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2.5rem', alignItems: 'center', marginBottom: '2.5rem', maxWidth: '600px' }}>
        {/* Big number */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: 300, color: '#1B2E1F', lineHeight: 1 }}>{avgRating}</div>
          <StarRating rating={Math.round(Number(avgRating))} />
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: '#8A8A8A', marginTop: '0.25rem' }}>{reviews.length} reviews</div>
        </div>

        {/* Bar chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {[5, 4, 3, 2, 1].map((stars) => (
            <button
              key={stars}
              onClick={() => setFilter(filter === stars ? null : stars)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'none', border: 0, cursor: 'pointer', padding: '2px 0' }}
            >
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: '#6B6B6B', minWidth: '8px' }}>{stars}</span>
              <Star size={10} style={{ fill: '#D4A853', color: '#D4A853' }} />
              <div style={{ flex: 1, height: '6px', backgroundColor: '#E5E0D8', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${RATING_DIST[stars]}%`, height: '100%', backgroundColor: filter === stars ? '#1B2E1F' : '#D4A853', borderRadius: '3px', transition: 'all 300ms' }} />
              </div>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: '#8A8A8A', minWidth: '28px', textAlign: 'right' }}>{RATING_DIST[stars]}%</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter indicator */}
      {filter && (
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#6B6B6B' }}>Showing {filter}-star reviews</span>
          <button onClick={() => setFilter(null)} style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: '#1B2E1F', background: 'none', border: '1px solid #DDD8CF', padding: '3px 10px', cursor: 'pointer' }}>Clear</button>
        </div>
      )}

      {/* Review cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
        {visible.map((review) => (
          <div key={review.id} style={{ backgroundColor: '#FAFAF8', border: '1px solid #EDE8E0', padding: '1.5rem', borderRadius: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#1B2E1F', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#D4A853', fontWeight: 600 }}>{review.name.charAt(0)}</span>
                  </div>
                  <div>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: '#1B2E1F' }}>{review.name}</span>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: '#8A8A8A', marginLeft: '0.4rem' }}>· {review.city}</span>
                  </div>
                </div>
                <StarRating rating={review.rating} />
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: '#8A8A8A' }}>{review.date}</div>
                {review.verified && (
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: '#6B9E7A', letterSpacing: '0.05em' }}>✓ Verified Purchase</div>
                )}
                {review.hasPhoto && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem', color: '#8A8A8A' }}>
                    <Camera size={10} />
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px' }}>With photo</span>
                  </div>
                )}
              </div>
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: '#1B2E1F', marginBottom: '0.4rem' }}>{review.title}</p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#4A4A4A', lineHeight: 1.7, marginBottom: '1rem' }}>{review.body}</p>
            <button
              onClick={() => toggleHelpful(review.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: '1px solid #DDD8CF', padding: '5px 12px', cursor: 'pointer', borderRadius: '2px' }}
            >
              <ThumbsUp size={11} style={{ color: helpfulIds.includes(review.id) ? '#1B2E1F' : '#8A8A8A' }} />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: '#6B6B6B' }}>
                Helpful ({review.helpful + (helpfulIds.includes(review.id) ? 1 : 0)})
              </span>
            </button>
          </div>
        ))}
      </div>

      {/* Load more */}
      {visibleCount < filtered.length && (
        <button
          onClick={() => setVisibleCount((v) => v + 4)}
          style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', border: '1px solid #1B2E1F', backgroundColor: 'transparent', color: '#1B2E1F', padding: '0.875rem 2rem', cursor: 'pointer', display: 'block', margin: '0 auto 2rem', transition: 'all 200ms' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1B2E1F'; e.currentTarget.style.color = '#F5F0E6' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#1B2E1F' }}
        >
          Load More Reviews
        </button>
      )}

      {/* Write a review */}
      <div style={{ borderTop: '1px solid #DDD8CF', paddingTop: '2rem' }}>
        {!showForm ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 300, color: '#1B2E1F', margin: '0 0 0.25rem' }}>Share your experience</p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#8A8A8A', margin: 0 }}>Help others make better choices</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', backgroundColor: '#1B2E1F', color: '#F5F0E6', border: 0, padding: '0.875rem 2rem', cursor: 'pointer' }}
            >
              Write a Review
            </button>
          </div>
        ) : (
          <div style={{ backgroundColor: '#FAFAF8', border: '1px solid #EDE8E0', padding: '2rem', borderRadius: '4px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 300, color: '#1B2E1F', marginBottom: '1.5rem' }}>Review {productName}</h3>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6B6B6B', display: 'block', marginBottom: '0.5rem' }}>Your Rating *</label>
              <StarRating rating={newRating} interactive onRate={setNewRating} />
            </div>
            {[
              { label: 'Your Name *', placeholder: 'e.g. Ayesha M.', type: 'text' },
              { label: 'Review Title *', placeholder: 'Sum up your experience', type: 'text' },
            ].map((field) => (
              <div key={field.label} style={{ marginBottom: '1rem' }}>
                <label style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6B6B6B', display: 'block', marginBottom: '0.4rem' }}>{field.label}</label>
                <input type={field.type} placeholder={field.placeholder} style={{ width: '100%', padding: '0.75rem', border: '1px solid #DDD8CF', fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#1B2E1F', backgroundColor: '#FFFFFF', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6B6B6B', display: 'block', marginBottom: '0.4rem' }}>Your Review *</label>
              <textarea rows={4} placeholder="Tell us what you think..." style={{ width: '100%', padding: '0.75rem', border: '1px solid #DDD8CF', fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#1B2E1F', resize: 'vertical', backgroundColor: '#FFFFFF', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setShowForm(false)}
                style={{ flex: 1, padding: '0.875rem', fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', backgroundColor: '#1B2E1F', color: '#F5F0E6', border: 0, cursor: 'pointer' }}
              >
                Submit Review
              </button>
              <button
                onClick={() => setShowForm(false)}
                style={{ padding: '0.875rem 1.5rem', fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', backgroundColor: 'transparent', color: '#6B6B6B', border: '1px solid #DDD8CF', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
