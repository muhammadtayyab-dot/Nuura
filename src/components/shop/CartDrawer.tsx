'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'

const C = { forest: '#1B2E1F', cream: '#F5F0E6', gold: '#D4A853', white: '#FAFAF8', ink: '#0F1A11', muted: '#6B7B6E', border: '#DDD8CF' }

export default function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, totalPrice } = useCartStore()
  const router = useRouter()
  const total = totalPrice()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            onClick={closeCart}
            style={{ position: 'fixed', inset: 0, background: 'rgba(11,26,15,0.5)', backdropFilter: 'blur(4px)', zIndex: 70 }} />

          <motion.div initial={{ x: '100%' }} animate={{ x: '0%' }} exit={{ x: '100%' }} transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '440px', background: C.white, zIndex: 80, display: 'flex', flexDirection: 'column' }}>

            <div style={{ padding: '1.75rem 2rem', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 300, color: C.ink, margin: 0 }}>Your Cart</h2>
              <button onClick={closeCart} data-cursor="hover" style={{ color: C.muted, background: 'transparent', border: 0, transition: 'color 200ms' }}
                onMouseEnter={e => { e.currentTarget.style.color = C.ink }} onMouseLeave={e => { e.currentTarget.style.color = C.muted }}>
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 2rem' }}>
              {items.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem', textAlign: 'center' }}>
                  <ShoppingBag size={52} strokeWidth={0.8} color={C.border} />
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: C.ink, fontWeight: 300 }}>Your cart is empty</p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: C.muted }}>Add something beautiful.</p>
                  <Link href="/shop" onClick={closeCart} data-cursor="hover"
                    style={{ display: 'inline-block', marginTop: '1rem', padding: '12px 32px', background: C.forest, color: C.cream, fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', textDecoration: 'none' }}>
                    Shop Now
                  </Link>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.product._id} style={{ display: 'flex', gap: '1rem', padding: '1.25rem 0', borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ width: '80px', height: '100px', flexShrink: 0, background: '#F0EBE3', position: 'relative', overflow: 'hidden' }}>
                      {item.product.images?.[0] && (
                        <Image src={item.product.images[0]} alt={item.product.name} fill style={{ objectFit: 'cover' }} sizes="80px" />
                      )}
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: C.ink, margin: '0 0 2px' }}>{item.product.name}</p>
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: C.muted, margin: 0 }}>PKR {item.product.price.toLocaleString()}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)} style={{ width: '28px', height: '28px', border: `1px solid ${C.border}`, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.ink }}>
                            <Minus size={12} />
                          </button>
                          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: C.ink, minWidth: '16px', textAlign: 'center' }}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)} style={{ width: '28px', height: '28px', border: `1px solid ${C.border}`, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.ink }}>
                            <Plus size={12} />
                          </button>
                        </div>
                        <button onClick={() => removeItem(item.product._id)} style={{ color: C.muted, background: 'transparent', border: 0, cursor: 'pointer', transition: 'color 200ms' }}
                          onMouseEnter={e => { e.currentTarget.style.color = '#C4614A' }} onMouseLeave={e => { e.currentTarget.style.color = C.muted }}>
                          <Trash2 size={14} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div style={{ padding: '1.5rem 2rem', borderTop: `1px solid ${C.border}`, background: '#F0EBE3' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted }}>Subtotal</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: C.ink }}>PKR {total.toLocaleString()}</span>
                </div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: C.muted, marginBottom: '1.25rem' }}>Free shipping on orders over PKR 5,000</p>
                <button onClick={() => { closeCart(); router.push('/checkout') }} data-cursor="hover"
                  style={{ width: '100%', padding: '16px', background: C.forest, color: C.cream, border: 'none', fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background 300ms' }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.gold; (e.currentTarget as HTMLButtonElement).style.color = C.forest }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.forest; (e.currentTarget as HTMLButtonElement).style.color = C.cream }}>
                  Proceed to Checkout
                </button>
                <button onClick={closeCart} style={{ width: '100%', padding: '10px', background: 'transparent', border: 'none', fontFamily: 'var(--font-sans)', fontSize: '11px', color: C.muted, cursor: 'pointer', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
