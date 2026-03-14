'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'

const ease: [number, number, number, number] = [0.76, 0, 0.24, 1]

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen)
  const closeCart = useCartStore((s) => s.closeCart)
  const items = useCartStore((s) => s.items)
  const totalPrice = useCartStore((s) => s.totalPrice())
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const router = useRouter()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key='backdrop'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 70,
              backgroundColor: 'rgba(26,23,20,0.5)',
              backdropFilter: 'blur(4px)',
            }}
            onClick={closeCart}
          />

          <motion.aside
            key='drawer'
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 80,
              width: '100%',
              maxWidth: '420px',
              backgroundColor: '#FAF8F4',
              borderLeft: '1px solid #E8E0D8',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 2rem', borderBottom: '1px solid #E8E0D8' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: '#1A1714' }}>Your Cart</h2>
              <button
                onClick={closeCart}
                aria-label='Close'
                style={{ padding: '0.5rem', color: '#8C8078', background: 'transparent', border: 0, transition: 'color 200ms ease' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#1A1714'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#8C8078'
                }}
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <div style={{ padding: '0.5rem 2rem', flex: 1, overflowY: 'auto' }}>
              {items.length === 0 ? (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '0.75rem' }}>
                  <ShoppingBag size={48} strokeWidth={1.1} style={{ color: '#E8E0D8' }} />
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: '#1A1714' }}>Your cart is empty</p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#8C8078' }}>Add something beautiful.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {items.map((item) => (
                    <div key={item.product._id} style={{ display: 'flex', gap: '1rem', padding: '1.25rem 0', borderBottom: '1px solid #E8E0D8' }}>
                      <div style={{ width: '80px', height: '80px', position: 'relative', backgroundColor: '#F2EDE4', flexShrink: 0, overflow: 'hidden' }}>
                        {item.product.images?.[0] && <Image src={item.product.images[0]} alt={item.product.name} fill style={{ objectFit: 'cover' }} sizes='80px' />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: '#1A1714', lineHeight: 1.2 }}>{item.product.name}</p>
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: '#8C8078', marginTop: '0.25rem' }}>{item.product.tagline}</p>
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#C4614A', marginTop: '0.35rem' }}>PKR {item.product.price.toLocaleString()}</p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.7rem' }}>
                        <button
                          onClick={() => removeItem(item.product._id)}
                          style={{ color: '#8C8078', background: 'transparent', border: 0, transition: 'color 200ms ease' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#C4614A'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#8C8078'
                          }}
                          aria-label='Remove item'
                        >
                          <Trash2 size={14} strokeWidth={1.5} />
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                            style={{ padding: '0.25rem', color: '#8C8078', background: 'transparent', border: 0 }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = '#1A1714'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = '#8C8078'
                            }}
                          >
                            <Minus size={12} strokeWidth={1.5} />
                          </button>
                          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#8C8078', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                            style={{ padding: '0.25rem', color: '#8C8078', background: 'transparent', border: 0 }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = '#1A1714'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = '#8C8078'
                            }}
                          >
                            <Plus size={12} strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid #E8E0D8', backgroundColor: '#F2EDE4' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: '#8C8078', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Subtotal</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: '#1A1714' }}>PKR {totalPrice.toLocaleString()}</span>
                </div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: '#8C8078', marginTop: '0.45rem' }}>Shipping calculated at checkout.</p>

                <button
                  onClick={() => {
                    closeCart()
                    router.push('/checkout')
                  }}
                  style={{
                    marginTop: '1rem',
                    width: '100%',
                    padding: '1rem',
                    backgroundColor: '#1A1714',
                    color: '#FAF8F4',
                    border: 0,
                    borderRadius: 0,
                    fontFamily: 'var(--font-sans)',
                    fontSize: '11px',
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    transition: 'background-color 250ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#C4614A'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#1A1714'
                  }}
                >
                  Checkout
                </button>

                <button
                  onClick={closeCart}
                  style={{
                    width: '100%',
                    marginTop: '0.9rem',
                    background: 'transparent',
                    border: 0,
                    fontFamily: 'var(--font-sans)',
                    fontSize: '11px',
                    color: '#8C8078',
                    textDecoration: 'underline',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#1A1714'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#8C8078'
                  }}
                >
                  Continue shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
